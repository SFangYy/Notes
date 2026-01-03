function IOTOFeishuDB(tp) {
  let MyNocoDB = tp.user.IOTONocoDB(tp);
  return class MyFeishuDB extends MyNocoDB {
    constructor(nocoDBSettings) {
      super(
        nocoDBSettings,
        {
          dbName: "Feishu",
          recordIdPropertyName: "feishuRecordID",
          recordIdPropertyNameForDownload: "feishuDownloadRecordID",
          recordIdName: "record_id",
          useDate: true,
          apiUrlRoot: "https://open.feishu.cn/open-apis/bitable/v1/",
          recordUrlRoot: "https://feishu.cn/base/",
        },
        {
          baseIDName: "appToken",
          defaultBaseIDName: "defaultAppToken",
          downloadBaseIDName: "downloadAppToken",
          tableIDName: "tableID",
          defaultTableIDName: "defaultTableID",
          downloadTableIDName: "downloadTableID",
        }
      );
      delete this.apiKey;
      delete this.defaultBaseID;
      this.appID = nocoDBSettings.appID;
      this.appSecret = nocoDBSettings.appSecret;
      this.defaultAppToken =
        nocoDBSettings.defaultAppToken || nocoDBSettings.appToken || "";

      this.apiUrlBase = this.apiUrlRoot + `apps/${this.defaultAppToken}/`;
      this.apiUrl = this.apiUrlBase + `tables/${this.defaultTableID}/records`;
      this.recordUrlBase = `${this.recordUrlRoot}${this.defaultAppToken}?table=`;
      this.extractKeyPointsAsText = true;
      this.extractBlocksAsText = true;
      this.extractTagLinesAsText = true;
      this.extractSectionsAsText = true;
      this.contentMaxLength = 19900;
    }

    makeApiUrl(root, baseID, tableID) {
      return `${root}apps/${baseID}/tables/${tableID}/records`;
    }

    setSyncFolderRecordTableUrlBase(folder, mode = "upload") {
      const tableID = this.findSyncFolderNocodDBTableID(folder, mode);
      const baseID = this.findSyncFolderNocodDBBaseID(folder, mode);
      return this.recordUrlRoot + baseID + "?table=" + tableID + "&record_id=";
    }
  };
}

module.exports = IOTOFeishuDB;
