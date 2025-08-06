/*
 ** Script Name: IOTO Search And Replace
 ** Author: Johnny
 ** Bilibili: https://space.bilibili.com/432408734
 ** Version: 1.9.1
 */

class OBSearchAndReplace {
  constructor(tp, tR, settings = {}) {
    this.tp = tp;
    this.tR = tR;
    this.activeFile = app.workspace.getActiveFile();
    this.folder = this.activeFile.parent.path;
    this.iotoSettings = app.plugins.plugins["ioto-settings"].settings;
    this.settings = Object.assign(
      {
        path: this.iotoSettings.iotoUtilsSnRRulesFolder,
      },
      settings
    );
    this.activeNote = this.tp.user.IOTONoteMaker(this.tp, this.activeFile);
    this.ml = new (tp.user.IOTOMultiLangs(tp))();
  }

  async startFMMaker() {
    const choices = [
      this.ml.t("1. Search and Replace in Active File"),
      this.ml.t("2. Search and Replace in All Files in Current Folder"),
      this.ml.t(
        "3. Search and Replace in All Files in Current Folder and Sub Folders"
      ),
      this.ml.t("4. Search and Replace in Selection"),
    ];

    const options = [1, 2, 3, 4];

    const option = await this.tp.system.suggester(choices, options);

    if (!option) return;

    const { path } = this.settings;

    const selectedFile = await this.tp.user.IOTOGetFileOrLinkFromFolder(
      this.tp,
      path
    );

    if (null === selectedFile) return;

    const selectedRules =
      app.metadataCache.getFileCache(selectedFile)?.frontmatter;

    switch (option) {
      case 1:
        await this.SRInActiveFile(selectedRules);
        break;
      case 2:
        await this.SRInAllFilesInCurrentFolder(selectedRules);
        break;
      case 3:
        await this.SRInAllFilesInCurrentFolderAndSubFolders(selectedRules);
        break;
      case 4:
        await this.SRInSelection(selectedRules);
        break;
      default:
        return;
    }
  }

  async SRInActiveFile(selectedRules) {
    await this.SRInNote(this.activeNote, selectedRules);
  }

  async SRInAllFilesInCurrentFolder(selectedRules) {
    let files = this.getAllFilesInCurrentFolder();
    await this.SRInFiles(files, selectedRules);
  }

  async SRInAllFilesInCurrentFolderAndSubFolders(selectedRules) {
    let files = this.getAllFilesInCurrentFolderAndSubFolder();
    await this.SRInFiles(files, selectedRules);
  }

  async SRInSelection(rules) {
    let content = this.tp.file.selection();

    if (!content) {
      new this.tp.obsidian.Notice(this.ml.t("Please select text first."));
    }

    if (!this.buildSRRules(rules)) return;

    let modifyContent = this.searchAndReplaceInContent(
      content,
      this.buildSRRules(rules)
    );

    this.tR += modifyContent;
  }

  async SRInNote(note, rules) {
    await note.prepareNoteContent();
    let content = note.content;
    if (!this.buildSRRules(rules)) return;

    let modifyContent = this.searchAndReplaceInContent(
      content,
      this.buildSRRules(rules)
    );
    this.tR = "";
    await this.modifyNote(note, modifyContent);
  }

  async SRInFiles(files = [], rules) {
    files.forEach(async (file) => {
      const note = this.tp.user.IOTONoteMaker(this.tp, file);
      await this.SRInNote(note, rules);
    });
  }

  async modifyNote(note, content) {
    await note.prepareNoteFm(note.fmDict);
    await app.vault.modify(note.file, note.fm + "\n" + content);
    await new Promise((r) => setTimeout(r, 100)); //wait for metadata to update, steal from obsidian excalidraw
  }

  searchAndReplaceInContent(content, rules) {
    let { searchRules, replaceRules, ignoreCase, globalReplace, useRegex } =
      rules;
    for (let index = 0; index < searchRules.length; index++) {
      const searchRule = searchRules[index];
      const replaceRule = replaceRules[index] ? replaceRules[index] : "";
      switch (true) {
        case globalReplace && !useRegex:
          content = content.replaceAll(searchRule, replaceRule);
          break;
        case globalReplace && useRegex && ignoreCase:
          content = content.replace(new RegExp(searchRule, "gi"), replaceRule);
          break;
        case globalReplace && useRegex && !ignoreCase:
          content = content.replace(new RegExp(searchRule, "g"), replaceRule);
          break;
        case !globalReplace && useRegex && ignoreCase:
          content = content.replace(new RegExp(searchRule, "i"), replaceRule);
          break;
        case !globalReplace && useRegex && !ignoreCase:
          content = content.replace(new RegExp(searchRule), replaceRule);
          break;
        case !globalReplace && !useRegex:
          content = content.replace(searchRule, replaceRule);
          break;
        default:
          break;
      }
    }

    // Fix Obsisian \n don't make to new line problem.
    content = content.split("\\n").join("\n");

    content = content.split("\\s").join(" ");

    return content;
  }

  buildSRRules(rules) {
    const { ignoreCase, globalReplace, useRegex } = rules;
    const searchRules = [];
    const replaceRules = [];

    const searchPattern = /^search\d+$/i;
    const replacePattern = /^replace\d+$/i;

    Object.keys(rules)
      .sort()
      .forEach((key) => {
        if (searchPattern.test(key)) {
          searchRules.push(rules[key]);
        } else if (replacePattern.test(key)) {
          replaceRules.push(rules[key]);
        }
      });

    if (searchRules.length !== replaceRules.length) {
      new this.tp.obsidian.Notice(
        this.ml.t("Your search and replace rules do not match.")
      );
      return false;
    }

    return { searchRules, replaceRules, ignoreCase, globalReplace, useRegex };
  }

  getAllFilesInCurrentFolder() {
    if (!this.hasActiveFile()) {
      return [];
    }
    return this.activeFile.parent.children.filter(
      (file) => file.extension === "md"
    );
  }

  getAllFilesInCurrentFolderAndSubFolder(folder = this.folder) {
    if (!this.hasActiveFile()) {
      return;
    }
    return app.vault
      .getMarkdownFiles()
      .filter((file) => file.path.startsWith(folder));
  }

  hasActiveFile() {
    if (!this.activeFile) {
      new this.tp.obsidian.Notice(this.ml.t("You must open a note first."));
      return false;
    }
    return true;
  }
}

async function IOTOSearchAndReplace(tp, tR, settings) {
  const IOTOFMMaker = new OBSearchAndReplace(tp, tR, settings);
  await IOTOFMMaker.startFMMaker();
  return IOTOFMMaker.tR ? IOTOFMMaker.tR : "";
}

module.exports = IOTOSearchAndReplace;
