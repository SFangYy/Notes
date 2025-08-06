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
  };
}

module.exports = IOTOUtility;
