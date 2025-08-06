/**
 * Creates an IOTOAirtableSyncer class that extends NocoDBSyncer for Airtable integration
 * @param {Object} tp - Template processor object
 * @returns {Class} AirtableSyncer class
 */
function IOTOAirtableSyncer(tp) {
  let NocoDBSyncer = tp.user.IOTONocoDBSyncer(tp);
  const ml = new (tp.user.IOTOMultiLangs(tp))(tp);
  return class AirtableSyncer extends NocoDBSyncer {
    /**
     * Creates an instance of AirtableSyncer
     * @param {Object} nocodb - NocoDB configuration object
     * @param {Object} tp - Template processor object
     * @param {Object} app - Application instance
     * @param {boolean} [updateNotesInOB=true] - Whether to update notes in Obsidian
     */
    constructor(nocodb, tp, app, updateNotesInOB = true) {
      super(nocodb, tp, app, updateNotesInOB);
    }

    /**
     * Retrieves a single record from NocoDB by record ID
     * @param {string} rid - Record ID to retrieve
     * @returns {Promise<Object|null>} The retrieved record or null if error occurs
     */
    async retriveRecordInNocoDB(rid) {
      try {
        const url = this.nocodb.apiUrl + `/${rid}`;
        const requestConfig = this.createRequestConfig(url, "GET");
        const response = await requestUrl(requestConfig);
        return response.json;
      } catch (error) {
        this.showNotice(error.message, ml.t("RecordRetrieveError"));
        return null;
      }
    }

    /**
     * Checks if a record exists in NocoDB
     * @param {string} rid - Record ID to check
     * @returns {Promise<boolean>} True if record exists, false otherwise
     */
    async checkRecordInNocoDB(rid) {
      // Build request URL
      try {
        const url = this.nocodb.apiUrl + `/${rid}`;
        // Send GET request to check if the record exists
        const requestConfig = this.createRequestConfig(url, "GET");
        const response = await requestUrl(requestConfig);
        // Return boolean value based on response status code
        return response.status === 200;
      } catch (error) {
        console.error(error);
        // new this.tp.obsidian.Notice(`The current note does not exist in the database`, 2000);
        return false;
      }
    }

    /**
     * Retrieves multiple records from NocoDB based on folder criteria
     * @param {string} [folder=""] - Folder path to filter records
     * @param {boolean} [includesSubfolder=false] - Whether to include subfolders
     * @param {string} [fields=""] - Specific fields to retrieve
     * @returns {Promise<Array>} Array of retrieved records
     */
    async retriveRecordsInNocoDB(
      folder = "",
      includesSubfolder = false,
      fields = ""
    ) {
      let url = this.nocodb.apiUrl;
      const path = this.recordFieldsNames.path;

      // Airtable and vika use filter to get records
      if (folder) {
        const filterFormula = !includesSubfolder
          ? `{${path}} = '${folder}'`
          : `SEARCH('${folder}', {${path}}) = 1`;
        url += `?filterByFormula=${encodeURIComponent(filterFormula)}`;
      }

      if (fields) {
        url +=
          (folder ? "&" : "?") + `fields%5B%5D=${encodeURIComponent(fields)}`;
      }

      url += (folder || fields ? "&" : "?") + "offset=";

      return await this.getAllRecordsFromTable(url);
    }

    /**
     * Fetches records from a source table
     * @param {Object} sourceTable - Source table configuration
     * @param {string} sourceTable.tableID - ID of the source table
     * @param {string} sourceTable.viewID - ID of the view to fetch from
     * @returns {Promise<Array>} Array of fetched records
     */
    async fetchRecordsFromSource(sourceTable) {
      const dateChoice = await this.getDateChoice();
      if (!dateChoice.choice) {
        return [];
      } else {
        const fields = [
          this.fetchTitleFrom,
          this.fetchContentFrom,
          this.subFolder,
          this.extension,
          this.updatedTime,
        ];
        const tableID = sourceTable.tableID || this.nocodb.defaultTableID;
        const baseID = sourceTable.baseID || this.nocodb.defaultBaseID;
        const url = `${this.nocodb.apiUrlRoot}${baseID}/${tableID}?view=${
          sourceTable.viewID
        }&${fields
          .map((f) => `fields%5B%5D=${encodeURIComponent(f)}`)
          .join("&")}&offset=`;

        const records = await this.getAllRecordsFromTable(url);

        if (
          records.length > 0 &&
          records[0].fields &&
          records[0].fields.hasOwnProperty(this.updatedTime)
        ) {
          const filteredRecords = await this.filterRecordsByDate(
            records,
            dateChoice
          );
          return filteredRecords;
        } else {
          // If there is no updatedTime field, return all records directly
          return records;
        }
      }
    }

    /**
     * Retrieves all records from a table using pagination
     * @param {string} url - Base URL for the API request
     * @returns {Promise<Array>} Array of all records from the table
     */
    async getAllRecordsFromTable(url) {
      let records = [];
      let offset = "";
      do {
        try {
          let queryUrl = url + offset;
          const requestConfig = this.createRequestConfig(queryUrl, "GET");
          const response = await requestUrl(requestConfig);
          const data = response.json;

          records = records.concat(data.records);
          // new this.tp.obsidian.Notice(`Fetched ${records.length} data records`);

          offset = data.offset || "";
        } catch (error) {
          this.showNotice(error.message, ml.t("RecordRetrieveError"));
          break;
        }
      } while (offset !== "");
      return records;
    }

    /**
     * Creates new records in NocoDB
     * @param {Object} data - Data to create new records
     * @param {boolean} [updateNotesInOB=true] - Whether to update notes in Obsidian
     * @returns {Promise<boolean>} True if creation successful, false otherwise
     */
    async createRecordsInNocoDB(data, updateNotesInOB = true) {
      const url = this.nocodb.apiUrl;
      const requestConfig = this.createRequestConfig(null, "POST", data);

      const response = await fetch(url, requestConfig);
      const res = await response.json().then(async (data) => {
        if (data.error) {
          this.showNotice(data.error.message, ml.t("RecordCreateError"));
          return false;
        } else {
          if (updateNotesInOB && data.records) {
            await this.updateNotesFromRecords(data.records, true);
          }
          return true;
        }
      });
      return res;
    }

    /**
     * Updates existing records in NocoDB
     * @param {Object} data - Data to update records
     * @returns {Promise<boolean>} True if update successful, false otherwise
     */
    async updateRecordsInNocoDB(data) {
      const requestConfig = this.createRequestConfig(null, "PATCH", data);
      const res = await fetch(this.nocodb.apiUrl, requestConfig)
        .then((response) => response.json())
        .then(async (data) => {
          if ("error" in data) {
            this.showNotice(data.error.message, ml.t("RecordUpdateError"));
            return false;
          } else {
            await this.updateNotesFromRecords(data.records);
            return true;
          }
        })
        .catch((error) => {
          console.dir(error);
        });

      return res;
    }

    /**
     * Deletes records from NocoDB
     * @param {string} recordID - ID of the record to delete
     * @returns {Promise<boolean>} True if deletion successful, false otherwise
     */
    async deleteRecordsInNocoDB(recordID) {
      // TODO Improve the logic for generating deleted Records, support batch deletion of records
      const url = this.nocodb.apiUrl + `?records[]=${recordID}`;
      const requestConfig = this.createRequestConfig(url, "DELETE");
      try {
        const response = await requestUrl(requestConfig);
        const data = response.json;
        if (response.status === 200 && data.records[0].deleted) {
          this.showNotice(ml.t("RecordDeleteSuccess"));
          return true;
        }
        return false;
      } catch (error) {
        this.showNotice(error.message, ml.t("RecordDeleteError"));
        return false;
      }
    }
  };
}

module.exports = IOTOAirtableSyncer;
