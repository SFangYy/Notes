function IOTOVikaDB(tp) {
  let MyNocoDB = tp.user.IOTONocoDB(tp);
  return class MyVikaDB extends MyNocoDB {
    constructor(nocoDBSettings) {
      super(
        nocoDBSettings,
        {
          dbName: "VIKA",
          recordIdPropertyName: "vikaRecordID",
          recordIdPropertyNameForDownload: "vikaDownloadRecordID",
          recordIdName: "recordId",
          useDate: false,
          apiUrlRoot: "https://api.vika.cn/fusion/v1/datasheets/",
          recordUrlRoot: "https://vika.cn/workbench/",
        },
        {
          tableIDName: "tableID",
          defaultTableIDName: "defaultTableID",
          downloadTableIDName: "downloadTableID",
        }
      );
      delete this.defaultBaseID;
      this.apiUrlBase = this.apiUrlRoot;
      this.apiUrl =
        this.apiUrlBase + `${this.defaultTableID}/records?fieldKey=name`;
      this.recordUrlBase = this.recordUrlRoot;
      this.extractKeyPointsAsText = true;
      this.extractBlocksAsText = true;
      this.extractTagLinesAsText = true;
      this.extractSectionsAsText = true;
      this.contentMaxLength = 99000;
    }

    setSyncFolderRecordTableUrlBase(folder, mode = "upload") {
      let tableID = this.findSyncFolderNocodDBTableID(folder, mode);
      // Vika don't have Baseid in record url
      return this.recordUrlRoot + tableID + "/";
    }

    makeApiUrl(root, baseID, tableID) {
      return `${root}${tableID}/records?fieldKey=name`;
    }
  };
}

module.exports = IOTOVikaDB;
