function IOTOWpsDB(tp) {
  let MyNocoDB = tp.user.IOTONocoDB(tp);
  return class MyWpsDB extends MyNocoDB {
    constructor(nocoDBSettings) {
      super(
        nocoDBSettings,
        {
          dbName: "WPS",
          recordIdPropertyName: "wpsRecordID",
          recordIdPropertyNameForDownload: "wpsDownloadRecordID",
          recordIdName: "id",
          useDate: false,
          apiUrlRoot: "https://openapi.wps.cn/v7/coop/",
          recordUrlRoot: "https://www.kdocs.cn/l/",
        },
        {
          baseIDName: "fileID",
          defaultBaseIDName: "defaultFileID",
          downloadBaseIDName: "downloadFileID",
          tableIDName: "sheetID",
          defaultTableIDName: "defaultSheetID",
          downloadTableIDName: "downloadSheetID",
          viewIDName: "viewID",
          defaultViewIDName: "defaultViewID",
          downloadViewIDName: "downloadViewID",
        }
      );

      this.appID = nocoDBSettings.appID;
      this.appKey = nocoDBSettings.appKey;
      this.access_token = nocoDBSettings.accessToken || "";

      this.defaultFileID =
        nocoDBSettings.defaultFileID || nocoDBBaseSettings.fileID || "";
      this.defaultBaseID = this.defaultFileID;
      this.defaultSheetID =
        nocoDBSettings.defaultSheetID || nocoDBBaseSettings.sheetID || "";
      this.defaultTableID = this.defaultSheetID;

      this.apiUrlBase = this.apiUrlRoot;
      this.apiUrl =
        this.apiUrlBase + `${this.defaultTableID}/records?fieldKey=name`;
      this.recordUrlBase = this.recordUrlRoot;
      this.extractKeyPointsAsText = true;
      this.extractBlocksAsText = true;
      this.extractTagLinesAsText = true;
      this.extractSectionsAsText = true;
      this.contentMaxLength = 32760;
    }

    setSyncFolderRecordTableUrlBase(folder, mode = "upload") {
      // https://www.kdocs.cn/l/cmLlHZY7Iyg7?R=L0MvMy9JfHZpZXdJZD1D
      let baseID = this.findSyncFolderNocodDBBaseID(folder, mode);
      return this.recordUrlRoot + baseID + "?R=";
    }

    makeApiUrl(root, baseID, tableID) {
      return `${root}dbsheet/${baseID}/sheets/${tableID}/records`;
    }
  };
}

module.exports = IOTOWpsDB;
