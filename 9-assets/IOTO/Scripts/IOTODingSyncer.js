function IOTODingSyncer(tp) {
  let NocoDBSyncer = tp.user.IOTONocoDBSyncer(tp);
  const ml = new (tp.user.IOTOMultiLangs(tp))();
  return class DingSyncer extends NocoDBSyncer {
    constructor(nocodb, tp, app, updateNotesInOB = true) {
      super(nocodb, tp, app, updateNotesInOB);

      (async () => await this.setNewApiToken())();
    }

    async retriveRecordInNocoDB(rid, returnRaw = false) {
      try {
        const url =
          this.nocodb.apiUrl + `/${rid}?operatorId=${this.operatorID}`;
        const requestConfig = this.createRequestConfig(
          url,
          "GET",
          null,
          this.apiToken
        );

        const response = await requestUrl(requestConfig);
        const data = await response.json;
        // 链式处理多选字段，避免中间变量
        const processedData = this.processRecord(data);
        return returnRaw ? response : processedData;
      } catch (error) {
        this.showNotice(error.message, ml.t("RecordRetrieveError"));
        return null;
      }
    }

    async checkRecordInNocoDB(rid) {
      try {
        const response = await this.retriveRecordInNocoDB(rid, true);
        return response.status === 200 && response.json.id;
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
      let url = this.nocodb.apiUrl + "/list?operatorId=" + this.operatorID;
      const path = this.recordFieldsNames.path;

      const request = {
        filter: {
          combination: "and",
          conditions: [
            {
              field: path,
              operator: includesSubfolder ? "contain" : "equal",
              value: [folder],
            },
          ],
        },
      };
      return await this.getAllRecordsFromTable(url, request);
    }

    // DingTalk does not support fetch records from source by view
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
      let nextToken = "";
      do {
        try {
          let queryUrl = url;
          if (nextToken) {
            request.nextToken = nextToken;
          }
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
            records = records.concat(data.records);
            hasMore = data.hasMore || false;
            nextToken = data.nextToken || "";
          }
        } catch (error) {
          this.showNotice(error.message, ml.t("RecordRetrieveError"));
          hasMore = false;
        }
      } while (hasMore);

      return this.reformatRecords(records);
    }

    async createRecordsInNocoDB(data, updateNotesInOB = true) {
      // data 是包含多个 record 的对象，每个 record 可能有 fields
      if (!data) return false;
      data = this.prepareData(data);
      const url = this.nocodb.apiUrl + "?operatorId=" + this.operatorID;
      const requestConfig = this.createRequestConfig(
        url,
        "POST",
        data,
        this.apiToken
      );

      let res = false;

      try {
        const responseData = await requestUrl(requestConfig);

        if (responseData.status === 200) {
          res = true;

          if (updateNotesInOB) {
            // 这里我们需要等待所有的promise完成，得到直接的对象数组
            const records = [];
            for (const record of responseData.json.value) {
              const recordInNocoDB = await this.retriveRecordInNocoDB(
                record.id
              );

              records.push(recordInNocoDB);
            }

            await this.updateNotesFromRecords(records, true);
          }
        } else {
          res = false;
          this.showNotice(
            responseData.json.error.message,
            responseData.json.msg
          );
        }
      } catch (error) {
        this.showNotice(error.message, ml.t("RecordCreateError"));
        res = false;
      }

      return res;
    }

    async updateRecordsInNocoDB(data) {
      // data 是包含多个 record 的对象，每个 record 可能有 fields
      if (!data) return false;
      data = this.prepareData(data);
      let res = false;
      try {
        const url = this.nocodb.apiUrl + "?operatorId=" + this.operatorID;
        const requestConfig = this.createRequestConfig(
          url,
          "PUT",
          data,
          this.apiToken
        );

        const response = await requestUrl(requestConfig);
        const responseData = response.json;

        if (response.status === 200) {
          const records = [];
          for (const record of responseData.value) {
            const recordInNocoDB = await this.retriveRecordInNocoDB(record.id);
            records.push(recordInNocoDB);
          }

          await this.updateNotesFromRecords(records);
          res = true;
        } else {
          this.showNotice(`${responseData.msg}: ${responseData.error.message}`);
          res = false;
        }
      } catch (error) {
        console.error(error);
        this.showNotice(error.message, ml.t("RecordUpdateError"));
        res = false;
      }

      return res;
    }

    async deleteRecordsInNocoDB(recordID) {
      try {
        const url =
          this.nocodb.apiUrl + "/delete?operatorId=" + this.operatorID;
        const requestConfig = this.createRequestConfig(
          url,
          "POST",
          { recordIds: [recordID] },
          this.apiToken
        );

        const response = await requestUrl(requestConfig);

        if (response.status === 200 && response.json.success) {
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
      const reformatRecords = [];
      if (records.length) {
        for (let index = 0; index < records.length; index++) {
          const processedRecord = this.processRecord(records[index]);
          reformatRecords.push(processedRecord);
        }
        return reformatRecords;
      } else {
        return [];
      }
    }

    async setNewApiToken() {
      this.apiToken = await this.getNewApiToken();
      await this.setOperatorID(this.apiToken);
    }

    async getNewApiToken() {
      const data = {
        appKey: this.nocodb.appID,
        appSecret: this.nocodb.appSecret,
      };

      const url = "https://api.dingtalk.com/v1.0/oauth2/accessToken";

      const requestConfig = this.createRequestConfig(url, "POST", data);
      try {
        const res = await requestUrl(requestConfig);
        return res.json.accessToken;
      } catch (error) {
        console.error(error.message);
      }
    }

    /**
     * 依次对 record 进行多选、单选和链接字段的处理
     * @param {Object} record - 原始 record 对象
     * @returns {Object} 处理后的 record 对象
     */
    processRecord(record) {
      // 依次调用三个处理方法
      record = this.processMultipleSelects(record);
      record = this.processSingleSelects(record);
      record = this.processRichText(record);
      record = this.processLink(record);
      record = this.processArrayJSONFields(record);
      return record;
    }

    processMultipleSelects(record) {
      if (!record.fields) return record;
      for (const key in record.fields) {
        const value = record.fields[key];
        if (
          Array.isArray(value) &&
          value.length > 0 &&
          typeof value[0] === "object" &&
          value[0] !== null &&
          "id" in value[0] &&
          "name" in value[0]
        ) {
          record.fields[key] = value.map((item) => item.name);
        }
      }
      return record;
    }

    processArrayJSONFields(record) {
      if (!record.fields) return record;
      for (const key in record.fields) {
        const val = record.fields[key];
        if (typeof val === "string" && val.startsWith(`${key}:`)) {
          try {
            record.fields[key] = val
              .replace(`${key}:`, "")
              .split("\n")
              .filter((item) => item !== "")
              .map((item) => item.trim());
          } catch (e) {
            // 解析失败则保持原值
          }
        }
      }
      return record;
    }

    processSingleSelects(record) {
      if (!record.fields) return record;
      for (const key in record.fields) {
        const value = record.fields[key];
        if (typeof value === "object" && value !== null && value.name) {
          record.fields[key] = value.name;
        }
      }
      return record;
    }

    processRichText(record) {
      if (!record.fields) return record;
      for (const key in record.fields) {
        const value = record.fields[key];
        if (typeof value === "object" && value !== null && value.markdown) {
          record.fields[key] = value.markdown;
        }
      }
      return record;
    }

    processLink(record) {
      if (!record.fields) return record;
      for (const key in record.fields) {
        const value = record.fields[key];
        if (typeof value === "object" && value !== null && value.link) {
          record.fields[key] = value.link;
        }
      }
      return record;
    }

    prepareData(data) {
      if (!data || !data.records) return data;
      data = this.fliterOutEmptyFields(data);
      data = this.prepareLinkFieldsData(data);
      data = this.prepareMultipleSelectsFields(data);
      return data;
    }

    fliterOutEmptyFields(data) {
      if (!data || !data.records) return data;
      for (const recordKey in data.records) {
        const record = data.records[recordKey];
        if (!record || !record.fields) continue;
        for (const key in record.fields) {
          const value = record.fields[key];
          if (
            value === "" ||
            value === null ||
            value === undefined ||
            (Array.isArray(value) && value.length === 0)
          ) {
            delete record.fields[key];
          }
        }
      }
      return data;
    }

    prepareRichTextFields(data) {
      if (!data || !data.records) return data;
      for (const recordKey in data.records) {
        const record = data.records[recordKey];
        if (!record || !record.fields) continue;
        for (const key in record.fields) {
          const value = record.fields[key];
          if (key === "Content") {
            record.fields[key] = {
              markdown: value,
            };
          }
        }
      }
      return data;
    }

    prepareMultipleSelectsFields(data) {
      if (!data || !data.records) return data;
      for (const recordKey in data.records) {
        const record = data.records[recordKey];
        if (!record || !record.fields) continue;
        for (const key in record.fields) {
          const value = record.fields[key];
          if (Array.isArray(value) && value.length > 0) {
            record.fields[key] = `${key}:\n` + value.join("\n");
          }
        }
      }
      return data;
    }

    prepareLinkFieldsData(data) {
      // data 是包含多个 record 的对象，每个 record 可能有 fields
      if (!data || !data.records) return data;

      const urlRegex = /^(https?:\/\/|ftp:\/\/|obsidian:\/\/|www\.)/i;

      // 遍历 data 中的每个 key，视为一个 record
      for (const recordKey in data.records) {
        const record = data.records[recordKey];
        if (!record || !record.fields) continue;

        for (const fieldKey in record.fields) {
          const value = record.fields[fieldKey];
          if (typeof value === "string" && urlRegex.test(value)) {
            record.fields[fieldKey] = { text: "", link: value };
          }
        }
      }

      return data;
    }

    async setOperatorID(apiToken) {
      this.operatorID = await this.getOperatorID(apiToken);
    }

    async getOperatorID(apiToken) {
      const data = {
        userid: this.nocodb.userID,
      };

      const url =
        "https://oapi.dingtalk.com/topapi/v2/user/get?access_token=" + apiToken;

      const requestConfig = this.createRequestConfig(url, "POST", data);
      try {
        const res = await requestUrl(requestConfig);
        return res.json.result.unionid;
      } catch (error) {
        console.error(error.message);
      }
    }

    /**
     * Create request configuration object
     * @param {string} url - Request URL
     * @param {string} method - Request method (GET, POST, PATCH, DELETE)
     * @param {Object} [data=null] - Request body data
     * @param {string} apiKey
     * @param {Object} [additionalHeaders={}] - Additional request headers
     * @returns {Object} Request configuration object
     */
    createRequestConfig(
      url,
      method,
      data = null,
      apiKey = this.nocodb.apiKey || "",
      additionalHeaders = {}
    ) {
      const config = {
        method: method,
        headers: {
          "x-acs-dingtalk-access-token": apiKey,
          ...additionalHeaders,
        },
      };

      if (url) {
        config.url = url;
      }

      if (data) {
        config.headers["Content-Type"] = "application/json";
        config.body = JSON.stringify(data);
      }

      return config;
    }
  };
}

module.exports = IOTODingSyncer;
