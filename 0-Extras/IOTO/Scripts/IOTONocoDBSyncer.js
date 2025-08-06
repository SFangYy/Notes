function IOTONocoDBSyncer(tp) {
  const IOTOUtility = tp.user.IOTOUtility(tp, app);
  const OBNote = tp.user.IOTOObNoteMaker();
  const ml = new (tp.user.IOTOMultiLangs(tp))();

  return class NocoDBSyncer extends IOTOUtility {
    /**
     * Constructor: Initialize the basic properties and settings required for the syncer
     * @param {Object} nocodb - NocoDB instance
     * @param {Object} tp - Templater instance
     * @param {Object} app - Obsidian app instance
     * @param {boolean} updateNotesInOB - Whether to update notes in Obsidian
     */
    constructor(nocodb, tp, app, updateNotesInOB = true) {
      super(tp, app);
      this.nocodb = nocodb;
      this.iotoConfig = this.tp.IOTOConfigText;
      this.tp = tp;
      this.app = app;
      this.dv = app.plugins.plugins.dataview?.api;
      this.vault = app.vault;
      this.recordsInDB = [];
      this.recordsInDBByTitle = [];
      this.activeFile = app.workspace.getActiveFile();
      this.folder = this.activeFile.parent.path;
      this.recordFieldsNames = nocodb.recordFieldsNames;
      this.activeNote = new OBNote(
        tp,
        app,
        this.activeFile,
        this.nocodb.noteSettings,
        this.recordFieldsNames
      );
      this.syncDatas = {
        records: [],
        typecast: true,
      };
      this.notesToCreate = [];
      this.notesToUpdate = [];
      this.updateNotesInOB = updateNotesInOB;
      this.dbName = nocodb.dbName.toLowerCase();
      this.recordIdPropertyName = nocodb.noteSettings.recordIdNameInNote;
      this.recordIdPropertyNameForDownload =
        nocodb.noteSettings.recordIdNameInNoteForDownload;
      this.recordIdName = nocodb.noteSettings.recordIdName;
      this.fetchTitleFrom = nocodb.recordFieldsNames.fetchTitleFrom;
      this.fetchContentFrom = nocodb.recordFieldsNames.fetchContentFrom;
      this.extension = nocodb.recordFieldsNames.extension;
      this.subFolder = nocodb.recordFieldsNames.subFolder;
      this.updatedTime = nocodb.recordFieldsNames.updatedTime;
    }

    /**
     * Create request configuration object
     * @param {string} url - Request URL
     * @param {string} method - Request method (GET, POST, PATCH, DELETE)
     * @param {Object} [data=null] - Request body data
     * @param {string} apiKey
     * @param {Object} [additionalHeaders={}] - Additional request headers
     * @returns {Object} Request configuration object
     */
    createRequestConfig(
      url,
      method,
      data = null,
      apiKey = this.nocodb.apiKey || "",
      additionalHeaders = {}
    ) {
      const config = {
        method: method,
        headers: {
          Authorization: "Bearer " + apiKey,
          ...additionalHeaders,
        },
      };

      if (url) {
        config.url = url;
      }

      if (data) {
        config.headers["Content-Type"] = "application/json";
        config.body = JSON.stringify(data);
      }

      return config;
    }

    /**
     * Reset the list of notes to be processed
     */
    resetNotesToDeal() {
      this.notesToCreate = [];
      this.notesToUpdate = [];
    }

    async getNoteForRecord(record, getFromDownload = false) {
      const files = this.vault.getMarkdownFiles();
      const filesInFolder = files.filter((file) =>
        file.path.startsWith(record.fields[this.recordFieldsNames.path])
      );
      const noteFile = filesInFolder
        .filter((file) => {
          const frontmatter =
            this.app.metadataCache.getFileCache(file)?.frontmatter;
          const propertyName = getFromDownload
            ? this.recordIdPropertyNameForDownload
            : this.recordIdPropertyName;

          return (
            frontmatter?.hasOwnProperty(propertyName) &&
            frontmatter[propertyName] === record[this.recordIdName]
          );
        })
        .first();
      return noteFile;
    }

    /**
     * List records from NocoDB and update the local record cache
     * @param {string} folder - Folder path
     * @param {boolean} includesSubfolder - Whether to include subfolders
     */
    async listRecordsInNocoDB(folder = "", includesSubfolder = false) {
      let fields = this.recordFieldsNames.title;

      let records = await this.retriveRecordsInNocoDB(
        folder,
        includesSubfolder,
        fields
      );

      this.recordsInDB = records.map((record) => record[this.recordIdName]);
      this.recordsInDBByTitle = records.map(
        (record) => record.fields[this.recordFieldsNames.title]
      );
    }

    /**
     * Get the specified source table view
     * @param {string} sourceViewID - Source table view ID
     * @returns {Object} Source table view
     */
    getFetchSourceTable(sourceViewID) {
      return this.nocodb.tables
        .filter((table) => sourceViewID == table.viewID)
        .first();
    }

    /**
     * Check if the note exists in the database (by ID)
     * @param {string} noteID - Note ID
     * @returns {boolean} Whether the note exists in the database
     */
    isNoteInDB(noteID) {
      return this.recordsInDB.includes(noteID);
    }

    /**
     * Check if the note exists in the database (by title)
     * @param {string} noteTitle - Note title
     * @returns {boolean} Whether the note exists in the database
     */
    isNoteInDBByTitle(noteTitle) {
      return this.recordsInDBByTitle.includes(noteTitle);
    }

    /**
     * Check if the note needs to be synced with full content
     * @returns {boolean} Whether the note needs to be synced with full content
     */
    isSyncFullContent() {
      return this.getBooleanSyncSettingForActiveEnv(
        this.iotoConfig.syncSettingProperties.syncFullContent,
        false
      );
    }

    /**
     * Create or update notes in Obsidian from the source table
     * @param {string} sourceViewID - Source table view ID
     */
    async createOrUpdateNotesInOBFromSourceTable(sourceViewID) {
      const { vault } = this.app;

      let sourceTable = this.getFetchSourceTable(sourceViewID);

      const directoryRootPath = sourceTable.targetFolderPath;

      let notesToCreateOrUpdate = await this.fetchRecordsFromSource(
        sourceTable
      );

      notesToCreateOrUpdate = notesToCreateOrUpdate.map((note) => note.fields);

      this.showNotice(
        ml.t("TotalRecordsToDeal", { total: notesToCreateOrUpdate.length })
      );

      let configDirModified = 0;

      while (notesToCreateOrUpdate.length > 0) {
        let toDealNotes = notesToCreateOrUpdate.slice(0, 10);
        for (let note of toDealNotes) {
          let validFileName = this.convertToValidFileName(
            note[this.fetchTitleFrom]
          );
          let folderPath =
            directoryRootPath + "/" + (note?.[this.subFolder] || "");
          await this.createPathIfNeeded(folderPath);
          const noteExtension = note?.[this.extension] || "md";
          const notePath = `${folderPath}/${validFileName}.${noteExtension}`;
          const noteExists = await vault.exists(notePath);
          if (!noteExists) {
            await vault.create(notePath, note[this.fetchContentFrom] || "");
          } else if (noteExists && notePath.startsWith(".")) {
            await vault.adapter
              .write(notePath, note[this.fetchContentFrom])
              .catch((r) => {
                this.showNotice(r, ml.t("FileWriteFailed"), "error");
                result = false;
              });
            configDirModified++;
          } else {
            let file = this.tp.file.find_tfile(notePath);
            await vault.modify(file, note[this.fetchContentFrom] || "");
            await new Promise((r) => setTimeout(r, 100)); //wait for metadata to update, steal from obsidian excalidraw
          }
        }

        notesToCreateOrUpdate = notesToCreateOrUpdate.slice(10);
        if (notesToCreateOrUpdate.length) {
          this.showNotice(
            ml.t("TotalRecordsToDeal", { total: notesToCreateOrUpdate.length })
          );
        } else {
          this.showNotice(ml.t("AllDone"));
        }
      }

      if (configDirModified > 0) {
        this.tp.hooks.on_all_templates_executed(() => {
          this.app.commands.executeCommandById("app:reload");
        });
      }
    }

    /**
     * Check if the note is marked as not to be synced
     * @param {Object} note - Note object
     * @returns {boolean} Whether the note is marked as not to be synced
     */
    donotSyncNote(note) {
      return !!note.frontmatter?.willNotSync;
    }

    /**
     * Get records from the database for links in the file
     * @param {Object} file - File object
     * @returns {Array} Records for links in the file
     */
    async getRecordsForLinksInFile(file) {
      const note = new OBNote(
        this.tp,
        this.app,
        file,
        this.nocodb.noteSettings,
        this.recordFieldsNames
      );
      const links = note.getOutlinks();
      if (!links || links.length === 0) {
        this.showNotice(ml.t("NoLinksInNote"));
        return;
      }
      const groupedLinks = links.reduce((groups, link) => {
        const path = link.parent.path;
        if (!groups[path]) {
          groups[path] = [];
        }
        groups[path].push(link);
        return groups;
      }, {});

      let recordsToUpdates = [];

      for (let [path, links] of Object.entries(groupedLinks)) {
        this.nocodb.apiUrl = "";
        await this.nocodb.setApiUrlForFolder(path, "download");
        const linksFileNames = links.map((link) => link.basename);

        let records = await this.retriveRecordsInNocoDB(path, false);
        records = records.filter((record) =>
          linksFileNames.includes(record.fields[this.recordFieldsNames.title])
        );

        if (records && records.length) {
          recordsToUpdates = recordsToUpdates.concat(records);
        }
      }

      return recordsToUpdates;
    }

    /**
     * Update notes from database records
     * @param {Array} records - Database records
     * @param {boolean} firstUpdate - Whether it is the first update
     * @param {boolean} updateFromDownload - Whether to update from download
     */
    async updateNotesFromRecords(
      records,
      firstUpdate = false,
      updateFromDownload = false
    ) {
      if (!records.length) return;
      this.showNotice(ml.t("TotalRecordsToUpdate", { total: records.length }));

      while (records.length > 0) {
        let toDealRecords = records.slice(0, 10);
        for (let record of toDealRecords) {
          let file = null;
          let notePath =
            record.fields[this.recordFieldsNames.path] +
            "/" +
            record.fields[this.recordFieldsNames.title];

          const syncMode = this.getSyncModeByLevel(
            null,
            record.fields[this.recordFieldsNames.path]
          );

          const separateMode = this.getSeparateModeByLevel(
            record.fields[this.recordFieldsNames.path]
          );

          await this.createPathIfNeeded(
            record.fields[this.recordFieldsNames.path]
          );

          let getFromDownload = separateMode && updateFromDownload;

          // Find or create file based on different scenarios
          file = firstUpdate
            ? this.tp.file.find_tfile(notePath)
            : await this.getNoteForRecord(record, getFromDownload);

          // If the file is not found and meets certain conditions, try to find it by path
          if (!file && (syncMode === "title" || updateFromDownload)) {
            file = this.tp.file.find_tfile(notePath);
          }

          // If the file is still not found, create a new file
          if (!file) {
            file = await this.vault.create(`${notePath}.md`, "");
          }

          await this.updateNoteInVault(
            file,
            record,
            firstUpdate,
            updateFromDownload
          );
        }

        records = records.slice(10);

        if (records.length) {
          this.showNotice(
            ml.t("LeftRecordsToUpdate", { total: records.length })
          );
        } else {
          this.showNotice(ml.t("AllDone"));
        }
      }
    }

    /**
     * Sync links in file to database
     * @param {Object} file - File object
     */
    async syncLinksInFileToDB(file) {
      const note = new OBNote(
        this.tp,
        this.app,
        file,
        this.nocodb.noteSettings,
        this.recordFieldsNames
      );

      const links = note.getOutlinks();

      if (!links || links.length === 0) {
        this.showNotice(ml.t("NoLinksInNoteToUpload"));
        return;
      }

      const uniqueLinks = links.reduce((unique, link) => {
        if (
          !unique.some(
            (item) =>
              item.parent.path === link.parent.path &&
              item.basename === link.basename
          )
        ) {
          unique.push(link);
        }
        return unique;
      }, []);

      await this.syncFilesToDB(uniqueLinks);
    }

    async syncFilesHasTagToDB(files) {
      if (!files || files.length === 0) {
        this.showNotice(ml.t("NoFilesHasTag"));
        return;
      }
      await this.syncFilesToDB(files);
    }

    async syncFilesHasSamePropertyAndValueToDB(files) {
      if (!files || files.length === 0) {
        this.showNotice(ml.t("NoFilesHasSamePropertyAndValue"));
        return;
      }
      await this.syncFilesToDB(files);
    }

    async filterRecordsByDate(records, choiceObj) {
      const { choice, selectedFilter } = choiceObj;
      // If the user cancels the selection, return an empty array
      if (!choice) {
        this.showNotice(ml.t("CanceledByUser"));
        return [];
      }

      // If the user selects all notes, return the unfiltered files
      if (99 === choice) {
        return records;
      }

      const now = moment();

      // Filter records based on the selected condition
      // Optimization: check each record's updatedTime field one by one, if it doesn't exist, keep the record
      return records.filter((record) => {
        const updatedTime = record.fields?.[this.recordFieldsNames.updatedTime];
        if (!updatedTime) {
          // If there is no updatedTime field, keep the record
          return true;
        }
        const lastModified = moment(updatedTime);
        return (
          now.diff(lastModified, selectedFilter.unit) <= selectedFilter.value
        );
      });
    }

    async syncFilesToDB(files) {
      const filterByDate = this.getBooleanSyncSettingForActiveEnv(
        this.iotoConfig.syncSettingProperties.enableDateFilterForBatchSync,
        true
      );
      let filesToSync = [];
      if (filterByDate) {
        filesToSync = await this.filterFilesByDate(files);
      } else {
        filesToSync = files;
      }
      if (!filesToSync.length) {
        this.showNotice(ml.t("NoFilesToSync"));
        return;
      }
      const notice = this.showNotice(
        ml.t("SyncingStart"),
        "",
        "info",
        0,
        false,
        true
      );
      const groupedFiles = filesToSync.reduce((groups, file) => {
        const path = file.parent.path;
        if (!groups[path]) {
          groups[path] = [];
        }
        groups[path].push(file);
        return groups;
      }, {});

      for (let [path, subFiles] of Object.entries(groupedFiles)) {
        this.nocodb.apiUrl = "";
        this.nocodb.customFields = {};

        this.recordsInDB = [];
        this.recordsInDBByTitle = [];
        this.syncDatas.records = [];

        this.resetNotesToDeal();

        await this.setSyncEnviromentForFolder(path);

        if (this.updateNotesInOB) {
          await this.listRecordsInNocoDB(path, false);
        }

        await this.processFilesAndSync(subFiles);
      }
      notice.hide();
    }

    async syncFileToDB(file) {
      this.showNotice(ml.t("ActiveNoteSyncingStart"));
      let note = null;
      // Create note object
      if (file.path === this.activeFile.path) {
        note = this.activeNote;
      } else {
        note = new OBNote(
          this.tp,
          this.app,
          file,
          this.nocodb.noteSettings,
          this.recordFieldsNames
        );
      }

      // Check if it is set to not sync
      if (this.donotSyncNote(note)) {
        this.showNotice(ml.t("NoteDonotSync", { noteTitle: note.title }));
        return;
      }

      // Set sync environment
      await this.setSyncEnviromentForFolder(note.folder);

      const syncMode = this.getSyncModeByLevel(note, note.folder);
      // Check sync settings
      if (syncMode === "title") {
        if (this.updateNotesInOB) {
          await this.listRecordsInNocoDB(note.folder, false);
        }

        if (this.isNoteInDBByTitle(note.title)) {
          note.noteRecordID =
            this.recordsInDB[this.recordsInDBByTitle.indexOf(note.title)];

          await this.updateDbRecordForNote(note);
          return;
        }
      }

      // Determine whether to create or update based on note status
      if (
        !note.frontmatter ||
        !(this.recordIdPropertyName in note.frontmatter)
      ) {
        console.log("Create Note");
        await this.createDbRecordForNote(note);
        return;
      }

      // Check if the record exists and perform the corresponding operation
      const foundRecord = await this.checkRecordInNocoDB(
        note.frontmatter[this.recordIdPropertyName]
      );

      await (foundRecord
        ? this.updateDbRecordForNote(note)
        : this.createDbRecordForNote(note));
    }

    async createDbRecordForNote(note) {
      const syncContent = this.getSyncContentByLevel(note, note.folder);

      const useComputedTitleInDb = this.getUseComputedTitleInDbByLevel(
        note,
        note.folder
      );

      await note.prepareNoteSyncData(
        false,
        syncContent,
        this.isSyncFullContent(),
        this.nocodb.contentMaxLength
      );

      if (useComputedTitleInDb) {
        if (
          note.syncData &&
          note.syncData.fields &&
          note.syncData.fields[this.recordFieldsNames.title]
        ) {
          delete note.syncData.fields[this.recordFieldsNames.title];
        }
      }

      await this.prepareNoteCustomSyncFields(note);

      this.syncDatas.records.push(note.syncData);
      let res = await this.createRecordsInNocoDB(
        this.syncDatas,
        this.updateNotesInOB
      );

      if (res) {
        this.showNotice(ml.t("NoteCreatedSuccess", { noteTitle: note.title }));
      } else {
        this.showNotice(
          ml.t("NoteCreatedFailed", { noteTitle: note.title }),
          "",
          "error"
        );
      }
    }

    async updateDbRecordForNote(note) {
      let update = true;
      const syncContent = this.getSyncContentByLevel(note, note.folder);

      const useComputedTitleInDb = this.getUseComputedTitleInDbByLevel(
        note,
        note.folder
      );
      await note.prepareNoteSyncData(
        update,
        syncContent,
        this.isSyncFullContent(),
        this.nocodb.contentMaxLength
      );
      if (useComputedTitleInDb) {
        if (
          note.syncData &&
          note.syncData.fields &&
          note.syncData.fields[this.recordFieldsNames.title]
        ) {
          delete note.syncData.fields[this.recordFieldsNames.title];
        }
      }

      await this.prepareNoteCustomSyncFields(note);

      this.syncDatas.records.push(note.syncData);

      let res = await this.updateRecordsInNocoDB(this.syncDatas);

      if (res) {
        this.showNotice(ml.t("NoteUpdatedSuccess", { noteTitle: note.title }));
      } else {
        this.showNotice(ml.t("NoteUpdatedFailed", { noteTitle: note.title }));
        // this.syncDatas.records = [];
        // await this.createDbRecordForNote(note);
      }
    }

    async syncFilesInFolderToDB(files, folder, includesSubfolder = false) {
      if (!files.length) return;
      this.showNotice(ml.t("SyncingNoteInFolder", { folderName: folder }));
      // Set sync environment
      await this.setSyncEnviromentForFolder(folder);
      if (this.updateNotesInOB) {
        await this.listRecordsInNocoDB(folder, includesSubfolder);
      }
      await this.processFilesAndSync(files);
    }

    async processFilesAndSync(files) {
      for (let file of files) {
        let note = new OBNote(
          this.tp,
          this.app,
          file,
          this.nocodb.noteSettings,
          this.recordFieldsNames
        );
        let shouldUpdate = false;
        if (this.donotSyncNote(note)) {
          this.showNotice(ml.t("NoteDonotSync", { noteTitle: note.title }));
          continue;
        }
        const syncMode = this.getSyncModeByLevel(note, note.folder);
        if (syncMode === "title") {
          if (this.isNoteInDBByTitle(note.title)) {
            shouldUpdate = true;
            note.noteRecordID =
              this.recordsInDB[this.recordsInDBByTitle.indexOf(note.title)];
          }
        } else {
          shouldUpdate =
            note.frontmatter &&
            this.recordIdPropertyName in note.frontmatter &&
            this.isNoteInDB(note.frontmatter[this.recordIdPropertyName]);
        }

        const syncContent = this.getSyncContentByLevel(note, note.folder);
        const useComputedTitleInDb = this.getUseComputedTitleInDbByLevel(
          note,
          note.folder
        );
        await note.prepareNoteSyncData(
          shouldUpdate,
          syncContent,
          this.isSyncFullContent(),
          this.nocodb.contentMaxLength
        );
        if (useComputedTitleInDb) {
          if (
            note.syncData &&
            note.syncData.fields &&
            note.syncData.fields[this.recordFieldsNames.title]
          ) {
            delete note.syncData.fields[this.recordFieldsNames.title];
          }
        }

        await this.prepareNoteCustomSyncFields(note);

        if (shouldUpdate) {
          this.notesToUpdate.push(note.syncData);
        } else {
          this.notesToCreate.push(note.syncData);
        }
      }
      if (this.notesToCreate.length) {
        await this.batchSync(this.notesToCreate);
        this.showNotice(
          ml.t("NotesCreatedReport", { number: this.notesToCreate.length })
        );
      }
      if (this.notesToUpdate.length) {
        await this.batchSync(this.notesToUpdate, true);
        this.showNotice(
          ml.t("NotesUpdatedReport", { number: this.notesToUpdate.length })
        );
      }
    }

    async batchSync(notes, update = false) {
      while (notes.length > 0) {
        let toDealNotes = notes.slice(0, 10);
        for (let note of toDealNotes) {
          this.syncDatas.records.push(note);
        }

        if (update) {
          setTimeout(await this.updateRecordsInNocoDB(this.syncDatas), 500);
        } else {
          setTimeout(
            await this.createRecordsInNocoDB(
              this.syncDatas,
              this.updateNotesInOB
            ),
            500
          );
        }
        this.syncDatas.records = [];
        notes = notes.slice(10);
        if (notes.length) {
          this.showNotice(ml.t("NotesLeftToDeal", { number: notes.length }));
        } else {
          this.showNotice(ml.t("AllNotesProcessed"));
        }
      }
    }

    async updateNoteInVault(
      file,
      record,
      firstUpdate = false,
      updateFromDownload = false
    ) {
      const note = new OBNote(
        this.tp,
        this.app,
        file,
        this.nocodb.noteSettings,
        this.recordFieldsNames
      );
      const dvPage = this.dv.page(file.path);

      const contentFetchField = this.getSyncSettingByLevel(
        this.iotoConfig.syncSettingProperties.contentFetchField,
        note,
        note.folder,
        this.recordFieldsNames.content
      );

      const contentAppendFields = this.getSyncSettingByLevel(
        this.iotoConfig.syncSettingProperties.contentAppendFields,
        note,
        note.folder,
        []
      );

      const fmFetchFieldsOverrideMode = this.getBooleanSyncSettingByLevel(
        this.iotoConfig.syncSettingProperties.fmFetchFieldsOverrideMode,
        note,
        note.folder,
        false
      );

      const fmFetchFieldsKey =
        this.iotoConfig.syncSettingProperties.fmFetchFields;
      const fmFetchFields = fmFetchFieldsOverrideMode
        ? this.nocodb.combineArraySyncSettings(
            fmFetchFieldsKey,
            note,
            note.folder
          )
        : this.getSyncSettingByLevel(fmFetchFieldsKey, note, note.folder, []);

      const isSeparateMode = this.getSeparateModeByLevel(note.folder);

      const enableUpdateFromDB = this.getBooleanSyncSettingByLevel(
        this.iotoConfig.syncSettingProperties.enableUpdateFromDB,
        note,
        note.folder,
        true
      );

      const enableUpdatePropertiesFromDowloadTable =
        this.getBooleanSyncSettingByLevel(
          this.iotoConfig.syncSettingProperties
            .enableUpdatePropertiesFromDowloadTable,
          note,
          note.folder,
          true
        );

      const includesTagsInContent = this.getBooleanSyncSettingByLevel(
        this.iotoConfig.syncSettingProperties.includesTagsInContent,
        note,
        note.folder,
        false
      );

      const pullContentOnly = this.getBooleanSyncSettingByLevel(
        this.iotoConfig.syncSettingProperties.pullContentOnly,
        null,
        note.folder,
        false
      );

      const sortFrontMatterProperties = this.getBooleanSyncSettingByLevel(
        this.iotoConfig.syncSettingProperties.sortFrontMatterProperties,
        note,
        note.folder,
        true
      );

      const updateFromSeparateDownloadTable =
        isSeparateMode && updateFromDownload;

      const fetchContentOnly = pullContentOnly && updateFromDownload;

      const noteContentFromDB =
        record.fields[contentFetchField] ||
        [
          record.fields[this.recordFieldsNames.content],
          record.fields[this.recordFieldsNames.extraContent],
        ]
          .filter(Boolean)
          .join("");

      let appendedContent = "";

      if (contentAppendFields?.length) {
        appendedContent = contentAppendFields
          .map((fieldName) => record.fields[fieldName] || "")
          .filter(Boolean)
          .join("\n\n");
      }

      const nocodbId = {
        [updateFromSeparateDownloadTable
          ? this.recordIdPropertyNameForDownload
          : this.recordIdPropertyName]: record[this.recordIdName],
      };
      const dbURLProperty = `${this.dbName}${
        updateFromSeparateDownloadTable ? "DownloadURL" : "URL"
      }`;
      const recordNocoDBURL = {
        [dbURLProperty]:
          this.nocodb.setSyncFolderRecordTableUrlBase(
            note.folder,
            updateFromDownload ? "download" : "upload"
          ) + record[this.recordIdName],
      };
      const customFields = this.nocodb.findSyncFolderCustomFields(
        record.fields[this.recordFieldsNames.path]
      );

      let customFieldsDBDatas = {};

      for (let [key, value] of Object.entries(customFields)) {
        // If the field exists in dvPage but not in frontmatter, skip
        if (dvPage && key in dvPage && !(key in dvPage.file.frontmatter)) {
          continue;
        }

        // Get field value
        let fieldValue;
        if (key + "Name" in record.fields) {
          fieldValue = record.fields[key + "Name"];
        } else if (typeof value === "boolean") {
          // If it is a boolean type, get the boolean value
          fieldValue = Boolean(record.fields[key]);
        } else if (!isNaN(value) && value !== "" && value !== null) {
          // If it is a number type, convert to number
          fieldValue = Number(record.fields[key]);
        } else {
          const recordField = record.fields[key];
          fieldValue =
            typeof recordField === "object" &&
            !Array.isArray(recordField) &&
            recordField?.url
              ? recordField.url
              : recordField;
        }

        customFieldsDBDatas[key] = fieldValue || record.fields[key] || value;
      }

      let fmFetchFieldsDBDatas = {};

      fmFetchFields.forEach((fieldName) => {
        let fieldValue = record.fields[fieldName] || "";
        // If it is a multi-line text, special processing is needed to maintain the YAML format
        if (typeof fieldValue === "string" && fieldValue.includes("\n")) {
          // Use | to mark multi-line text, and indent each line
          fieldValue =
            "|\n" +
            fieldValue
              .split("\n")
              .map((line) => `  ${line}`)
              .join("\n");
        }

        if (typeof fieldValue === "boolean") {
          // If it is a boolean type, get the boolean value
          fieldValue = Boolean(fieldValue);
        }

        if (!isNaN(fieldValue) && fieldValue !== "" && fieldValue !== null) {
          // If it is a number type, convert to number
          fieldValue = Number(fieldValue);
        }

        fmFetchFieldsDBDatas[fieldName] = fieldValue;
      });

      let fmDict = note.yamlCooker.parseFmDict(note.frontmatter);

      // Sync Tags

      let fmTags = record.fields[this.recordFieldsNames.tags] || [];

      if (
        !includesTagsInContent &&
        record.fields[this.recordFieldsNames.tags] &&
        noteContentFromDB
      ) {
        fmTags = record.fields[this.recordFieldsNames.tags].filter(
          (t) => noteContentFromDB && !noteContentFromDB.includes("#" + t)
        );
      }

      // Sync Aliases

      let fmAliases = record.fields[this.recordFieldsNames.aliases] || [];

      fmDict = Object.assign(fmDict, nocodbId);
      fmDict = Object.assign(fmDict, recordNocoDBURL);
      // Use object spread operator to merge multiple objects, more concise and efficient

      // Check if the frontmatter needs to be updated
      const shouldUpdateFrontmatter =
        (updateFromDownload &&
          isSeparateMode &&
          enableUpdatePropertiesFromDowloadTable) ||
        (updateFromDownload && !isSeparateMode && enableUpdateFromDB) ||
        (!updateFromDownload && enableUpdateFromDB);

      if (shouldUpdateFrontmatter) {
        fmDict = {
          ...fmDict,
          ...customFieldsDBDatas,
          ...fmFetchFieldsDBDatas,
          tags: fmTags,
          aliases: fmAliases,
        };
      }

      await note.prepareNoteFm(fmDict, sortFrontMatterProperties);
      await note.prepareNoteContent();

      const syncContent = this.getSyncContentByLevel(note, note.folder);

      const fmContent = !fetchContentOnly ? note.fm : "";

      const noteAppendedContent = appendedContent
        ? `\n\n${this.tp.IOTOConfigText.appendedContent}\n\n${appendedContent}`
        : "";

      const noteContent =
        enableUpdateFromDB && syncContent
          ? (noteContentFromDB || "") + noteAppendedContent
          : note.content;

      const content = fmContent + noteContent;

      await this.app.vault.modify(file, content);

      await new Promise((r) => setTimeout(r, 100)); //wait for metadata to update, steal from obsidian excalidraw

      if (
        !firstUpdate &&
        note.title !== record.fields[this.recordFieldsNames.title]
      ) {
        this.app.fileManager.renameFile(
          file,
          record.fields[this.recordFieldsNames.path] +
            "/" +
            this.convertToValidFileName(
              record.fields[this.recordFieldsNames.title]
            ) +
            ".md"
        );
      }
    }

    async setSyncEnviromentForFolder(folder, mode = "upload") {
      await Promise.all([
        this.nocodb.setApiUrlForFolder(folder, mode),
        this.nocodb.setCustomSyncFields(folder),
        this.nocodb.setExtractKeyPointsFields(folder),
        this.nocodb.setExtractBlocksFields(folder),
        this.nocodb.setExtractTagLinesFields(folder),
        this.nocodb.setExtractSectionsFields(folder),
      ]);
    }

    /**
     * Filter files by last modified time
     * @param {Array} files - Files to filter
     * @param {Object} dateChoice - Date choice object
     * @returns {Array} Filtered files
     */
    async filterFilesByDate(files, dateChoice = null) {
      if (!dateChoice) {
        dateChoice = await this.getDateChoice();
      }

      const { choice, selectedFilter } = dateChoice;

      // If the user cancels the selection, return an empty array
      if (!choice) {
        this.showNotice(ml.t("CanceledByUser"));
        return [];
      }

      // If the user selects all notes, return the unfiltered files
      if (99 === choice) {
        return files;
      }

      const now = moment();

      // Filter files based on the selected condition
      return files.filter((file) => {
        const lastModified = moment(file.stat.mtime);
        return (
          now.diff(lastModified, selectedFilter.unit) <= selectedFilter.value
        );
      });
    }

    async prepareNoteCustomSyncFields(note) {
      const extractKeyPointsAsText = this.getExtractKeyPointsAsTextByLevel(
        note,
        note.folder
      );
      const extractBlocksAsText = this.getExtractBlocksAsTextByLevel(
        note,
        note.folder
      );
      const extractTagLinesAsText = this.getExtractTagLinesAsTextByLevel(
        note,
        note.folder
      );
      const extractSectionsAsText = this.getExtractSectionsAsTextByLevel(
        note,
        note.folder
      );
      const sectionHeadingWholeMatch = this.getBooleanSyncSettingByLevel(
        this.iotoConfig.syncSettingProperties.sectionHeadingWholeMatch,
        note,
        note.folder,
        false
      );

      await note.addCustomSyncFields(this.nocodb.customFields);
      await note.addExtractKeyPointsFields(
        this.nocodb.extractKeyPoints,
        extractKeyPointsAsText
      );
      await note.addExtractBlocksFields(
        this.nocodb.extractBlocks,
        extractBlocksAsText
      );
      await note.addExtractTagLinesFields(
        this.nocodb.extractTagLines,
        extractTagLinesAsText
      );
      await note.addExtractSectionFields(
        this.nocodb.extractSections,
        extractSectionsAsText,
        sectionHeadingWholeMatch
      );
    }

    /**
     * Get sync setting value by priority
     * Priority order: note frontmatter > folder sync table setting > default setting > fallback value
     * @param {string} settingPropertyName - Setting property name
     * @param {Object} note - Note object, contains frontmatter property
     * @param {string} folder - Folder path
     * @param {*} fallbackValue - Fallback value if all other settings are not found
     * @returns {*} The found setting value, or the fallback value if none found
     */
    getSyncSettingByLevel(settingPropertyName, note, folder, fallbackValue) {
      return this.nocodb.getSyncSettingByLevel(
        settingPropertyName,
        note,
        folder,
        fallbackValue
      );
    }

    getSyncModeByLevel(note, folder) {
      return this.getSyncSettingByLevel(
        this.iotoConfig.syncSettingProperties.syncMode,
        note,
        folder,
        "id"
      );
    }

    getUseComputedTitleInDbByLevel(note, folder) {
      return this.getSyncSettingByLevel(
        this.iotoConfig.syncSettingProperties.useComputedTitleInDb,
        note,
        folder,
        false
      );
    }

    getSyncContentByLevel(note, folder) {
      return this.getSyncSettingByLevel(
        this.iotoConfig.syncSettingProperties.syncContent,
        note,
        folder,
        true
      );
    }

    getExtractKeyPointsAsTextByLevel(note, folder) {
      return this.getSyncSettingByLevel(
        this.iotoConfig.syncSettingProperties.extractKeyPointsAsText,
        note,
        folder,
        this.nocodb.extractKeyPointsAsText
      );
    }

    getExtractBlocksAsTextByLevel(note, folder) {
      return this.getSyncSettingByLevel(
        this.iotoConfig.syncSettingProperties.extractBlocksAsText,
        note,
        folder,
        this.nocodb.extractBlocksAsText
      );
    }

    getExtractTagLinesAsTextByLevel(note, folder) {
      return this.getSyncSettingByLevel(
        this.iotoConfig.syncSettingProperties.extractTagLinesAsText,
        note,
        folder,
        this.nocodb.extractTagLinesAsText
      );
    }

    getExtractSectionsAsTextByLevel(note, folder) {
      return this.getSyncSettingByLevel(
        this.iotoConfig.syncSettingProperties.extractSectionsAsText,
        note,
        folder,
        this.nocodb.extractSectionsAsText
      );
    }

    getSeparateModeByLevel(folder) {
      return this.getSyncSettingByLevel(
        this.iotoConfig.syncSettingProperties.separateMode,
        null,
        folder,
        false
      );
    }

    getBooleanSyncSettingByLevel(property, note, folder, fallbackValue) {
      return this.nocodb.getBooleanSyncSettingByLevel(
        property,
        note,
        folder,
        fallbackValue
      );
    }

    getBooleanSyncSettingForActiveEnv(property, fallbackValue) {
      return this.getBooleanSyncSettingByLevel(
        property,
        this.activeNote,
        this.folder,
        fallbackValue
      );
    }

    getNocodbRecordIDForNote(note, mode = "upload") {
      const separateMode = this.getSeparateModeByLevel(note.folder);

      const settings = this.nocodb.noteSettings;
      const propertyName =
        separateMode && mode === "download"
          ? settings.recordIdPropertyNameForDownload
          : settings.recordIdPropertyName;

      return note.frontmatter?.[propertyName] || "";
    }
  };
}

module.exports = IOTONocoDBSyncer;
