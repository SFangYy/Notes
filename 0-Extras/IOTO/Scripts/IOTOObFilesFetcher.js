function IOTOObFilesFetcher(tp) {
  const IOTOUtility = tp.user.IOTOUtility(tp, app);
  const ml = new (tp.user.IOTOMultiLangs())();
  return class ObFilesFetcher extends IOTOUtility {
    constructor(tp, app) {
      super(tp, app);
      this.tp = tp;
      this.app = app;
      this.vault = app.vault;
      this.iotoSettings = app.plugins.plugins["ioto-settings"]?.settings;
      this.activeFile = app.workspace.getActiveFile();
      this.folder = this.activeFile.parent.path;
      this.search = app.internalPlugins.getPluginById("global-search").instance;
    }

    /**
     * Gets all markdown files in the vault
     * @returns {Promise<Array<TFile>>} Array of markdown files
     */
    async getAllMarkdownFilesInVault() {
      let files = this.vault.getMarkdownFiles();

      return files;
    }

    /**
     * Gets all subfolders in the current folder
     * @returns {Promise<Array<TFolder>>} Array of folder objects
     */
    async getAllSubFolders() {
      let files = this.activeFile.parent.children;

      return files.filter((file) => file instanceof this.tp.obsidian.TFolder);
    }

    /**
     * Gets all files in the current folder
     * @returns {Promise<Array<TFile>>} Array of file objects
     */
    async getAllFilesInCurrentFolder() {
      let files = this.activeFile.parent.children;

      files = files.filter((file) => file.extension === "md");

      return files;
    }

    /**
     * Gets all files in current folder and its subfolders
     * @param {string} [folder=this.folder] - Target folder path
     * @param {Array<string>} [excludeFolders=[]] - Folders to exclude
     * @returns {Promise<Array<TFile>>} Array of file objects
     */
    async getAllFilesInCurrentFolderAndSubFolder(
      folder = this.folder,
      excludeFolders = []
    ) {
      const currentFolder = folder;

      if (currentFolder === "/") {
        this.showNotice(ml.t("RootFolderNotSupported"));
        return [];
      }

      const allMDFiles = await this.getAllMarkdownFilesInVault();

      let filesInFolder = allMDFiles.filter((file) =>
        file.path.startsWith(currentFolder)
      );

      if (excludeFolders.length > 0) {
        filesInFolder = filesInFolder.filter(
          (file) =>
            !excludeFolders.some((excludeFolder) =>
              file.path.startsWith(excludeFolder + "/")
            )
        );
      }

      return filesInFolder;
    }

    async getFilesWithPropertyAndValue(property, value) {
      let files = await this.getAllMarkdownFilesInVault();
      files = this.filterOutIOTOFiles(files);
      let filesWithPropertyAndValue = files.filter((file) => {
        const frontmatter =
          this.app.metadataCache.getFileCache(file)?.frontmatter;

        if (!frontmatter?.[property]) {
          return false;
        }

        const propertyValue = frontmatter[property];

        return Array.isArray(propertyValue)
          ? propertyValue.includes(value)
          : propertyValue === value;
      });
      return filesWithPropertyAndValue;
    }

    async getFilesWithTag(tag) {
      const searchTag = tag.startsWith("#") ? tag : "#" + tag;

      const files = await this.getAllMarkdownFilesInVault();

      const filesWithTag = [];

      for (const file of files) {
        const cache = this.app.metadataCache.getFileCache(file);

        if (cache) {
          const tags = this.tp.obsidian.getAllTags(cache) || [];

          if (tags.includes(searchTag)) {
            filesWithTag.push(file);
          }
        }
      }

      return filesWithTag;
    }

    async getAllIOOFiles() {
      let files = await this.getAllMarkdownFilesInVault();

      let IOOFolders = [
        this.iotoSettings.inputFolder,
        this.iotoSettings.outputFolder,
        this.iotoSettings.outcomeFolder,
      ];

      files = files.filter((file) =>
        IOOFolders.some((folder) => file.path.startsWith(folder))
      );

      return files;
    }

    async getSearchQueryFromUser() {
      let searchQuery = "";
      const searchLeaf = this.app.workspace.getLeavesOfType("search")[0];

      if (searchLeaf?.view?.searchQuery) {
        searchQuery = searchLeaf.view.searchQuery;
      } else {
        searchQuery = await this.tp.system.prompt(
          ml.t("PleaseInputSearchQuery")
        );
      }
      return searchQuery;
    }

    async searchFilesInVault(query) {
      await this.search.openGlobalSearch(query);

      await new Promise((resolve) => setTimeout(resolve, 500));

      const searchLeaf = this.app.workspace.getLeavesOfType("search")[0];
      if (!searchLeaf) return [];

      const searchView = searchLeaf.view;
      const results = searchView.dom.resultDomLookup;

      const filesArray = [];
      for (const result of results.values()) {
        if (result.file?.extension === "md") {
          filesArray.push(result.file);
        }
      }

      return filesArray;
    }

    async chooseTagFromVault() {
      let files = await this.getAllMarkdownFilesInVault();

      files = this.filterOutIOTOFiles(files);

      const tags = new Set();

      for (const file of files) {
        const cache = this.app.metadataCache.getFileCache(file);
        if (cache?.tags) {
          cache.tags.forEach((tagObj) => tags.add(tagObj.tag.slice(1))); // 去掉 # 符号
        }

        if (cache?.frontmatter?.tags) {
          if (Array.isArray(cache.frontmatter.tags)) {
            cache.frontmatter.tags.forEach((tag) => tags.add(tag));
          } else if (typeof cache.frontmatter.tags === "string") {
            tags.add(cache.frontmatter.tags);
          }
        }
      }

      const tagList = Array.from(tags).sort();

      const tag = await this.tp.system.suggester(
        tagList,
        tagList,
        ml.t("PleaseChooseTagToSync")
      );
      return tag;
    }

    async getValueForSpecificPropertyInVault() {
      let files = await this.getAllMarkdownFilesInVault();

      files = this.filterOutIOTOFiles(files);

      const properties = new Set();

      for (const file of files) {
        const frontmatter =
          this.app.metadataCache.getFileCache(file)?.frontmatter;
        if (frontmatter) {
          Object.keys(frontmatter).forEach((key) => properties.add(key));
        }
      }

      const propertyList = Array.from(properties).sort();

      const property = await this.tp.system.suggester(
        propertyList,
        propertyList,
        ml.t("PleaseChoosePropertyToSync")
      );
      if (!property) {
        this.showNotice(ml.t("NoPropertyChoosed"));
        return;
      }

      const values = new Set();
      for (const file of files) {
        const frontmatter =
          this.app.metadataCache.getFileCache(file)?.frontmatter;
        if (frontmatter && property in frontmatter) {
          if (Array.isArray(frontmatter[property])) {
            frontmatter[property].forEach((val) => values.add(val));
          } else {
            values.add(frontmatter[property]);
          }
        }
      }

      const valueList = Array.from(values).sort();

      const value = await this.tp.system.suggester(
        valueList,
        valueList,
        ml.t("PleaseChoosePropertyValue")
      );

      if (!value) {
        this.showNotice(ml.t("NoPropertyValueChoosed"));
        return;
      }

      return { property: property, value: value };
    }

    filterOutIOTOFiles(files) {
      const IOTOFrameWorkFolder = this.iotoSettings.IOTOFrameworkPath;
      if (!IOTOFrameWorkFolder) {
        return files;
      }
      files = files.filter(
        (file) => !file.path.startsWith(IOTOFrameWorkFolder)
      );

      return files;
    }

    static createFilesFetcher(tp, app) {
      return new ObFilesFetcher(tp, app);
    }
  };
}

module.exports = IOTOObFilesFetcher;
