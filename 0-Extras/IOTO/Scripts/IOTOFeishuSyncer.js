function IOTOFeishuSyncer(tp) {
  let NocoDBSyncer = tp.user.IOTONocoDBSyncer(tp);
  const ml = new (tp.user.IOTOMultiLangs())();
  return class FeishuSyncer extends NocoDBSyncer {
    constructor(nocodb, tp, app, updateNotesInOB = true) {
      super(nocodb, tp, app, updateNotesInOB);
      (async () => await this.setNewApiToken())();
    }

    async retriveRecordInNocoDB(rid) {
      try {
        const url = this.nocodb.apiUrl + `/${rid}`;
        const requestConfig = this.createRequestConfig(
          url,
          "GET",
          null,
          this.apiToken
        );
        const response = await requestUrl(requestConfig);
        return response.json.data.record;
      } catch (error) {
        this.showNotice(error.message, ml.t("RecordRetrieveError"));
        return null;
      }
    }

    async checkRecordInNocoDB(rid) {
      try {
        const url = this.nocodb.apiUrl + `/${rid}`;
        const requestConfig = this.createRequestConfig(
          url,
          "GET",
          null,
          this.apiToken
        );

        const response = await requestUrl(requestConfig);

        return response.status === 200 && response.json.code === 0;
      } catch (error) {
        console.error(error);
        //new this.tp.obsidian.Notice(`当前笔记在数据库中不存在`, 2000);
        return false;
      }
    }

    async retriveRecordsInNocoDB(
      folder = "",
      includesSubfolder = false,
      fields = ""
    ) {
      let url = this.nocodb.apiUrl + "/search";
      const path = this.recordFieldsNames.path;

      const request = {
        filter: {
          conjunction: "and",
          conditions: [
            {
              field_name: path,
              operator: includesSubfolder ? "contains" : "is",
              value: [folder],
            },
          ],
        },
      };
      return await this.getAllRecordsFromTable(url, request);
    }

    async fetchRecordsFromSource(sourceTable) {
      const dateChoice = await this.getDateChoice();

      if (!dateChoice.choice) {
        return [];
      } else {
        this.showNotice(ml.t("GettingRecords"));
        const tableID = sourceTable.tableID || this.nocodb.defaultTableID;
        const appToken = sourceTable.appToken || this.nocodb.defaultAppToken;
        let url = `${this.nocodb.apiUrlRoot}apps/${appToken}/tables/${tableID}/records/search`;
        const request = {
          view_id: sourceTable.viewID,
          field_names: [
            this.fetchTitleFrom,
            this.fetchContentFrom,
            this.subFolder,
            this.extension,
            this.updatedTime,
          ],
        };
        const records = await this.getAllRecordsFromTable(url, request);
        const filteredRecords = await this.filterRecordsByDate(
          records,
          dateChoice
        );
        return filteredRecords;
      }
    }

    async getAllRecordsFromTable(url, request = {}) {
      let records = [];
      let hasMore = false;
      do {
        try {
          let queryUrl = url;
          const requestConfig = this.createRequestConfig(
            queryUrl,
            "POST",
            request,
            this.apiToken
          );
          const response = await requestUrl(requestConfig);

          if (response.json.error) {
            this.showNotice(
              response.json.error.message,
              ml.t("RecordRetrieveError")
            );
          } else {
            const data = response.json;
            records = records.concat(data.data.items);

            hasMore = data.data.has_more || false;
          }
        } catch (error) {
          this.showNotice(error.message, ml.t("RecordRetrieveError"));
          hasMore = false;
        }
      } while (hasMore);

      return this.reformatRecords(records);
    }

    async createRecordsInNocoDB(data, updateNotesInOB = true) {
      const url = this.nocodb.apiUrl + "/batch_create";
      const requestConfig = this.createRequestConfig(
        url,
        "POST",
        data,
        this.apiToken
      );

      let res = false;

      try {
        const responseData = await requestUrl(requestConfig);

        if (responseData.status === 200 && responseData.json.code === 0) {
          res = true;
        } else {
          res = false;
          this.showNotice(
            responseData.json.error.message,
            responseData.json.msg
          );
        }

        if (updateNotesInOB && responseData.json?.data?.records) {
          await this.updateNotesFromRecords(
            responseData.json.data.records,
            true
          );
          res = true;
        }
      } catch (error) {
        this.showNotice(error.message, ml.t("RecordCreateError"));
        res = false;
      }

      return res;
    }

    async updateRecordsInNocoDB(data) {
      let res = false;
      try {
        const url = this.nocodb.apiUrl + "/batch_update";
        const requestConfig = this.createRequestConfig(
          url,
          "POST",
          data,
          this.apiToken
        );

        const response = await requestUrl(requestConfig);
        const responseData = response.json;

        if (response.status === 200 && responseData.code === 0) {
          await this.updateNotesFromRecords(responseData.data.records);
          res = true;
        } else {
          this.showNotice(`${responseData.msg}: ${responseData.error.message}`);
          res = false;
        }
      } catch (error) {
        this.showNotice(error.message, ml.t("RecordUpdateError"));
        res = false;
      }

      return res;
    }

    async deleteRecordsInNocoDB(recordID) {
      try {
        const url = this.nocodb.apiUrl + "/" + recordID;
        const requestConfig = this.createRequestConfig(
          url,
          "DELETE",
          null,
          this.apiToken
        );
        const response = await requestUrl(requestConfig);

        if (response.status === 200 && response.json.data.deleted) {
          this.showNotice(ml.t("RecordDeleteSuccess"));
          return true;
        }
        return false;
      } catch (error) {
        this.showNotice(error.message, ml.t("RecordDeleteError"));
        return false;
      }
    }

    reformatRecords(records) {
      if (records.length) {
        for (let index = 0; index < records.length; index++) {
          for (let [key, value] of Object.entries(records[index].fields)) {
            if (
              Array.isArray(value) &&
              typeof value.first() === "object" &&
              "text" === value.first()?.type
            ) {
              records[index].fields[key] = value.first().text;
            } else if (typeof value === "object" && 1 === value.type) {
              records[index].fields[key] = value.value.first().text;
            } else {
              records[index].fields[key] = value;
            }
          }
        }
        return records;
      } else {
        return [];
      }
    }

    async setNewApiToken() {
      this.apiToken = await this.getNewApiToken();
    }

    async getNewApiToken() {
      const data = {
        app_id: this.nocodb.appID,
        app_secret: this.nocodb.appSecret,
      };

      const url =
        "https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal/";

      const requestConfig = this.createRequestConfig(url, "POST", data);
      try {
        const res = await requestUrl(requestConfig);

        return res.json.app_access_token;
      } catch (error) {
        console.error(error.message);
      }
    }
  };
}

module.exports = IOTOFeishuSyncer;
