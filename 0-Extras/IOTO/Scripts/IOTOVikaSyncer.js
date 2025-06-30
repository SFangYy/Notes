function IOTOVikaSyncer(tp) {
  let NocoDBSyncer = tp.user.IOTONocoDBSyncer(tp);
  const ml = new (tp.user.IOTOMultiLangs())();
  return class VikaSyncer extends NocoDBSyncer {
    constructor(nocodb, tp, app, updateNotesInOB = true) {
      super(nocodb, tp, app, (updateNotesInOB = true));
    }

    async retriveRecordInNocoDB(rid) {
      try {
        const url = this.nocodb.apiUrl + `&recordIds=${rid}`;
        const requestConfig = this.createRequestConfig(url, "GET");
        const response = await requestUrl(requestConfig);
        return response.json.data.records.first();
      } catch (error) {
        this.showNotice(error.message, ml.t("RecordRetrieveError"));
        return null;
      }
    }

    async checkRecordInNocoDB(rid) {
      try {
        const url = this.nocodb.apiUrl + `&recordIds[]=${rid}`;
        const requestConfig = this.createRequestConfig(url, "GET");
        const response = await requestUrl(requestConfig);
        return response.json.data.records.length ? true : false;
      } catch (error) {
        console.error(error);
        return false;
      }
    }

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
        url += `&filterByFormula=${encodeURI(filterFormula)}`;
      }

      if (fields) {
        url += `&fields=${encodeURIComponent(fields)}`;
      }

      url += "&pageSize=1000&offset=";

      return await this.getAllRecordsFromTable(url);
    }

    async fetchRecordsFromSource(sourceTable) {
      const dateChoice = await this.getDateChoice();
      if (!dateChoice.choice) {
        return [];
      } else {
        const tableID = sourceTable.tableID || this.nocodb.defaultTableID;
        const fields = [
          this.fetchTitleFrom,
          this.fetchContentFrom,
          this.subFolder,
          this.extension,
          this.updatedTime,
        ];
        let url = `${
          this.nocodb.apiUrlBase
        }${tableID}/records?fieldKey=name&viewId=${sourceTable.viewID}&${fields
          .map((f) => `fields%5B%5D=${encodeURIComponent(f)}`)
          .join("&")}&offset=`;

        const records = await this.getAllRecordsFromTable(url);
        const filteredRecords = await this.filterRecordsByDate(
          records,
          dateChoice
        );
        return filteredRecords;
      }
    }

    async getAllRecordsFromTable(url) {
      let records = [];
      let offset = "";
      do {
        try {
          let queryUrl = url + offset;
          const requestConfig = this.createRequestConfig(queryUrl, "GET");
          const response = await requestUrl(requestConfig);

          const data = response.json;

          if (!data.success) {
            this.showNotice(data.message, ml.t("RecordRetrieveError"));
          } else {
            records = records.concat(data.data.records);
            offset = data.offset || "";
          }
        } catch (error) {
          this.showNotice(error.message, ml.t("RecordRetrieveError"));
          break;
        }
      } while (offset !== "");

      return records;
    }

    async createRecordsInNocoDB(data, updateNotesInOB = true) {
      const requestConfig = this.createRequestConfig(null, "POST", data);
      const res = await fetch(this.nocodb.apiUrl, requestConfig)
        .then((response) => response.json())
        .then(async (data) => {
          if (!data.success) {
            this.showNotice(data.message, ml.t("RecordCreateError"));
            return false;
          } else {
            if (updateNotesInOB) {
              await this.updateNotesFromRecords(data.data.records, true);
            }
            return true;
          }
        })
        .catch((error) => {
          this.showNotice(error.message, ml.t("RecordCreateError"));
        });

      return res;
    }

    async updateRecordsInNocoDB(data) {
      //console.dir(data);
      let res = false;
      try {
        // 构建请求配置
        const url = this.nocodb.apiUrl;
        const requestConfig = this.createRequestConfig(url, "PATCH", data);
        const response = await requestUrl(requestConfig);

        const responseData = response.json;
        if (response.status === 200) {
          await this.updateNotesFromRecords(responseData.data.records);
          res = true;
        } else {
          this.showNotice(`HTTP ${response.status}`, ml.t("RecordUpdateError"));
          return false;
        }
      } catch (error) {
        this.showNotice(error.message, ml.t("RecordUpdateError"));
        res = false;
      }

      return res;
    }

    async deleteRecordsInNocoDB(recordID) {
      // TODO 完善被删除的Records的生成逻辑，可以批量删除记录
      const url = this.nocodb.apiUrl + `&recordIds=${recordID}`;
      const requestConfig = this.createRequestConfig(url, "DELETE");
      try {
        const response = await requestUrl(requestConfig);

        const data = response.json;

        if (data.success) {
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

module.exports = IOTOVikaSyncer;
