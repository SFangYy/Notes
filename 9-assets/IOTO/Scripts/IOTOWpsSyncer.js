function IOTOWpsSyncer(tp) {
  let NocoDBSyncer = tp.user.IOTONocoDBSyncer(tp);
  return class WpsSyncer extends NocoDBSyncer {
    constructor(nocodb, tp, app, updateNotesInOB = true) {
      super(nocodb, tp, app, (updateNotesInOB = true));
      (async () => await this.setNewApiToken())();
    }

    async retriveRecordInNocoDB(rid) {
      try {
        const url = this.nocodb.apiUrl + `/${rid}`;

        const response = await requestUrl({
          url: url,
          headers: {
            Authorization: "Bearer " + this.apiToken,
          },
          method: "GET",
        });
        const formattedRecord = this.reformatRecords([
          response.json.data.record,
        ])[0];
        return formattedRecord;
      } catch (error) {
        this.redirectToWpsApiExplorer(error);
        this.showNotice(error.message, "获取记录出错");
        return null;
      }
    }

    async checkRecordInNocoDB(rid) {
      // 构建请求URL
      const url = this.nocodb.apiUrl + `/${rid}`;

      try {
        // 发送GET请求检查记录是否存在
        const response = await requestUrl({
          url: url,
          headers: {
            Authorization: `Bearer ${this.apiToken}`,
          },
          method: "GET",
        });

        // 根据响应状态码返回布尔值
        return response.status === 200;
      } catch (error) {
        this.redirectToWpsApiExplorer(error);
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
      let url = this.nocodb.apiUrl;
      // 金山在获取记录时，是通过POST的方式在Body中传递查询参数的
      const request = {
        filter: {
          mode: "AND",
          criteria: [
            {
              field: this.recordFieldsNames.path,
              operator: includesSubfolder ? "Contains" : "Equals",
              value: [folder],
            },
          ],
        },
      };
      return await this.getAllRecordsFromTable(url, request);
    }

    async fetchRecordsFromSource(sourceTable) {
      let url =
        this.nocodb.apiUrlBase + `tables/${sourceTable.sheetID}/records/search`;
      const request = {
        view_id: sourceTable.viewID,
        field_names: [
          this.fetchTitleFrom,
          this.fetchContentFrom,
          this.subFolder,
          this.extension,
        ],
      };
      let records = await this.getAllRecordsFromTable(url, request);
      return records;
    }

    async getAllRecordsFromTable(url, request = {}) {
      let records = [];
      let hasMore = false;
      do {
        try {
          // 使用requestUrl发送请求
          const response = await requestUrl({
            url: url,
            headers: { Authorization: "Bearer " + this.apiToken },
            method: "POST",
            body: JSON.stringify(request),
          });

          // 处理响应数据
          const data = response.json;

          records = records.concat(data.data.records);
          //new this.tp.obsidian.Notice(`已获取${records.length}条数据记录`);

          // 检查是否有更多数据
          hasMore = data.data.page_token.length > 0 || false;
        } catch (error) {
          this.redirectToWpsApiExplorer(error);
          this.showNotice(error.message, "获取记录出错");
          hasMore = false;
        }
      } while (hasMore);

      return this.reformatRecords(records);
    }

    async createRecordsInNocoDB(data, updateNotesInOB = true) {
      const processedData = this.prepareDataForNocoDB(data);

      const url = this.nocodb.apiUrl + "/create";

      const requestData = {
        url: url,
        method: "POST",
        body: JSON.stringify(processedData),
        headers: {
          Authorization: "Bearer " + this.apiToken,
          "Content-Type": "application/json",
        },
      };

      let res = false;

      try {
        // 发送请求并获取响应
        const responseData = await requestUrl(requestData);

        // 检查响应状态码
        if (responseData.status !== 200) {
          res = false;
        }

        // 如果需要更新本地笔记
        if (updateNotesInOB && responseData.json?.data?.records) {
          console.log("Update Notes");
          const records = this.reformatRecords(responseData.json.data.records);
          await this.updateNotesFromRecords(records, true);
          res = true;
        }
      } catch (error) {
        console.error(error);
        // 错误处理和日志记录
        this.redirectToWpsApiExplorer(error);
        this.showNotice(error.message, "创建记录出错");
        res = false;
      }

      return res;
    }

    async updateRecordsInNocoDB(data) {
      let res = false;
      try {
        // 构建请求配置
        const processedData = this.prepareDataForNocoDB(data);
        const requestConfig = {
          url: this.nocodb.apiUrl + "/update",
          headers: {
            Authorization: "Bearer " + this.apiToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(processedData),
          method: "POST",
        };

        // 发送批量更新请求
        const response = await requestUrl(requestConfig);

        const responseData = response.json;
        // 检查响应状态并处理结果
        if (response.status === 200) {
          // 更新成功,同步更新本地笔记
          await this.updateNotesFromRecords(
            this.reformatRecords(responseData.data.records)
          );
          res = true;
        } else {
          // 更新失败,显示错误提示
          res = false;
        }
      } catch (error) {
        // 记录详细错误信息
        this.redirectToWpsApiExplorer(error);
        this.showNotice(error.message, "更新记录出错");
        res = false;
      }

      return res;
    }

    async deleteRecordsInNocoDB(recordID) {
      // TODO 完善被删除的Records的生成逻辑，可以批量删除记录
      try {
        const url = this.nocodb.apiUrl + "/batch_delete";
        const response = await requestUrl({
          url: url,
          method: "POST",
          body: JSON.stringify({ records: [recordID] }),
          headers: {
            Authorization: "Bearer " + this.apiToken,
          },
        });
        if (
          response.status === 200 &&
          response.json.data.records.length &&
          response.json.data.records[0].deleted === true
        ) {
          this.showNotice("数据库记录删除成功");
          return true;
        }
        return false;
      } catch (error) {
        this.redirectToWpsApiExplorer(error);
        this.showNotice(error.message, "删除记录失败");
        return false;
      }
    }

    async setNewApiToken() {
      this.apiToken = await this.getNewApiToken();
    }

    // 获取最新的app_access_token
    async getNewApiToken() {
      if (this.nocodb.access_token) return this.nocodb.access_token;
      const body = `grant_type=client_credentials&client_id=${this.nocodb.appID}&client_secret=${this.nocodb.appKey}`;

      // 构造请求金山 API 的 URL 和选项。
      const apiUrl = "https://openapi.wps.cn/oauth2/token";
      try {
        const res = await requestUrl({
          url: apiUrl,
          method: "POST", // 请求方法。
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          }, // 请求头。
          body: body, // 请求体。
        });

        return res.json.access_token;
      } catch (error) {
        console.error(error);
      }
    }

    prepareDataForNocoDB(data) {
      if (data && data.records && Array.isArray(data.records)) {
        data.records = data.records.map((record) => {
          if (record.fields !== undefined) {
            record = this.processRecord(record);
            record.fields_value = JSON.stringify(record.fields);
            delete record.fields;
          }
          return record;
        });
      }
      data.prefer_id = false;
      return data;
    }

    fliterOutEmptyFields(record) {
      if (!record.fields) return record;
      for (const key in record.fields) {
        const value = record.fields[key];
        if (
          value === "" ||
          value === null ||
          value === undefined ||
          value.length === 0
        ) {
          delete record.fields[key];
        }
      }
      return record;
    }

    processRecord(record) {
      // 依次调用三个处理方法
      record = this.fliterOutEmptyFields(record);
      record = this.convertMultipleSelectToText(record);
      return record;
    }

    setRecordURL(dbURLProperty, note, record, updateFromDownload) {
      const urlBase = this.nocodb.setSyncFolderRecordTableUrlBase(
        note.folder,
        updateFromDownload ? "download" : "upload"
      );

      const tableID = this.nocodb.findSyncFolderNocodDBTableID(
        note.folder,
        updateFromDownload ? "download" : "upload"
      );

      const path = `/C/${tableID}/${
        record[this.recordIdName]
      }|isShowComment=false|disableCommentAndDynamic=false`;

      const base64str = btoa(path);
      return {
        [dbURLProperty]: urlBase + encodeURIComponent(base64str),
      };
    }

    convertMultipleSelectToText(record) {
      if (!record.fields) return record;
      for (const key in record.fields) {
        const value = record.fields[key];
        if (Array.isArray(value) && value.length > 0) {
          record.fields[key] = `${key}:\n` + value.join("\n");
        }
      }
      return record;
    }

    reformatRecords(records) {
      if (records && records.length) {
        records = records.map((record) => {
          if (record.fields !== undefined) {
            record.fields = JSON.parse(record.fields);
            // 将字段值中被 JSON.stringify 的数组还原
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
          }
          return record;
        });
      }
      return records;
    }

    redirectToWpsApiExplorer(error) {
      if (error.status === 403) {
        this.showNotice(
          "即将为您跳转到WPS API Explorer页面，以获取新的Access Token",
          "Access Token已过期",
          "info",
          10000
        );
        window.open("https://open.wps.cn/api-explorer/", "_blank");
      }
    }
  };
}

module.exports = IOTOWpsSyncer;
