/**
 * Creates an IOTOAirtableDB class that extends MyNocoDB for Airtable database operations
 * @param {Object} tp - Template processor object
 * @returns {Class} MyAirtableDB class extending MyNocoDB
 */
function IOTOAirtableDB(tp) {
  let MyNocoDB = tp.user.IOTONocoDB(tp);
  return class MyAirtableDB extends MyNocoDB {
    /**
     * Creates an instance of MyAirtableDB
     * @param {Object} nocoDBSettings - Configuration settings for the database
     * @param {string} nocoDBSettings.apiKey - API key for authentication
     * @param {string} nocoDBSettings.baseID - Airtable base ID
     * @param {string} nocoDBSettings.tableID - Airtable table ID
     */
    constructor(nocoDBSettings) {
      super(
        nocoDBSettings,
        {
          dbName: "Airtable",
          recordIdPropertyName: "airtableRecordID",
          recordIdPropertyNameForDownload: "airtableDownloadRecordID",
          recordIdName: "id",
          useDate: false,
          apiUrlRoot: "https://api.airtable.com/v0/",
          recordUrlRoot: "https://airtable.com/",
        },
        {
          baseIDName: "baseID",
          defaultBaseIDName: "defaultBaseID",
          downloadBaseIDName: "downloadBaseID",
          tableIDName: "tableID",
          defaultTableIDName: "defaultTableID",
          downloadTableIDName: "downloadTableID",
        }
      );
      this.extractKeyPointsAsText = false;
      this.extractBlocksAsText = false;
      this.extractTagLinesAsText = false;
      this.extractSectionsAsText = true;
      this.contentMaxLength = 99000;
    }

    /**
     * Constructs the API URL for Airtable requests
     * @param {string} root - Base API URL root
     * @param {string} baseID - Airtable base ID
     * @param {string} tableID - Airtable table ID
     * @returns {string} Complete API URL for the specified table
     */
    makeApiUrl(root, baseID, tableID) {
      return `${root}${baseID}/${tableID}`;
    }
  };
}

module.exports = IOTOAirtableDB;
