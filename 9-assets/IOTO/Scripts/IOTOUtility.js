function IOTOUtility(tp, app) {
  const ml = new (tp.user.IOTOMultiLangs(tp))();
  return class IOTOUtility {
    constructor(tp, app) {
      this.tp = tp;
      this.app = app;
    }

    showNotice(
      message,
      prefix = "",
      type = "info",
      duration = 3000,
      useConsole = false,
      returnInstance = false
    ) {
      if (useConsole) {
        switch (type) {
          case "error":
            console.error(message);
            break;
          case "warning":
            console.warn(message);
            break;
          default:
            console.log(message);
        }
      }

      if (this.tp && this.tp.obsidian && this.tp.obsidian.Notice) {
        const prefixMessage = prefix && `${prefix}：`;
        const notice = new this.tp.obsidian.Notice(
          prefixMessage + message,
          duration
        );
        return returnInstance ? notice : undefined;
      }
    }

    buildFragment(content, color) {
      const fragment = document.createDocumentFragment();
      const div = document.createElement("div");
      div.textContent = content;
      div.style.color = color;
      fragment.appendChild(div);
      return fragment;
    }

    convertToValidFileName(fileName) {
      return fileName.replace(/[\/|\\:'"()（）{}<>\.\*]/g, "-").trim();
    }

    isObject(value) {
      return Object.prototype.toString.call(value) === "[object Object]";
    }

    async createPathIfNeeded(folderPath) {
      const { vault } = this.app;
      const directoryExists = await vault.exists(folderPath);
      if (!directoryExists) {
        await vault.createFolder(this.tp.obsidian.normalizePath(folderPath));
      }
    }

    async getDateChoice() {
      const dateFilterOptions = [
        { id: 1, label: ml.t("PastHourNotes"), unit: "hours", value: 1 },
        { id: 2, label: ml.t("TodayNote"), unit: "hours", value: 24 },
        { id: 3, label: ml.t("PastThreeDaysNotes"), unit: "days", value: 3 },
        { id: 4, label: ml.t("PastWeekNotes"), unit: "days", value: 7 },
        { id: 5, label: ml.t("PastTwoWeeksNotes"), unit: "days", value: 14 },
        {
          id: 6,
          label: ml.t("PastMonthNotes"),
          unit: "days",
          value: 30,
        },
        { id: 99, label: ml.t("AllNotes") },
      ];

      const unitOptions = [
        { label: ml.t("Minutes"), value: "minutes" },
        { label: ml.t("Hours"), value: "hours" },
        { label: ml.t("Days"), value: "days" },
        { label: ml.t("Weeks"), value: "weeks" },
        { label: ml.t("Months"), value: "months" },
      ];

      const customFilterLabel = ml.t("NotesUpdatedInSpecificTimeRange");
      const allLabels = [
        ...dateFilterOptions.map((option) => option.label),
        customFilterLabel,
      ];
      const allIds = [
        ...dateFilterOptions.map((option) => option.id),
        "custom",
      ];

      let choice = await this.tp.system.suggester(
        allLabels.map((item, index) => `${index + 1}. ${item}`),
        allIds
      );

      let selectedFilter = null;

      if (choice === "custom") {
        const unitChoice = await this.tp.system.suggester(
          unitOptions.map((u) => u.label),
          unitOptions.map((u) => u.value)
        );
        if (!unitChoice) {
          return { choice: null, selectedFilter: null };
        }

        let value = await this.tp.system.prompt(
          `${ml.t("PleaseInputValue")}（${ml.t(
            unitOptions
              .find((u) => u.value === unitChoice)
              .value.charAt(0)
              .toUpperCase() +
              unitOptions.find((u) => u.value === unitChoice).value.slice(1)
          )}）：`,
          ""
        );
        value = parseInt(value, 10);
        if (isNaN(value) || value <= 0) {
          this.showNotice(`${ml.t("PleaseInputValidValue")}`);
          return { choice: null, selectedFilter: null };
        }
        selectedFilter = {
          unit: unitChoice,
          value: value,
        };
        choice = "custom";
      } else {
        selectedFilter = dateFilterOptions.find(
          (option) => option.id === choice
        );
      }

      return {
        choice: choice,
        selectedFilter: selectedFilter,
      };
    }

    static getCurrentHourTime() {
      const now = new Date();

      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(now.getDate()).padStart(2, "0")} ${String(
        now.getHours()
      ).padStart(2, "0")}00`;
    }

    /**
     * 判断传入的 value 是否符合 ISO 8601 UTC 时间格式
     * @param {string} value
     * @returns {boolean}
     */
    isISO8601UTC(value) {
      if (typeof value !== "string") return false;
      // ISO 8601 UTC 格式示例：2023-06-01T12:34:56Z 或 2023-06-01T12:34:56.789Z
      const iso8601UtcRegex =
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
      return iso8601UtcRegex.test(value);
    }

    /**
     * 将 ISO 8601 UTC 时间字符串（如 2023-06-01T12:34:56Z）转换为系统所在时区的 ISO 8601 格式字符串
     * @param {string} utcISOString
     * @returns {string} 系统时区的 ISO 8601 字符串（如 2023-06-01T20:34:56+08:00）
     */
    isoUtcToLocalIsoString(utcISOString) {
      if (typeof utcISOString !== "string") return "";
      // 先校验格式
      const iso8601UtcRegex =
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
      if (!iso8601UtcRegex.test(utcISOString)) return "";
      try {
        const date = new Date(utcISOString);
        if (isNaN(date.getTime())) return "";
        // toISOString() 总是返回 UTC，toLocaleString 受本地影响但不带时区
        // 使用 toISOString 得到本地时间的 ISO 字符串
        // 但我们需要带本地时区的 ISO 字符串
        // 下面手动拼接
        const pad = (n) => String(n).padStart(2, "0");
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hour = pad(date.getHours());
        const minute = pad(date.getMinutes());
        const second = pad(date.getSeconds());
        const ms = date.getMilliseconds();
        let msStr = "";
        if (ms > 0) {
          msStr = "." + String(ms).padStart(3, "0");
        }
        // 获取本地时区偏移，单位为分钟
        const offset = -date.getTimezoneOffset();
        const offsetSign = offset >= 0 ? "+" : "-";
        const offsetAbs = Math.abs(offset);
        const offsetHour = pad(Math.floor(offsetAbs / 60));
        const offsetMin = pad(offsetAbs % 60);
        const tzStr = `${offsetSign}${offsetHour}:${offsetMin}`;
        return `${year}-${month}-${day}T${hour}:${minute}:${second}${msStr}${tzStr}`;
      } catch (e) {
        return "";
      }
    }

    isValidTimestamp(value) {
      value = String(value);
      return (
        typeof value === "string" &&
        /^\d{10}$|^\d{13}$/.test(value) &&
        // 10位秒级时间戳范围：2000-01-01 ~ 2100-01-01
        ((value.length === 10 &&
          Number(value) >= 946684800 &&
          Number(value) <= 4102444800) ||
          // 13位毫秒级时间戳范围：2000-01-01 ~ 2100-01-01
          (value.length === 13 &&
            Number(value) >= 946684800000 &&
            Number(value) <= 4102444800000))
      );
    }

    // 将时间戳（10位或13位）转换为ISO日期格式字符串
    timestampToISODate(timestamp) {
      let ts = Number(timestamp);
      if (isNaN(ts)) return "";
      // 如果是10位，说明是秒，需要转成毫秒
      if (String(ts).length === 10) {
        ts = ts * 1000;
      }
      try {
        const date = new Date(ts);
        if (isNaN(date.getTime())) return "";
        // 转换为当前系统时区的本地时间字符串（格式：YYYY-MM-DD HH:mm:ss）
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(date.getDate()).padStart(2, "0")} ${String(
          date.getHours()
        ).padStart(2, "0")}:${String(date.getMinutes()).padStart(
          2,
          "0"
        )}:${String(date.getSeconds()).padStart(2, "0")}`;
      } catch (e) {
        return "";
      }
    }

    checkDBSettings(nocoDBSettings, dbType) {
      let result = true;
      switch (dbType) {
        case "airtable":
          if (
            !nocoDBSettings.apiKey ||
            !nocoDBSettings.defaultBaseID ||
            !nocoDBSettings.defaultTableID
          ) {
            this.showNotice(
              ml.t("AirtalbeSyncSettingError"),
              ml.t("SyncSettingError"),
              "error"
            );
            result = false;
          }
          break;
        case "vika":
          if (!nocoDBSettings.apiKey || !nocoDBSettings.defaultTableID) {
            this.showNotice(
              ml.t("VikaSyncSettingError"),
              ml.t("SyncSettingError"),
              "error"
            );
            result = false;
          }
          break;
        case "feishu":
          if (
            !nocoDBSettings.appID ||
            !nocoDBSettings.appSecret ||
            !nocoDBSettings.defaultAppToken ||
            !nocoDBSettings.defaultTableID
          ) {
            this.showNotice(
              ml.t("FeishuSyncSettingError"),
              ml.t("SyncSettingError"),
              "error"
            );
            result = false;
          }
          break;
        case "lark":
          if (
            !nocoDBSettings.appID ||
            !nocoDBSettings.appSecret ||
            !nocoDBSettings.defaultAppToken ||
            !nocoDBSettings.defaultTableID
          ) {
            this.showNotice(
              ml.t("LarkSyncSettingError"),
              ml.t("SyncSettingError"),
              "error"
            );
            result = false;
          }
          break;
        case "wps":
          if (
            !nocoDBSettings.appID ||
            !nocoDBSettings.appKey ||
            !nocoDBSettings.defaultFileID ||
            !nocoDBSettings.defaultSheetID
          ) {
            this.showNotice(
              ml.t("WpsSyncSettingError"),
              ml.t("SyncSettingError"),
              "error"
            );
            result = false;
          }
          break;
        case "ding":
          if (
            !nocoDBSettings.appID ||
            !nocoDBSettings.appSecret ||
            !nocoDBSettings.userID ||
            !nocoDBSettings.defaultBaseID ||
            !nocoDBSettings.defaultSheetID
          ) {
            this.showNotice(
              ml.t("DingSyncSettingError"),
              ml.t("SyncSettingError"),
              "error"
            );
            result = false;
          }
          break;
        default:
          result = true;
      }
      return result;
    }
  };
}

module.exports = IOTOUtility;
