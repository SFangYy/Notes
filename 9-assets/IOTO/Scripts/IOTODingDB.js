function IOTODingDB(tp) {
  let MyNocoDB = tp.user.IOTONocoDB(tp);
  return class MyDingDB extends MyNocoDB {
    constructor(nocoDBSettings) {
      super(
        nocoDBSettings,
        {
          dbName: "Ding",
          recordIdPropertyName: "dingRecordID",
          recordIdPropertyNameForDownload: "dingDownloadRecordID",
          recordIdName: "id",
          useDate: false,
          apiUrlRoot: "https://api.dingtalk.com/v1.0/",
          recordUrlRoot: "https://alidocs.dingtalk.com/i/nodes/",
        },
        {
          baseIDName: "baseID",
          defaultBaseIDName: "defaultBaseID",
          downloadBaseIDName: "downloadBaseID",
          tableIDName: "sheetID",
          defaultTableIDName: "defaultSheetID",
          downloadTableIDName: "downloadSheetID",
          viewIDName: "viewID",
          defaultViewIDName: "defaultViewID",
          downloadViewIDName: "downloadViewID",
        }
      );
      delete this.apiKey;

      this.appID = nocoDBSettings.appID;
      this.userID = nocoDBSettings.userID;
      this.appSecret = nocoDBSettings.appSecret;
      this.defaultSheetID =
        nocoDBSettings.defaultSheetID || nocoDBBaseSettings.sheetID || "";
      this.defaultTableID = this.defaultSheetID;
      this.apiUrlBase =
        this.apiUrlRoot + `notable/bases/${this.defaultBaseID}/`;
      this.apiUrl = this.apiUrlBase + `sheets/${this.defaultSheetID}/records`;
      this.recordUrlBase = `${this.recordUrlRoot}${this.defaultBaseID}?iframeQuery=record%3D`;
      this.extractKeyPointsAsText = true;
      this.extractBlocksAsText = true;
      this.extractTagLinesAsText = true;
      this.extractSectionsAsText = true;
      this.contentMaxLength = 9999;
    }

    makeApiUrl(root, baseID, tableID) {
      return `${root}notable/bases/${baseID}/sheets/${tableID}/records`;
    }

    setSyncFolderRecordTableUrlBase(folder, mode = "upload") {
      const tableID = this.findSyncFolderNocodDBTableID(folder, mode);
      const baseID = this.findSyncFolderNocodDBBaseID(folder, mode);
      const viewID = this.findSyncFolderNocodDBViewID(folder, mode);
      // https://alidocs.dingtalk.com/i/nodes/3NwLYZXWynKjKKA5tY6a1LazVkyEqBQm?iframeQuery=record%3DrnkKzcV_JYP28Be_UnRmKXnGg9&sideCollapsed=true
      return (
        this.recordUrlRoot +
        baseID +
        `?iframeQuery=record%3D${tableID}_${viewID}_`
      );
    }
  };
}

module.exports = IOTODingDB;
