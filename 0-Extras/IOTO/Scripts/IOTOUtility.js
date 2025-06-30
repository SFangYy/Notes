function IOTOUtility(tp, app) {
  const ml = new (tp.user.IOTOMultiLangs())();
  return class IOTOUtility {
    constructor(tp, app) {
      this.tp = tp;
      this.app = app;
    }
    /**
     * 显示通知或错误信息
     * @param {string} message - 要显示的消息
     * @param {string} prefix - 要在消息前显示的消息
     * @param {string} [type='info'] - 消息类型：'info', 'error', 'warning'
     * @param {number} [duration=2000] - 通知显示时长（毫秒）
     * @param {boolean} [useConsole=false] - 是否同时使用控制台输出
     * @param {boolean} [returnInstance=false] - 是否返回通知实例
     */
    showNotice(
      message,
      prefix = "",
      type = "info",
      duration = 3000,
      useConsole = false,
      returnInstance = false
    ) {
      // 如果需要，同时在控制台输出
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
      // 显示 Obsidian 通知
      if (this.tp && this.tp.obsidian && this.tp.obsidian.Notice) {
        const prefixMessage = prefix && `${prefix}：`;
        const notice = new this.tp.obsidian.Notice(
          prefixMessage + message,
          duration
        );
        return returnInstance ? notice : undefined;
      }
    }

    /**
     * 创建一个带有指定文本内容和颜色的文档片段
     * @param {string} content - 要显示的文本内容
     * @param {string} color - 文本颜色，支持CSS颜色值（如'#ff0000'、'red'等）
     * @returns {DocumentFragment} 返回包含样式化文本的文档片段
     */
    buildFragment(content, color) {
      const fragment = document.createDocumentFragment();
      const div = document.createElement("div");
      div.textContent = content;
      div.style.color = color;
      fragment.appendChild(div);
      return fragment;
    }

    // 将文件名转换为有效的格式（移除特殊字符）
    convertToValidFileName(fileName) {
      return fileName.replace(/[\/|\\:'"()（）{}<>\.\*]/g, "-").trim();
    }

    isObject(value) {
      return Object.prototype.toString.call(value) === "[object Object]";
    }

    // 如果需要，创建指定的文件夹路径
    async createPathIfNeeded(folderPath) {
      const { vault } = this.app;
      const directoryExists = await vault.exists(folderPath);
      if (!directoryExists) {
        await vault.createFolder(this.tp.obsidian.normalizePath(folderPath));
      }
    }

    async getDateChoice() {
      // 默认日期过滤选项
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

      // 允许用户自定义时间单位和数值进行过滤
      // 定义可选的时间单位
      const unitOptions = [
        { label: ml.t("Minutes"), value: "minutes" },
        { label: ml.t("Hours"), value: "hours" },
        { label: ml.t("Days"), value: "days" },
        { label: ml.t("Weeks"), value: "weeks" },
        { label: ml.t("Months"), value: "months" },
      ];

      // 让用户选择是否自定义过滤条件
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
        // 用户选择自定义
        // 选择单位
        const unitChoice = await this.tp.system.suggester(
          unitOptions.map((u) => u.label),
          unitOptions.map((u) => u.value)
        );
        if (!unitChoice) {
          // 用户取消
          return { choice: null, selectedFilter: null };
        }
        // 输入数值
        let value = await this.tp.system.prompt(
          `$${ml.t("PleaseInputValue")}（${ml.t(
            unitOptions.find((u) => u.value === unitChoice).label
          )}）：`,
          ""
        );
        value = parseInt(value, 10);
        if (isNaN(value) || value <= 0) {
          this.showNotice(`$${ml.t("PleaseInputValidValue")}`);
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

    /**
     * 获取当前时间，格式为：YYYY-MM-DD HH00
     * @returns {string} 形如 "2024-06-09 1500" 的字符串
     */
    static getCurrentHourTime() {
      const now = new Date();
      // 使用模板字符串和padStart简化格式化
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(now.getDate()).padStart(2, "0")} ${String(
        now.getHours()
      ).padStart(2, "0")}00`;
    }
  };
}

module.exports = IOTOUtility;
