/**
 * Creates an IOTONocoDB class for NocoDB database operations
 * @returns {Class} MyNocoDB class
 */
function IOTONocoDB(tp) {
  const IOTOUtility = tp.user.IOTOUtility(tp, app);
  const ml = new (tp.user.IOTOMultiLangs())();
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
        nocoDBSettings.defaultBaseID || nocoDBBaseSettings.baseID || "";
      this.defaultTableID =
        nocoDBSettings.defaultTableID || nocoDBBaseSettings.tableID || "";

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
     * Sets API URL for a folder based on sync mode
     * @param {string} folder - Folder path
     * @param {string} [mode="upload"] - Sync mode ("upload" or "download")
     * @returns {Promise<void>}
     */
    async setApiUrlForFolder(folder, mode = "upload") {
      const table = this.findSyncTable(folder);

      if (!table) {
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

    /**
     * Gets the sync setting value by priority
     * Priority order: note frontmatter > folder sync table setting > default setting > fallback value
     * @param {string} settingPropertyName - Setting property name
     * @param {Object} note - Note object, contains frontmatter property
     * @param {string} folder - Folder path
     * @param {*} fallbackValue - Fallback value if all other settings are not found
     * @returns {*} The found setting value, or the fallback value if none found
     */
    getSyncSettingByLevel(settingPropertyName, note, folder, fallbackValue) {
      // Get the note's setting
      const noteSetting = note?.frontmatter?.[settingPropertyName];
      const fallbackValueIsArray = Array.isArray(fallbackValue);

      // Check the note's setting
      if (
        noteSetting !== undefined &&
        (typeof fallbackValue === "boolean" ||
          (fallbackValueIsArray && noteSetting !== null))
      ) {
        return noteSetting;
      }

      // Get and check the table's setting
      const table = this.findSyncTable(folder);
      const tableSetting = table?.[settingPropertyName];
      if (
        tableSetting !== undefined &&
        (typeof fallbackValue === "boolean" ||
          (fallbackValueIsArray && tableSetting !== null))
      ) {
        return tableSetting;
      }

      // Get and check the global setting
      const globalSetting = this.syncSettings[settingPropertyName];
      if (
        globalSetting !== undefined &&
        (typeof fallbackValue === "boolean" ||
          (fallbackValueIsArray && globalSetting !== null))
      ) {
        return globalSetting;
      }

      // Return the setting value in the order of priority, until the default value
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
  };
}

module.exports = IOTONocoDB;
