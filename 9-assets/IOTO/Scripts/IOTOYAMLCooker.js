function IOTOYAMLCooker() {
  return class YAMLCooker {
    constructor(tp) {
      this.tp = tp;
      this.forceQuotesProperties = ["defaultTemplate"];
    }

    parseFmDict(fm) {
      if (!fm) {
        return {};
      }

      const excludeKeys = [
        "position",
        "Tags",
        "tag",
        "Aliases",
        "Alias",
        "alias",
      ];

      return Object.entries(fm)
        .filter(([key]) => !excludeKeys.includes(key))
        .reduce((fmDict, [key, value]) => {
          const parsedValue = this.tp.obsidian.parseFrontMatterEntry(fm, key);

          if (value instanceof Array) {
            fmDict[key] =
              this.tp.obsidian.parseFrontMatterStringArray(fm, key) || "";
          } else if (this.forceQuotesProperties.includes(key)) {
            fmDict[key] = `"${parsedValue}"` || "";
          } else if (parsedValue === 0) {
            fmDict[key] = parsedValue;
          } else if (
            typeof parsedValue === "string" &&
            parsedValue.includes("\n")
          ) {
            fmDict[key] =
              "|-\n" +
              parsedValue
                .split("\n")
                .map((line) => " " + line)
                .join("\n");
          } else if (typeof parsedValue === "boolean") {
            fmDict[key] = parsedValue;
          } else {
            fmDict[key] = parsedValue || "";
          }

          return fmDict;
        }, {});
    }

    addQuotationInFrontMatter(frontmatter) {
      for (let [key, value] of Object.entries(frontmatter)) {
        if (value instanceof Array) {
          frontmatter[key] = value.map((item) =>
            item !== "" ? `"${item}"` : item
          );
        } else {
          frontmatter[key] = value !== "" ? `"${value}"` : value;
        }
      }
    }

    dumpsFm(fmDict, sort = false) {
      let sortedFmDict = sort ? this.sortFmDict(fmDict) : fmDict;
      let fmText = Object.entries(sortedFmDict)
        .map(([key, value]) => key + ": " + this.makeFmValue(value))
        .join("\n");
      fmText = fmText ? "---\n" + fmText + "\n---\n" : "";
      return fmText;
    }

    sortFmDict(fmDict) {
      const sortedDict = Object.keys(fmDict)
        .sort()
        .reduce((accumulator, key) => {
          accumulator[key] = fmDict[key];
          return accumulator;
        }, {});
      return sortedDict;
    }

    makeFmValue(value) {
      if (value instanceof Array) {
        const newValue = value
          .map((item) => {
            if (typeof item === "object" && item !== null) {
              return "";
            } else {
              return " - " + this.addQuotesForSpecialValue(item);
            }
          })
          .join("\n");
        return value.length ? "\n" + newValue : value;
      } else if (typeof value === "string") {
        return this.addQuotesForSpecialValue(value);
      } else if (typeof value !== "undefined") {
        return value;
      } else {
        return "";
      }
    }

    isNumericString(str) {
      return !isNaN(str) && !isNaN(parseFloat(str));
    }

    addQuotesForSpecialValue(value) {
      if (
        (value.includes(": ") && !value.startsWith("|-")) ||
        value.startsWith("[[") ||
        value.startsWith("#") ||
        this.isNumericString(value)
      ) {
        return `"${value}"`;
      } else {
        return value;
      }
    }
  };
}

module.exports = IOTOYAMLCooker;
