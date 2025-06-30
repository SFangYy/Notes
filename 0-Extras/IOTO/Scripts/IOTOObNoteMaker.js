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

      let basicURL = `obsidian://open?vault=${this.vault}&file=${file.path}`;
      this.obsidianURI = encodeURI(basicURL);
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

      // 构建基础字段数据
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

      // 根据同步设置和内容长度处理内容字段
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

      // 根据同步设置和内容长度处理内容字段
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

      // 构建同步数据对象
      this.syncData = { fields: baseFields };

      // 如果是更新操作,添加记录ID
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
      // 如果没有自定义字段则直接返回
      if (!customFields) {
        return;
      }

      // 使用 reduce 方法处理自定义字段
      const processedFields = Object.keys(customFields).reduce((acc, key) => {
        // 优先从 frontmatter 中获取值
        if (this.frontmatter?.hasOwnProperty(key)) {
          acc[key] = this.frontmatter[key];
        }
        // 其次从 dvPage 中获取值
        else if (this.dvPage?.hasOwnProperty(key)) {
          const value = this.dvPage[key];
          // 处理数组类型的值
          acc[key] = Array.isArray(value)
            ? value.filter(Boolean).map(String)
            : value;
        } else {
          // 最后使用默认值
          acc[key] = customFields[key];
        }
        return acc;
      }, {});

      // 合并处理后的字段到同步数据中
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
        // 返回包含指定 tag 的所有行，而不仅仅是以 tag 开头的行
        // 先筛选包含指定标签的行，再移除行中所有标签
        return lines
          .filter((line) => line.includes(`#${tag}`))
          .map((line) => line.replace(/#[\p{L}\p{N}_\-\/]+/gu, "").trim());
      };

      // 将提取的内容添加到syncData中
      for (const [key, value] of Object.entries(extractTagLinesFields)) {
        if (value) {
          // 获取当前字段的值,如果不存在则初始化为空数组
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
      // 如果没有提供提取关键点字段的配置,直接返回
      if (!extractKeyPointsFields) return;

      // 定义正则表达式模式,用于匹配不同类型的Markdown语法
      const regexPatterns = {
        highlights: /\=\=([^\=]+)\=\=/g, // 高亮语法 ==text==
        italics: /(?<![*_])(?:\*([^*\n]+)\*|_([^_\n]+)_)(?![*_])/g, // 斜体语法 *text* 或 _text_
        strongs: /\*\*([^\*]+)\*\*/g, // 粗体语法 **text**
        underlines: /<u>(.*?)<\/u>/gs, // 下划线语法 <u>text</u>
        bold: /(?<!\*)\*\*([^\*]+)\*\*(?!\*)/g, // 粗体语法 **text**
        bolds: /(?<!\*)\*\*([^\*]+)\*\*(?!\*)/g, // 粗体语法 **text**
        boldItalics: /(?<!\*)\*\*\*([^\*]+)\*\*\*(?!\*)/g, // 粗体斜体语法 ***text***
        singleQuotes: /\n\n^\> ([^>\n]+)$\n\n/gm, // 引用语法 > text
        inlineCodes: /`(.*?)`/g, // 行内代码语法 `text`
        deletions: /~~(.*?)~~/g, // 删除线语法 ~~text~~
        links: /\[[^\]]+\]\([^)]+\)/g, // 链接语法 [text](url)
        urls: /https?:\/\/[^\s\)]+/g, // 网址
      };

      // 辅助函数:根据正则模式提取匹配的文本内容
      const extractText = (pattern) => {
        const matches = [];
        let match;
        // 循环匹配所有符合模式的文本
        while ((match = pattern.exec(this.content))) {
          matches.push(match[1] || match[2] || match[0]); // 获取捕获组或完整匹配
        }
        return matches;
      };

      // 处理所有正则模式并生成匹配结果对象
      // 为每个模式创建两个键:原始键名和去掉's'的单数形式键名
      const matchTexts = Object.fromEntries(
        Object.entries(regexPatterns).flatMap(([key, pattern]) => [
          [key, extractText(pattern)],
          [key.slice(0, -1), extractText(pattern)],
        ])
      );

      // 将提取的内容添加到syncData中
      // 遍历提取关键点字段的配置
      for (const [key, value] of Object.entries(extractKeyPointsFields)) {
        // 如果配置了目标字段
        if (value) {
          // 获取当前字段的值,如果不存在则初始化为空数组
          let currentFieldValue = this.syncData.fields[value] || [];
          // 优化：避免重复 concat 操作，提升可读性和健壮性
          const extracted = matchTexts[key] || [];
          const merged = [...currentFieldValue, ...extracted].filter(Boolean);
          if (extractKeyPointsAsText) {
            // 合并已有内容和新提取内容，去除空字符串，最后用换行拼接
            this.syncData.fields[value] = merged.length
              ? merged.join("\n\n")
              : "";
          } else {
            // 合并为数组，去除空字符串
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

      // 定义一个通用函数来处理区块提取和内容映射
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

      // 将提取的内容添加到syncData中
      for (const [key, value] of Object.entries(extractBlocksFields)) {
        if (value) {
          // 获取当前字段的值,如果不存在则初始化为空数组
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
          // 检测标题行
          const headingMatch = line.match(/^(#+)\s*(.*)/);
          if (headingMatch) {
            const currentLevel = headingMatch[1].length;
            const currentText = headingMatch[2].trim();

            if (
              sectionHeadingWholeMatch
                ? currentText === headingText
                : currentText.includes(headingText)
            ) {
              // 找到目标标题
              if (currentSection) {
                // 保存前一个section
                sections.push(currentSection);
              }
              // 开始新的section
              currentSection = {
                heading: line,
                content: [],
                level: currentLevel,
              };
              targetHeadingLevel = currentLevel;
            } else if (currentSection) {
              if (currentLevel <= targetHeadingLevel) {
                // 遇到同级或更高级别的标题，表示当前section结束
                sections.push(currentSection);
                currentSection = null;
              } else {
                // 当前section中的子标题内容
                currentSection.content.push(line);
              }
            }
          } else if (currentSection) {
            // 当前section的普通内容
            currentSection.content.push(line);
          }
        }

        // 添加最后一个section
        if (currentSection) {
          sections.push(currentSection);
        }

        // 将所有匹配的section内容合并
        const combinedContent = sections.map((section) =>
          [section.heading, section.content.join("\n").trim()].join("\n")
        );

        return combinedContent;
      };

      // 将提取的内容添加到syncData中
      for (const [key, value] of Object.entries(extractSectionFields)) {
        if (value) {
          // 获取当前字段的值,如果不存在则初始化为空数组
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
      // 获取当前文件的缓存
      const fileCache = this.cache;

      if (!fileCache || (!fileCache.links && !fileCache.embeds)) {
        return [];
      }

      // 从缓存中提取所有出链
      const links = fileCache.links || [];
      const embeds = fileCache.embeds || [];

      const allOutLinks = links.concat(embeds);

      // 获取所有链接的目标文件
      const linkedFiles = allOutLinks
        .map((outlink) => {
          // 处理embeds中的Link
          let link = outlink.link.split("#")[0];
          // 尝试解析链接获取目标文件
          const targetFile = this.app.metadataCache.getFirstLinkpathDest(
            link,
            this.file.path
          );
          return targetFile;
        })
        .filter((file) => file !== null); // 过滤掉无效链接

      return linkedFiles;
    }
  };
}

module.exports = IOTOObNoteMaker;
