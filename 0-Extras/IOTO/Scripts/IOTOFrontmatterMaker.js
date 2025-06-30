/*
 ** Script Name: IOTO Frontmatter Maker
 ** Author: Johnny
 ** Bilibili: https://space.bilibili.com/432408734
 ** Version: 1.9.1
 */

class OBFrontmatterMaker {
  constructor(tp, settings = {}) {
    this.tp = tp;
    this.activeFile = app.workspace.getActiveFile();
    this.folder = this.activeFile.parent.path;
    this.iotoSettings = app.plugins.plugins["ioto-settings"].settings;
    this.settings = Object.assign(
      {
        path: this.iotoSettings.iotoUtilsPropertyManagementFolder,
      },
      settings
    );
    this.keepOriginalValue = true;
    this.activeNote = this.tp.user.IOTONoteMaker(this.tp, this.activeFile);
    this.ml = new (tp.user.IOTOMultiLangs())();
  }

  async startFMMaker() {
    const choices = [
      this.ml.t("AddFMToCurrentNote"),
      this.ml.t("AddFMToAllNotesInCurrentFolder"),
      this.ml.t("AddFMToAllNotesInCurrentFolderAndSubFolders"),
      this.ml.t("RemoveFMFromCurrentNote"),
      this.ml.t("RemoveFMFromAllNotesInCurrentFolder"),
      this.ml.t("RemoveFMFromAllNotesInCurrentFolderAndSubFolders"),
      this.ml.t("ClearFMFromCurrentNote"),
      this.ml.t("ClearFMFromAllNotesInCurrentFolder"),
      this.ml.t("ClearFMFromAllNotesInCurrentFolderAndSubFolders"),
    ];

    const options = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    const option = await this.tp.system.suggester(
      choices.map((choice, index) => `${index + 1}. ${choice}`),
      options
    );

    if (!option) return;

    const { path } = this.settings;

    if (option < 4) {
      let userChoice = await this.tp.system.suggester(
        [
          this.ml.t("IfFMExistsUseOriginalValue"),
          this.ml.t("IfFMExistsUseTemplateValue"),
        ],
        [0, 1]
      );
      if (userChoice) {
        this.keepOriginalValue = false;
      }
    }

    const selectedFile =
      option < 7
        ? await this.tp.user.IOTOGetFileOrLinkFromFolder(this.tp, path)
        : "";

    if (null === selectedFile) return;

    let selectedFileFM =
      app.metadataCache.getFileCache(selectedFile)?.frontmatter;

    if (selectedFile && selectedFileFM.position) {
      delete selectedFileFM.position;
    }

    switch (option) {
      case 1:
        await this.addFMToActiveFile(selectedFileFM);
        break;
      case 2:
        await this.addFMToAllFilesInCurrentFolder(selectedFileFM);
        break;
      case 3:
        await this.addFMToAllFilesInCurrentFolderAndSubFolders(selectedFileFM);
        break;
      case 4:
        await this.removeFMFromActiveFile(selectedFileFM);
        break;
      case 5:
        await this.removeFMFromAllFilesInCurrentFolder(selectedFileFM);
        break;
      case 6:
        await this.removeFMFromAllFilesInCurrentFolderAndSubFolders(
          selectedFileFM
        );
        break;
      case 7:
        await this.clearFMFromActiveFile();
        break;
      case 8:
        await this.clearFMFromAllFilesInCurrentFolder();
        break;
      case 9:
        await this.clearFMFromAllFilesInCurrentFolderAndSubFolders();
        break;
      default:
        return;
    }
  }

  async addFMToActiveFile(selectedFMTemplate) {
    await this.addFMToNote(this.activeNote, selectedFMTemplate);
  }

  async addFMToAllFilesInCurrentFolder(selectedFMTemplate) {
    let files = this.getAllFilesInCurrentFolder();
    await this.addFMToFiles(files, selectedFMTemplate);
  }

