function IOTOObNoteMaker() {
  return class OBNote {
    constructor(tp, app, file, noteSettings, recordFieldsNames = {}) {
      this.tp = tp;
      this.app = app;
      this.dv = app.plugins.plugins.dataview?.api;
      this.file = file;
      this.title = file.basename;
      this.path = file.path;
      this.dvPage = this.dv?.page(file.path) || null;
      this.content = "";
      this.folder = file.parent.path;
      this.vault = file.vault.getName();
      this.frontmatter = app.metadataCache.getFileCache(file)?.frontmatter;
      this.frontmatterPosition =
        app.metadataCache.getFileCache(file)?.frontmatterPosition;
      this.noteRecordID = "";
      let ctime = moment(new Date(file.stat.ctime));
      let mtime = moment(new Date(file.stat.mtime));
      this.createTime = ctime.format("YYYY-MM-DD HH:mm");
      this.updateTime = mtime.format("YYYY-MM-DD HH:mm");
      this.cache = app.metadataCache.getFileCache(file);
      this.aliases =
        tp.obsidian.parseFrontMatterAliases(this.frontmatter) || [];
      this.tags = this.cache ? tp.obsidian.getAllTags(this.cache) || [] : [];
      this.tags = this.tags.map((tag) => tag.replace("#", ""));
      this.tags = Array.from(new Set(this.tags));
      this.obsidianURI = `obsidian://open?vault=${encodeURIComponent(
        this.vault
      )}&file=${encodeURIComponent(file.path)}`;
      let YAMLCooker = tp.user.IOTOYAMLCooker();
      this.yamlCooker = new YAMLCooker(tp);
      this.outlinks = this.getOutlinks();

      this.noteSettings = noteSettings;
      this.recordFieldsNames = recordFieldsNames;
    }

    getNocodbRecordID() {
      if (
        this.frontmatter &&
        this.noteSettings.recordIdNameInNote in this.frontmatter
      ) {
        return this.frontmatter[this.noteSettings.recordIdNameInNote];
      } else {
        return false;
      }
    }

    async prepareNoteFm(fmDict, sort = false) {
      this.fm = this.yamlCooker.dumpsFm(fmDict, sort);
    }

    async prepareNoteContent() {
      let noteContent = await this.app.vault.read(this.file);
      this.fullContent = noteContent;
      this.content = this.removeFrontMatterFromContent(
        this.removeAppendedContent(this.fullContent)
      );
    }

    async prepareNoteSyncData(
      update = false,
      syncContent = true,
      syncFullContent = false,
      maxContentLength = 99999
    ) {
      await this.prepareNoteContent();

      const baseFields = {
        [this.recordFieldsNames.title]: this.title,
        [this.recordFieldsNames.path]: this.folder,
        [this.recordFieldsNames.tags]: this.tags,
        [this.recordFieldsNames.aliases]: this.aliases,
        [this.recordFieldsNames.vault]: this.vault,
        [this.recordFieldsNames.obsidianURI]: this.obsidianURI,
        [this.recordFieldsNames.createdTime]: this.noteSettings.useDate
          ? new Date(this.createTime).getTime()
          : this.createTime,
        [this.recordFieldsNames.updatedTime]: this.noteSettings.useDate
          ? new Date(this.updateTime).getTime()
          : this.updateTime,
      };

      if (syncContent) {
        if (this.content.length >= maxContentLength) {
          baseFields[this.recordFieldsNames.content] = this.content.slice(
            0,
            maxContentLength
          );
          baseFields[this.recordFieldsNames.extraContent] =
            this.content.slice(maxContentLength);
        } else {
          baseFields[this.recordFieldsNames.content] = this.content;
        }
      }

      if (syncFullContent) {
        if (this.fullContent.length >= maxContentLength) {
          baseFields[this.recordFieldsNames.fullContent] =
            this.fullContent.slice(0, maxContentLength);
          baseFields[this.recordFieldsNames.extraFullContent] =
            this.fullContent.slice(maxContentLength);
        } else {
          baseFields[this.recordFieldsNames.fullContent] = this.fullContent;
        }
      }

      this.syncData = { fields: baseFields };

      if (update) {
        const recordId =
          this.noteRecordID ||
          this.frontmatter[this.noteSettings.recordIdNameInNote];
        if (recordId) {
          this.syncData[this.noteSettings.recordIdName] = recordId;
        }
      }
    }

    async addCustomSyncFields(customFields) {
      if (!customFields) {
        return;
      }

      const processedFields = Object.keys(customFields).reduce((acc, key) => {
        const isTimeStamp =
          String(customFields[key]).toLowerCase() === "timestamp";
        let fieldValue;

        if (this.frontmatter?.hasOwnProperty(key)) {
          fieldValue = this.frontmatter[key];
          acc[key] = isTimeStamp ? new Date(fieldValue).getTime() : fieldValue;
        } else if (this.dvPage?.hasOwnProperty(key)) {
          fieldValue = this.dvPage[key];
          acc[key] = Array.isArray(fieldValue)
            ? fieldValue.filter(Boolean).map(String)
            : fieldValue;
        } else {
          acc[key] = isTimeStamp ? Date.now() : customFields[key];
        }
        return acc;
      }, {});

      this.syncData.fields = {
        ...this.syncData.fields,
        ...processedFields,
      };
    }

    async addExtractTagLinesFields(
      extractTagLinesFields,
      extractTagLinesAsText
    ) {
      if (!extractTagLinesFields) return;
      const contentLines = this.content.split("\n");
      const extractLinesHasTag = (lines, tag) => {
        return lines
          .filter((line) => line.includes(`#${tag}`))
          .map((line) => line.replace(/#[\p{L}\p{N}_\-\/]+/gu, "").trim());
      };

      for (const [key, value] of Object.entries(extractTagLinesFields)) {
        if (value) {
          let currentFieldValue = this.syncData.fields[value] || [];
          const extracted = extractLinesHasTag(contentLines, key);
          const merged = [...currentFieldValue, ...extracted].filter(Boolean);
          if (extractTagLinesAsText) {
            this.syncData.fields[value] = merged.length
              ? merged.join("\n\n")
              : "";
          } else {
            this.syncData.fields[value] = merged;
          }
        }
      }
    }

    async addExtractKeyPointsFields(
      extractKeyPointsFields,
      extractKeyPointsAsText
    ) {
      if (!extractKeyPointsFields) return;

      const regexPatterns = {
        highlights: /\=\=([^\=]+)\=\=/g,
        italics: /(?<![*_])(?:\*([^*\n]+)\*|_([^_\n]+)_)(?![*_])/g,
        strongs: /\*\*([^\*]+)\*\*/g,
        underlines: /<u>(.*?)<\/u>/gs,
        bold: /(?<!\*)\*\*([^\*]+)\*\*(?!\*)/g,
        bolds: /(?<!\*)\*\*([^\*]+)\*\*(?!\*)/g,
        boldItalics: /(?<!\*)\*\*\*([^\*]+)\*\*\*(?!\*)/g,
        singleQuotes: /\n\n^\> ([^>\n]+)$\n\n/gm,
        inlineCodes: /`(.*?)`/g,
        deletions: /~~(.*?)~~/g,
        links: /\[[^\]]+\]\([^)]+\)/g,
        urls: /https?:\/\/[^\s\)]+/g,
      };

      const extractText = (pattern) => {
        const matches = [];
        let match;

        while ((match = pattern.exec(this.content))) {
          matches.push(match[1] || match[2] || match[0]);
        }
        return matches;
      };

      const matchTexts = Object.fromEntries(
        Object.entries(regexPatterns).flatMap(([key, pattern]) => [
          [key, extractText(pattern)],
          [key.slice(0, -1), extractText(pattern)],
        ])
      );

      for (const [key, value] of Object.entries(extractKeyPointsFields)) {
        if (value) {
          let currentFieldValue = this.syncData.fields[value] || [];

          const extracted = matchTexts[key] || [];
          const merged = [...currentFieldValue, ...extracted].filter(Boolean);
          if (extractKeyPointsAsText) {
            this.syncData.fields[value] = merged.length
              ? merged.join("\n\n")
              : "";
          } else {
            this.syncData.fields[value] = merged;
          }
        }
      }
    }

    async addExtractBlocksFields(extractBlocksFields, extractBlocksAsText) {
      if (!extractBlocksFields) return;
      const metadata = this.cache;
      const content = this.fullContent;
      const blocks = metadata?.blocks || {};

      const extractBlockContent = (blocks, keyword) => {
        const filteredBlocks = Object.fromEntries(
          Object.entries(blocks).filter(([key]) =>
            key.toLowerCase().startsWith(keyword)
          )
        );

        const blockContent = Object.fromEntries(
          Object.entries(filteredBlocks).map(([key, value]) => {
            let linebreakWithBlockID = `\n^${key}`;
            let spaceWithBlockID = ` ^${key}`;
            let newContent = content
              .slice(value.position.start.offset, value.position.end.offset)
              .replace(linebreakWithBlockID, "")
              .replace(spaceWithBlockID, "")
              .concat(!extractBlocksAsText ? linebreakWithBlockID : "");
            return [key, newContent];
          })
        );

        return blockContent;
      };

      for (const [key, value] of Object.entries(extractBlocksFields)) {
        if (value) {
          let currentFieldValue = this.syncData.fields[value] || [];
          const extracted = Object.values(extractBlockContent(blocks, key));
          const merged = [...currentFieldValue, ...extracted].filter(Boolean);
          if (extractBlocksAsText) {
            this.syncData.fields[value] = merged.length
              ? merged.join("\n\n")
              : "";
          } else {
            this.syncData.fields[value] = merged;
          }
        }
      }
    }

    async addExtractSectionFields(
      extractSectionFields,
      extractSectionAsText,
      sectionHeadingWholeMatch = false
    ) {
      if (!extractSectionFields) return;
      const contentLines = this.content.split("\n");

      const extractSectionContent = (lines, headingText) => {
        let sections = [];
        let currentSection = null;
        let targetHeadingLevel = 0;

        for (const line of lines) {
          const headingMatch = line.match(/^(#+)\s*(.*)/);
          if (headingMatch) {
            const currentLevel = headingMatch[1].length;
            const currentText = headingMatch[2].trim();

            if (
              sectionHeadingWholeMatch
                ? currentText === headingText
                : currentText.includes(headingText)
            ) {
              if (currentSection) {
                sections.push(currentSection);
              }

              currentSection = {
                heading: line,
                content: [],
                level: currentLevel,
              };
              targetHeadingLevel = currentLevel;
            } else if (currentSection) {
              if (currentLevel <= targetHeadingLevel) {
                sections.push(currentSection);
                currentSection = null;
              } else {
                currentSection.content.push(line);
              }
            }
          } else if (currentSection) {
            currentSection.content.push(line);
          }
        }

        if (currentSection) {
          sections.push(currentSection);
        }

        const combinedContent = sections.map((section) =>
          [section.heading, section.content.join("\n").trim()].join("\n")
        );

        return combinedContent;
      };

      for (const [key, value] of Object.entries(extractSectionFields)) {
        if (value) {
          let currentFieldValue = this.syncData.fields[value] || [];
          const extracted = extractSectionContent(contentLines, key);
          const merged = [...currentFieldValue, ...extracted].filter(Boolean);
          if (extractSectionAsText) {
            this.syncData.fields[value] = merged.length
              ? merged.join("\n\n")
              : "";
          } else {
            this.syncData.fields[value] = merged;
          }
        }
      }
    }

    removeFrontMatterFromContent(content) {
      let docArray = content.split("\n");
      const lastLineContent = docArray.at(-1);
      const lastLineEndWithSpace = lastLineContent.endsWith(" ");
      const lastSpace = lastLineEndWithSpace ? " " : "";
      const startLine = this.frontmatterPosition?.end.line + 1 || 0;
      return docArray.slice(startLine).join("\n").trim() + lastSpace;
    }

    removeAppendedContent(content) {
      let docArray = content.split("\n");
      let appendedContentStartLine = docArray.indexOf(
        this.tp.IOTOConfigText.appendedContent
      );
      if (appendedContentStartLine > 0) {
        docArray = docArray.slice(0, appendedContentStartLine);
      }
      return docArray.join("\n");
    }

    getOutlinks() {
      const fileCache = this.cache;

      if (!fileCache || (!fileCache.links && !fileCache.embeds)) {
        return [];
      }

      const links = fileCache.links || [];
      const embeds = fileCache.embeds || [];

      const allOutLinks = links.concat(embeds);

      const linkedFiles = allOutLinks
        .map((outlink) => {
          let link = outlink.link.split("#")[0];

          const targetFile = this.app.metadataCache.getFirstLinkpathDest(
            link,
            this.file.path
          );
          return targetFile;
        })
        .filter((file) => file !== null);

      return linkedFiles;
    }
  };
}

module.exports = IOTOObNoteMaker;
