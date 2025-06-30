/**
 * Creates an IOTOObSyncer class for synchronizing Obsidian notes with NocoDB
 * @returns {Class} MyObSyncer class
 * @todo move getFiles methods to its own class file, maybe name it IOTOOBFilesFetcher
 */
function IOTOObSyncer(tp) {
  const ObFilesFetcher = tp.user.IOTOObFilesFetcher(tp);

  const ml = new (tp.user.IOTOMultiLangs())();

  return class MyObSyncer {
    /**
     * Creates an instance of MyObSyncer
     * @param {Object} tp - Template processor object
     * @param {Object} app - Obsidian app instance
     * @param {Object} nocoDBSyncer - NocoDB synchronization instance
     */
    constructor(tp, app, nocoDBSyncer) {
      this.tp = tp;
      this.iotoConfig = this.tp.IOTOConfigText;
      this.app = app;
      this.vault = app.vault;
      this.dv = app.plugins.plugins.dataview?.api;
      this.iotoSettings = app.plugins.plugins["ioto-settings"]?.settings;
      this.activeFile = app.workspace.getActiveFile();
      this.folder = this.activeFile.parent.path;
      this.nocoDBSyncer = nocoDBSyncer;
      this.obFilesFetcher = ObFilesFetcher.createFilesFetcher(tp, app);
      this.activeNote = nocoDBSyncer.activeNote;
      this.uploadIcon = "▲";
      this.downloadIcon = "▼";
      this.deleteIcon = "⚠️";
      this.dbName = this.nocoDBSyncer.nocodb.dbName;
    }

    /**
     * Synchronizes data with NocoDB based on fetch mode
     * @param {boolean} [fetchOnly=false] - If true, only fetches data from NocoDB
     * @returns {Promise<string|null>} Returns the selected view ID or null
     */
    async syncWithNocoDB(fetchOnly = false) {
      // 根据 fetchOnly 参数决定同步方式
      return fetchOnly
        ? await this.onlyFetchFromNocoDB()
        : await this.twoWaySyncWithNocoDB();
    }

    /**
     * Fetches data from NocoDB without uploading
     * @returns {Promise<string|null>} Returns the selected view ID or null
     */
    async onlyFetchFromNocoDB() {
      try {
        const tables = this.nocoDBSyncer.nocodb.tables;

        if (!tables || tables.length === 0) {
          throw new Error(mt.t("NoAvailableTables"));
        }

        // 构建选项数组
        const actionChoices = tables.map((t, index) => ({
          label: `${index + 1}. ${ml.t("GetFilesFromSourceToOB", {
            sourceName: t.sourceName,
          })}`,
          value: t.viewID,
        }));

        // 显示选择器并获取用户选择
        const choice = await this.tp.system.suggester(
          actionChoices.map((c) => c.label),
          actionChoices.map((c) => c.value)
        );

        if (!choice) {
          return null;
        }

        // 执行同步操作
        await this.nocoDBSyncer.createOrUpdateNotesInOBFromSourceTable(choice);

        return choice;
      } catch (error) {
        this.nocoDBSyncer.showNotice(
          error.message,
          ml.t("GetFilesFromSourceToOBError", {
            dbName: this.dbName,
          })
        );
        return null;
      }
    }

    /**
     * Performs two-way synchronization with NocoDB
     * @returns {Promise<void>}
     */
    async twoWaySyncWithNocoDB() {
      // 定义基础同步选项
      const syncOptions = {
        choices: [
          {
            id: 1,
            label: `${this.uploadIcon} ${ml.t("UploadCurrentNoteToDB", {
              dbName: this.dbName,
            })}`,
            action: () => this.syncActiveFileToDB(),
          },
          {
            id: 2,
            label: `${this.uploadIcon} ${ml.t("UploadLinksInCurrentNoteToDB", {
              dbName: this.dbName,
            })}`,
            action: () => this.syncLinksInActiveFileToDB(),
          },
          {
            id: 3,
            label: `${this.uploadIcon} ${ml.t(
              "UploadCurrentNoteAndLinksInCurrentNoteToDB",
              {
                dbName: this.dbName,
              }
            )}`,
            action: () => this.syncActiveFileAndLinksInActiveFileToDB(),
          },
          {
            id: 4,
            label: `${this.uploadIcon} ${ml.t(
              "UploadFilesInCurrentFolderToDB",
              {
                dbName: this.dbName,
              }
            )}`,
            action: () => this.syncFilesInCurrentFolderToDB(),
          },
          {
            id: 5,
            label: `${this.uploadIcon} ${ml.t(
              "UploadFilesInCurrentFolderAndSubFoldersToDB",
              {
                dbName: this.dbName,
              }
            )}`,
            action: () => this.syncFilesInCurrentFolderAndSubFolderToDB(),
          },
          {
            id: 6,
            label: `${this.uploadIcon} ${ml.t("UploadFilesHasSameTagToDB", {
              dbName: this.dbName,
            })}`,
            action: () => this.syncFilesHasSamePropertyAndValueToDB(),
          },
          {
            id: 7,
            label: `${this.uploadIcon} ${ml.t(
              "UploadFilesHasSamePropertyAndValueToDB",
              {
                dbName: this.dbName,
              }
            )}`,
            action: () => this.syncFilesHasSamePropertyAndValueToDB(),
          },
          {
            id: 8,
            label: `${this.uploadIcon} ${ml.t("UploadSearchResultsToDB", {
              dbName: this.dbName,
            })}`,
            action: () => this.syncSearchResultsToDB(),
          },
          {
            id: 9,
            label: `${this.uploadIcon} ${ml.t("UploadAllIOONotesToDB", {
              dbName: this.dbName,
            })}`,
            action: () => this.syncAllIOONotesToDB(),
          },
        ],
      };

      // 定义数据库更新选项
      const updateOptions = {
        choices: [
          {
            id: 11,
            label: `${this.downloadIcon} ${ml.t(
              "DownloadContentFromDBToCurrentNote",
              {
                dbName: this.dbName,
              }
            )}`,
            action: () => this.updateDBToActiveFile(),
          },
          {
            id: 12,
            label: `${this.downloadIcon} ${ml.t(
              "DownloadContentFromDBToCurrentNoteLinks",
              {
                dbName: this.dbName,
              }
            )}`,
            action: () => this.updateDBToLinksInActiveFile(),
          },
          {
            id: 13,
            label: `${this.downloadIcon} ${ml.t(
              "DownloadContentFromDBToCurrentNoteAndLinks",
              {
                dbName: this.dbName,
              }
            )}`,
            action: () => this.updateDBToActiveFileAndLinksInActiveFile(),
          },
          {
            id: 14,
            label: `${this.downloadIcon} ${ml.t(
              "DownloadContentFromDBToNotesInCurrentFolder",
              {
                dbName: this.dbName,
              }
            )}`,
            action: () => this.updateDBToFilesInFolder(this.folder),
          },
          {
            id: 15,
            label: `${this.downloadIcon} ${ml.t(
              "DownloadContentFromDBToNotesInCurrentFolderAndSubFolder",
              {
                dbName: this.dbName,
              }
            )}`,
            action: () => this.upateDBToFilesInFolderAndSubFolder(),
          },
        ],
      };

      if (
        this.nocoDBSyncer.getBooleanSyncSettingForActiveEnv(
          this.iotoConfig.syncSettingProperties.showDeleteOption,
          true
        )
      ) {
        syncOptions.choices.push({
          id: 21,
          label: `${this.deleteIcon} ${ml.t("DeleteCurrentNoteAndRecord")}`,
          action: () => this.deleteNoteAndRecord(),
        });
      }

      const justUpdateFromDB =
        this.nocoDBSyncer.getBooleanSyncSettingForActiveEnv(
          this.iotoConfig.syncSettingProperties.justUpdateFromDB,
          false
        );

      // 合并所有选项
      const allChoices = justUpdateFromDB
        ? [...updateOptions.choices]
        : [...syncOptions.choices, ...updateOptions.choices];

      const choicesFilterArray = this.nocoDBSyncer.getSyncSettingByLevel(
        this.iotoConfig.syncSettingProperties.syncOptions,
        this.activeNote,
        this.folder,
        []
      );
      // 将选项ID字符串转换为整数
      const choicesFilterArrayInt = choicesFilterArray.map((id) =>
        parseInt(id)
      );

      const chosedChoices =
        choicesFilterArrayInt.length && !justUpdateFromDB
          ? allChoices.filter((c) => choicesFilterArrayInt.includes(c.id))
          : allChoices;

      // 显示选择器并执行选择的操作
      const choice = await this.tp.system.suggester(
        chosedChoices.map((c, index) => `${index + 1}. ${c.label}`),
        chosedChoices.map((c) => c.id)
      );

      if (!choice) return;

      // 查找并执行对应操作
      const selectedAction = allChoices.find((c) => c.id === choice)?.action;
      if (selectedAction) {
        await selectedAction();
      }
    }

    /**
     * Checks if the active note exists in NocoDB
     * @todo under separate mode, I should check different base
     * @returns {Promise<boolean>} Returns true if note exists in NocoDB
     */
    async isActiveNoteInNocoDB() {
      let activeNoteSyncID = this.activeNote.getNocodbRecordID();
      await this.nocoDBSyncer.nocodb.setApiUrlForFolder(this.folder, "upload");
      if (activeNoteSyncID) {
        return await this.nocoDBSyncer.checkRecordInNocoDB(activeNoteSyncID);
      }
    }

    /**
     * Synchronizes active file to NocoDB
     * @returns {Promise<void>}
     */
    async syncActiveFileToDB() {
      try {
        // 同步文件到数据库
        await this.nocoDBSyncer.syncFileToDB(this.activeFile);
      } catch (error) {
        console.error(ml.t("SyncFileError"), error);
        this.nocoDBSyncer.showNotice(ml.t("SyncFileErrorNotice"));
      }
    }

    /**
     * Synchronizes links in active file to NocoDB
     * @returns {Promise<void>}
     */
    async syncLinksInActiveFileToDB() {
      await this.nocoDBSyncer.syncLinksInFileToDB(this.activeFile);
    }

    /**
     * Synchronizes both active file and its links to NocoDB
     * @returns {Promise<void>}
     */
    async syncActiveFileAndLinksInActiveFileToDB() {
      await this.syncLinksInActiveFileToDB();
      await this.syncActiveFileToDB();
    }

    /**
     * Synchronizes all files in current folder to NocoDB
     * @returns {Promise<void>}
     */
    async syncFilesInCurrentFolderToDB() {
      let files = await this.obFilesFetcher.getAllFilesInCurrentFolder();
      const filterByDate = this.nocoDBSyncer.getBooleanSyncSettingForActiveEnv(
        this.iotoConfig.syncSettingProperties.enableDateFilterForBatchSync,
        true
      );
      if (filterByDate) {
        files = await this.nocoDBSyncer.filterFilesByDate(files);
      }
      await this.nocoDBSyncer.syncFilesInFolderToDB(files, this.folder);
    }

    /**
     * Synchronizes files in current folder and subfolders to NocoDB
     * @returns {Promise<void>}
     */
    async syncFilesInCurrentFolderAndSubFolderToDB() {
      const filterByDate = this.nocoDBSyncer.getBooleanSyncSettingForActiveEnv(
        this.iotoConfig.syncSettingProperties.enableDateFilterForBatchSync,
        true
      );

      const unsyncedSubFolders = this.nocoDBSyncer.getSyncSettingByLevel(
        this.iotoConfig.syncSettingProperties.unsyncedSubFolders,
        null,
        this.folder,
        []
      );

      let unsyncedSubFolderPaths = [];

      if (unsyncedSubFolders.length) {
        unsyncedSubFolderPaths = unsyncedSubFolders.map(
          (f) => `${this.folder}/${f}`
        );
      }

      let dateChoice;

      if (filterByDate) {
        dateChoice = await this.nocoDBSyncer.getDateChoice();
      }
      let subFolders = await this.obFilesFetcher.getAllSubFolders();

      let specificSyncFolders = subFolders.filter((folder) =>
        this.nocoDBSyncer.nocodb.tablePaths.includes(folder.path)
      );

      let excludeFolders = specificSyncFolders.map((folder) => folder.path);
      let includesSubfolder = true;

      let files =
        await this.obFilesFetcher.getAllFilesInCurrentFolderAndSubFolder(
          this.folder,
          excludeFolders.concat(unsyncedSubFolderPaths)
        );

      if (filterByDate) {
        files = await this.nocoDBSyncer.filterFilesByDate(files, dateChoice);
      }

      if (files.length) {
        await this.nocoDBSyncer.syncFilesInFolderToDB(
          files,
          this.folder,
          includesSubfolder
        );
      }

      if (specificSyncFolders.length) {
        this.nocoDBSyncer.resetNotesToDeal();
        specificSyncFolders.forEach(async (tFolder) => {
          let files =
            await this.obFilesFetcher.getAllFilesInCurrentFolderAndSubFolder(
              tFolder.path
            );
          if (filterByDate) {
            files = await this.nocoDBSyncer.filterFilesByDate(
              files,
              dateChoice
            );
          }
          await this.nocoDBSyncer.syncFilesInFolderToDB(
            files,
            tFolder.path,
            includesSubfolder
          );
        });
      }
    }

    /**
     * Synchronizes files with specific tag to NocoDB
     * @returns {Promise<void>}
     */
    async syncFilesHasSameTagToDB() {
      const tag = await this.obFilesFetcher.chooseTagFromVault();
      if (!tag) return;
      const targetFiles = await this.obFilesFetcher.getFilesWithTag(tag);
      await this.nocoDBSyncer.syncFilesHasTagToDB(targetFiles);
    }

    /**
     * Synchronizes files with specific property and value to NocoDB
     * @returns {Promise<void>}
     */
    async syncFilesHasSamePropertyAndValueToDB() {
      const valueForSpecificProperty =
        await this.obFilesFetcher.getValueForSpecificPropertyInVault();

      if (!valueForSpecificProperty) return;

      const { property, value } = valueForSpecificProperty;

      let targetFile = await this.obFilesFetcher.getFilesWithPropertyAndValue(
        property,
        value
      );
      await this.nocoDBSyncer.syncFilesHasSamePropertyAndValueToDB(targetFile);
    }

    async syncSearchResultsToDB() {
      // 获取搜索关键词
      const searchQuery = await this.obFilesFetcher.getSearchQueryFromUser();

      // 如果没有搜索关键词则直接返回
      if (!searchQuery) {
        this.nocoDBSyncer.showNotice(ml.t("InputSearchQuery"));
        return;
      }
      // 执行搜索
      let files = await this.obFilesFetcher.searchFilesInVault(searchQuery);

      if (!files?.length) {
        this.nocoDBSyncer.showNotice(ml.t("NoMatchingNote"));
        return;
      }

      // 过滤出IOTO相关的文件
      files = this.obFilesFetcher.filterOutIOTOFiles(files);

      // 同步搜索结果到数据库
      await this.nocoDBSyncer.syncFilesToDB(files);
    }

    async syncAllIOONotesToDB() {
      const files = await this.obFilesFetcher.getAllIOOFiles();

      await this.nocoDBSyncer.syncFilesToDB(files);
    }

    async deleteNoteAndRecord() {
      this.app.vault.trash(this.activeFile, false);
      if (await this.isActiveNoteInNocoDB()) {
        await this.nocoDBSyncer.nocodb.setApiUrlForFolder(
          this.folder,
          "upload"
        );
        await this.nocoDBSyncer.deleteRecordsInNocoDB(
          this.activeNote.frontmatter.airtableRecordID
        );
      }
    }

    /**
     * 从数据库更新当前活动文件的内容
     * 根据同步模式(title/id)获取数据库中对应记录
     * 并用数据库中的内容更新本地文件
     */
    async updateDBToActiveFile() {
      const notice = this.showNotice(ml.t("PreparingToGetData"));
      // 设置当前文件夹的API URL
      await this.nocoDBSyncer.nocodb.setApiUrlForFolder(
        this.folder,
        "download"
      );

      let records = [];
      let activeNoteSyncID = "";

      activeNoteSyncID = this.nocoDBSyncer.getNocodbRecordIDForNote(
        this.activeNote,
        "download"
      );

      // 使用标题去获取记录ID
      if (!Boolean(activeNoteSyncID)) {
        // 获取数据库中所有记录
        await this.nocoDBSyncer.listRecordsInNocoDB(this.folder, false);
        // 根据标题查找对应记录的索引
        const titleIndex = this.nocoDBSyncer.recordsInDBByTitle.indexOf(
          this.activeNote.title
        );

        // 如果找到对应记录,获取记录ID
        if (titleIndex !== -1) {
          activeNoteSyncID = this.nocoDBSyncer.recordsInDB[titleIndex];
        }
      }
      // 如果找到记录ID,获取记录详情
      if (activeNoteSyncID) {
        const record = await this.nocoDBSyncer.retriveRecordInNocoDB(
          activeNoteSyncID
        );
        if (record) {
          records.push(record);
        }

        // 用获取到的记录更新本地文件
        await this.nocoDBSyncer.updateNotesFromRecords(records, false, true);
      } else {
        this.nocoDBSyncer.showNotice(ml.t("NoMatchingNote"));
      }
      notice.hide();
    }

    async updateDBToLinksInActiveFile() {
      const notice = this.showNotice(ml.t("PreparingToGetData"));

      let records = await this.nocoDBSyncer.getRecordsForLinksInFile(
        this.activeFile
      );
      // 如果没有找到记录则提示并返回
      if (!records?.length) {
        notice.hide();
        return;
      }
      const dateChoice = await this.nocoDBSyncer.getDateChoice();
      records = await this.nocoDBSyncer.filterRecordsByDate(
        records,
        dateChoice
      );
      await this.nocoDBSyncer.updateNotesFromRecords(records, false, true);
      notice.hide();
    }

    async updateDBToActiveFileAndLinksInActiveFile() {
      await this.updateDBToLinksInActiveFile();
      await this.updateDBToActiveFile();
    }

    async updateDBToFilesInFolder(
      folder,
      dateChoice,
      includesSubfolder = false
    ) {
      if (!dateChoice) {
        dateChoice = await this.nocoDBSyncer.getDateChoice();
      }
      const notice = this.showNotice(ml.t("PreparingToGetData"));
      await this.nocoDBSyncer.nocodb.setApiUrlForFolder(folder, "download");
      let records = await this.nocoDBSyncer.retriveRecordsInNocoDB(
        folder,
        includesSubfolder
      );
      records = await this.nocoDBSyncer.filterRecordsByDate(
        records,
        dateChoice
      );
      await this.nocoDBSyncer.updateNotesFromRecords(records, false, true);
      notice.hide();
    }

    async upateDBToFilesInFolderAndSubFolder() {
      const dateChoice = await this.nocoDBSyncer.getDateChoice();
      const subFolders = await this.obFilesFetcher.getAllSubFolders();
      const specificSyncFolders = subFolders.filter((folder) =>
        this.nocoDBSyncer.nocodb.tablePaths.includes(folder.path)
      );

      await this.updateDBToFilesInFolder(this.folder, dateChoice, true);

      if (specificSyncFolders.length) {
        specificSyncFolders.forEach(async (tFolder) => {
          await this.updateDBToFilesInFolder(tFolder.path, dateChoice, true);
        });
      }
    }

    showNotice(message) {
      return this.nocoDBSyncer.showNotice(message, "", "info", 0, false, true);
    }
  };
}

module.exports = IOTOObSyncer;
