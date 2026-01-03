/**
 * Creates an IOTONocoDB class for NocoDB database operations
 * @returns {Class} MyNocoDB class
 */
function IOTONocoDB(tp) {
  const IOTOUtility = tp.user.IOTOUtility(tp, app);
  const ml = new (tp.user.IOTOMultiLangs(tp))();
  return class MyNocoDB extends IOTOUtility {
    /**
     * Creates an instance of MyNocoDB
     * @param {Object} nocoDBSettings - NocoDB configuration settings
     * @param {string} nocoDBSettings.apiKey - API key for authentication
     * @param {string} nocoDBSettings.defaultBaseID - Default base ID
     * @param {string} nocoDBSettings.defaultTableID - Default table ID
     * @param {Array} nocoDBSettings.tables - Array of table configurations
     * @param {Object} nocoDBSettings.syncSettings - Synchronization settings
     * @param {Object} defaultNocoDBSettings - Default database settings
     * @param {string} defaultNocoDBSettings.dbName - Database name
     * @param {string} defaultNocoDBSettings.recordIdPropertyName - Property name for record ID
     * @param {string} defaultNocoDBSettings.recordIdName - Record ID field name
     * @param {boolean} defaultNocoDBSettings.useDate - Whether to use date
     * @param {string} defaultNocoDBSettings.apiUrlRoot - API URL root
     * @param {string} defaultNocoDBSettings.recordUrlRoot - Record URL root
     * @param {Object} nocoDBBaseSettings - Base settings for NocoDB
     */
    constructor(nocoDBSettings, defaultNocoDBSettings, nocoDBBaseSettings) {
      super(tp, app);
      this.dbName = defaultNocoDBSettings.dbName;
      this.noteSettings = {
        recordIdNameInNoteForDownload:
          defaultNocoDBSettings.recordIdPropertyNameForDownload,
        recordIdNameInNote: defaultNocoDBSettings.recordIdPropertyName,
        recordIdName: defaultNocoDBSettings.recordIdName,
        useDate: defaultNocoDBSettings.useDate,
      };

      this.nocoDBBaseSettings = nocoDBBaseSettings;

      this.apiKey = nocoDBSettings.apiKey || "";
      this.defaultBaseID =
        nocoDBSettings.defaultBaseID ||
        nocoDBSettings.baseID ||
        nocoDBSettings.defaultFileID ||
        nocoDBSettings.fileID ||
        "";
      this.defaultTableID =
        nocoDBSettings.defaultTableID ||
        nocoDBSettings.tableID ||
        nocoDBSettings.defaultSheetID ||
        nocoDBSettings.sheetID ||
        "";

      this.tables = nocoDBSettings.tables || [];
      this.tablePaths = this.tables.map((table) => table.folderName);

      this.apiUrlRoot = defaultNocoDBSettings.apiUrlRoot;
      this.apiUrlBase = this.apiUrlRoot + `${this.defaultBaseID}/`;
      this.apiUrl = this.apiUrlBase + this.defaultTableID;

      this.recordUrlRoot = defaultNocoDBSettings.recordUrlRoot;
      this.recordUrlBase = `${this.recordUrlRoot}${this.defaultBaseID}/`;
      this.customFields = {};
      this.extractKeyPoints = {};
      this.extractBlocks = {};
      this.extractSections = {};
      this.extractTagLines = {};
      this.syncSettings = nocoDBSettings.syncSettings || {};

      this.recordFieldsNames = {
        ...{
          title: ml.t("SyncTitle"),
          content: ml.t("SyncContent"),
          tags: ml.t("SyncTags"),
          aliases: ml.t("SyncAliases"),
          createdTime: ml.t("SyncCreatedTime"),
          updatedTime: ml.t("SyncUpdatedTime"),
          path: ml.t("SyncPath"),
          vault: ml.t("SyncVault"),
          fullContent: ml.t("SyncFullContent"),
          obsidianURI: ml.t("SyncOBURI"),
          extension: ml.t("SyncExtension"),
          subFolder: ml.t("SyncSubFolder"),
          fetchContentFrom: ml.t("SyncMD"),
          fetchTitleFrom: ml.t("SyncTitle"),
          extraContent: ml.t("SyncExtraContent"),
          extraFullContent: ml.t("SyncExtraFullContent"),
        },
        ...(this.syncSettings.fieldsNames || {}),
      };
    }

    /**
     * Finds the sync table configuration for a given folder
     * @param {string} folder - Folder path to find sync table for
     * @returns {Object|null} Table configuration object or null if not found
     */
    findSyncTable(folder) {
      let tablePaths = this.tablePaths;
      let table = null;
      let allPaths = this.getAllSubPaths(folder);

      for (let i = 0; i <= allPaths.length; i++) {
        if (tablePaths.includes(allPaths[i])) {
          table = this.tables[tablePaths.indexOf(allPaths[i])];
          break;
        }
      }

      return table;
    }

    /**
     * Gets all sub-paths for a given path
     * @param {string} path - Path to get sub-paths for
     * @returns {Array<string>} Array of sub-paths
     */
    getAllSubPaths(path) {
      let paths = [];
      let parts = path.split("/");

      for (let i = parts.length; i > 0; i--) {
        paths.push(parts.slice(0, i).join("/"));
      }

      return paths;
    }

    /**
     * Finds NocoDB base ID for a sync folder
     * @param {string} folder - Folder path
     * @param {string} [mode="upload"] - Sync mode ("upload" or "download")
     * @returns {string} NocoDB base ID
     */
    findSyncFolderNocodDBBaseID(folder, mode = "upload") {
      const table = this.findSyncTable(folder);
      const isSeparateMode =
        table && "separateMode" in table && table.separateMode === true;
      if (mode === "upload") {
        return (
          table?.[this.nocoDBBaseSettings.baseIDName] ||
          this[this.nocoDBBaseSettings.defaultBaseIDName]
        );
      } else if (mode === "download") {
        return (
          (isSeparateMode &&
            table?.[this.nocoDBBaseSettings.downloadBaseIDName]) ||
          table?.[this.nocoDBBaseSettings.baseIDName] ||
          this[this.nocoDBBaseSettings.defaultBaseIDName]
        );
      }
    }

    /**
     * Finds custom fields configuration for a sync folder
     * @param {string} folder - Folder path
     * @returns {Object|false} Custom fields configuration or false if not found
     */
    findSyncFolderCustomFields(folder) {
      const isCustomSyncFieldsOverrideMode = this.getBooleanSyncSettingByLevel(
        "customFieldsOverrideMode",
        null,
        folder,
        false
      );
      return {
        ...(this.isObject(this.syncSettings.customFields) &&
        !isCustomSyncFieldsOverrideMode
          ? this.syncSettings.customFields
          : {}),
        ...(this.findSyncTable(folder)?.customFields || {}),
      };
    }

    /**
     * Finds NocoDB table ID for a sync folder
     * @param {string} folder - Folder path
     * @param {string} [mode="upload"] - Sync mode ("upload" or "download")
     * @returns {string} NocoDB table ID
     */
    findSyncFolderNocodDBTableID(folder, mode = "upload") {
      let table = this.findSyncTable(folder);
      const isSeparateMode =
        table && "separateMode" in table && table.separateMode === true;
      if (mode === "upload") {
        return (
          table?.[this.nocoDBBaseSettings.tableIDName] ||
          this[this.nocoDBBaseSettings.defaultTableIDName]
        );
      } else if (mode === "download") {
        return (
          (isSeparateMode &&
            table?.[this.nocoDBBaseSettings.downloadTableIDName]) ||
          table?.[this.nocoDBBaseSettings.tableIDName] ||
          this[this.nocoDBBaseSettings.defaultTableIDName]
        );
      }
    }

    /**
     * Finds NocoDB View ID for a sync folder
     * @param {string} folder - Folder path
     * @param {string} [mode="upload"] - Sync mode ("upload" or "download")
     * @returns {string} NocoDB table ID
     */
    findSyncFolderNocodDBViewID(folder, mode = "upload") {
      let table = this.findSyncTable(folder);
      const isSeparateMode =
        table && "separateMode" in table && table.separateMode === true;
      if (mode === "upload") {
        return (
          table?.[this.nocoDBBaseSettings.viewIDName] ||
          this[this.nocoDBBaseSettings.defaultViewIDName]
        );
      } else if (mode === "download") {
        return (
          (isSeparateMode &&
            table?.[this.nocoDBBaseSettings.downloadViewIDName]) ||
          table?.[this.nocoDBBaseSettings.viewIDName] ||
          this[this.nocoDBBaseSettings.defaultViewIDName]
        );
      }
    }

    /**
     * Sets API URL for a folder based on sync mode
     * @param {string} folder - Folder path
     * @param {string} [mode="upload"] - Sync mode ("upload" or "download")
     * @returns {Promise<void>}
     */
    async setApiUrlForFolder(folder, mode = "upload") {
      const table = this.findSyncTable(folder);
      if (!table) {
        this.apiUrl = this.makeApiUrl(
          this.apiUrlRoot,
          this.defaultBaseID || this.defaultAppToken,
          this.defaultTableID
        );
        return;
      }
      const baseID = this.findSyncFolderNocodDBBaseID(folder, mode);
      const tableID = this.findSyncFolderNocodDBTableID(folder, mode);

      this.recordUrlBase = this.setSyncFolderRecordTableUrlBase(folder, mode);
      this.apiUrl = this.makeApiUrl(this.apiUrlRoot, baseID, tableID);
    }

    /**
     * Sets record table URL base for a sync folder
     * @param {string} folder - Folder path
     * @returns {string} Record table URL base
     */
    setSyncFolderRecordTableUrlBase(folder, mode = "upload") {
      const tableID = this.findSyncFolderNocodDBTableID(folder, mode);
      const baseID = this.findSyncFolderNocodDBBaseID(folder, mode);
      return this.recordUrlRoot + baseID + "/" + tableID + "/";
    }

    /**
     * Sets custom sync fields for a folder
     * @param {string} folder - Folder path
     * @returns {Promise<void>}
     */
    async setCustomSyncFields(folder) {
      this.setObjectTypeSyncSettingForFolder(folder, "customFields");
    }

    /**
     * Sets extract key points fields for a folder
     * @param {string} folder - Folder path
     * @returns {Promise<void>}
     */
    async setExtractKeyPointsFields(folder) {
      this.setObjectTypeSyncSettingForFolder(folder, "extractKeyPoints");
    }

    /**
     * Sets extract blocks fields for a folder
     * @param {string} folder - Folder path
     * @returns {Promise<void>}
     */
    async setExtractBlocksFields(folder) {
      this.setObjectTypeSyncSettingForFolder(folder, "extractBlocks");
    }

    async setExtractTagLinesFields(folder) {
      this.setObjectTypeSyncSettingForFolder(folder, "extractTagLines");
    }

    async setExtractSectionsFields(folder) {
      this.setObjectTypeSyncSettingForFolder(folder, "extractSections");
    }

    setObjectTypeSyncSettingForFolder(folder, settingName) {
      const isOverrideMode = this.getBooleanSyncSettingByLevel(
        `${settingName}OverrideMode`,
        null,
        folder,
        false
      );
      this[settingName] = {
        ...(this.isObject(this.syncSettings[settingName]) && !isOverrideMode
          ? this.syncSettings[settingName]
          : {}),
        ...(this.findSyncTable(folder)?.[settingName] || {}),
      };
    }

    getNoteSyncSetting(settingPropertyName, note) {
      return note?.frontmatter?.[settingPropertyName];
    }

    getTableSyncSetting(settingPropertyName, folder) {
      const table = this.findSyncTable(folder);
      return table?.[settingPropertyName];
    }

    getGlobalSyncSetting(settingPropertyName) {
      return this.syncSettings[settingPropertyName];
    }

    getSyncSettingByLevel(settingPropertyName, note, folder, fallbackValue) {
      const noteSetting = this.getNoteSyncSetting(settingPropertyName, note);
      const tableSetting = this.getTableSyncSetting(
        settingPropertyName,
        folder
      );
      const globalSetting = this.getGlobalSyncSetting(settingPropertyName);

      const fallbackValueIsArray = Array.isArray(fallbackValue);
      const checkSetting = (setting) => {
        return (
          setting !== undefined &&
          (typeof fallbackValue === "boolean" ||
            (fallbackValueIsArray && setting !== null))
        );
      };

      if (checkSetting(noteSetting)) {
        return noteSetting;
      }
      if (checkSetting(tableSetting)) {
        return tableSetting;
      }
      if (checkSetting(globalSetting)) {
        return globalSetting;
      }

      return noteSetting || tableSetting || globalSetting || fallbackValue;
    }

    getBooleanSyncSettingByLevel(property, note, folder, fallbackValue) {
      let responseValue = this.getSyncSettingByLevel(
        property,
        note,
        folder,
        fallbackValue
      );

      return (responseValue = String(responseValue) === "true");
    }

    combineArraySyncSettings(settingPropertyName, note, folder) {
      let noteSetting = this.getNoteSyncSetting(settingPropertyName, note);
      let tableSetting = this.getTableSyncSetting(settingPropertyName, folder);
      let globalSetting = this.getGlobalSyncSetting(settingPropertyName);

      if (noteSetting === undefined) {
        noteSetting = [];
      }
      if (tableSetting === undefined) {
        tableSetting = [];
      }
      if (globalSetting === undefined) {
        globalSetting = [];
      }

      if (!Array.isArray(noteSetting)) {
        throw new Error(
          `Setting '${settingPropertyName}' in note frontmatter must be an array.`
        );
      }
      if (!Array.isArray(tableSetting)) {
        throw new Error(
          `Setting '${settingPropertyName}' in table config must be an array.`
        );
      }
      if (!Array.isArray(globalSetting)) {
        throw new Error(
          `Setting '${settingPropertyName}' in global sync settings must be an array.`
        );
      }

      const combined = [...globalSetting, ...tableSetting, ...noteSetting];
      return [...new Set(combined)];
    }
  };
}

module.exports = IOTONocoDB;