  async addFMToAllFilesInCurrentFolderAndSubFolders(selectedFMTemplate) {
    let files = this.getAllFilesInCurrentFolderAndSubFolder();
    await this.addFMToFiles(files, selectedFMTemplate);
  }

  async removeFMFromActiveFile(selectedFMTemplate) {
    await this.removeFMFromNote(this.activeNote, selectedFMTemplate);
  }

  async removeFMFromAllFilesInCurrentFolder(selectedFMTemplate) {
    let files = this.getAllFilesInCurrentFolder();
    await this.removeFMFromFiles(files, selectedFMTemplate);
  }

  async removeFMFromAllFilesInCurrentFolderAndSubFolders(selectedFMTemplate) {
    let files = this.getAllFilesInCurrentFolderAndSubFolder();
    await this.removeFMFromFiles(files, selectedFMTemplate);
  }

  async clearFMFromActiveFile() {
    await this.clearNoteFM(this.activeNote);
  }

  async clearFMFromAllFilesInCurrentFolder() {
    let files = this.getAllFilesInCurrentFolder();
    await this.clearFilesFM(files);
  }

  async clearFMFromAllFilesInCurrentFolderAndSubFolders() {
    let files = this.getAllFilesInCurrentFolderAndSubFolder();
    await this.clearFilesFM(files);
  }

  async addFMToNote(note, fmTemplate) {
    let tempFMDict = this.keepOriginalValue
      ? Object.assign(fmTemplate, note.fmDict)
      : Object.assign(note.fmDict, fmTemplate);
    await this.modifyNoteFM(note, tempFMDict);
  }

  async addFMToFiles(files = [], fmTemplate) {
    files.forEach(async (file) => {
      const note = this.tp.user.IOTONoteMaker(this.tp, file);
      await this.addFMToNote(note, fmTemplate);
    });
  }

  async removeFMFromNote(note, fmTemplate) {
    let tempFMDict = Object.assign(
      {},
      ...Object.keys(note.fmDict)
        .filter((key) => Object.keys(fmTemplate).indexOf(key) < 0)
        .map((key) => ({ [key]: note.fmDict[key] }))
    );
    await this.modifyNoteFM(note, tempFMDict);
  }

  async removeFMFromFiles(files = [], fmTemplate) {
    files.forEach(async (file) => {
      const note = this.tp.user.IOTONoteMaker(this.tp, file);
      let tempFMDict = Object.assign(
        {},
        ...Object.keys(note.fmDict)
          .filter((key) => Object.keys(fmTemplate).indexOf(key) < 0)
          .map((key) => ({ [key]: note.fmDict[key] }))
      );
      await this.modifyNoteFM(note, tempFMDict);
    });
  }

  async clearNoteFM(note) {
    await note.prepareNoteContent();
    await app.vault.modify(note.file, note.content);
    await new Promise((r) => setTimeout(r, 100)); //wait for metadata to update, steal from obsidian excalidraw
  }

  async clearFilesFM(filess = []) {
    filess.forEach(async (file) => {
      const note = this.tp.user.IOTONoteMaker(this.tp, file);
      await this.clearNoteFM(note);
    });
  }

  async modifyNoteFM(note, fmDict) {
    await note.prepareNoteFm(fmDict);
    await note.prepareNoteContent();
    await app.vault.modify(note.file, note.fm + "\n" + note.content);
    await new Promise((r) => setTimeout(r, 100)); //wait for metadata to update, steal from obsidian excalidraw
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
      return [];
    }
    return app.vault
      .getMarkdownFiles()
      .filter((file) => file.path.startsWith(folder));
  }

  hasActiveFile() {
    if (!this.activeFile) {
      new this.tp.obsidian.Notice(this.ml.t("YouMustOpenNoteFirst"));
      return false;
    }
    return true;
  }
}

async function IOTOFrontmatterMaker(tp, settings) {
  const IOTOFMMaker = new OBFrontmatterMaker(tp, settings);
  await IOTOFMMaker.startFMMaker();
}

module.exports = IOTOFrontmatterMaker;
