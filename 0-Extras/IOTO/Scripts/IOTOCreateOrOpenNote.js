/*
 ** Script Name: Create Or Open Note
 ** Author: Johnny
 ** Bilibili: https://space.bilibili.com/432408734
 ** Version: 1.9.0
 */
const isObsidianThemeDark = () =>
  document.body.classList.contains("theme-dark");

async function IOTOCreateOrOpenNote(tp, tR, folderPath, settings) {
  let {
    template,
    defaultNewNoteFollowUpAction,
    noteNamePrefix,
    noteNamePostfix,
    assignedNoteName,
    defaultExcalidrawTemplate,
    fleetingNotePrefix,
    fleetingNoteDateFormat,
  } = settings;

  const ml = new (tp.user.IOTOMultiLangs())();

  let noteName = undefined;
  let note = undefined;
  let fleetingNotePrefixSetting = fleetingNotePrefix
    ? fleetingNotePrefix
    : ml.t("FleetingNote");
  let fleetingNoteDateFormatSetting = fleetingNoteDateFormat
    ? fleetingNoteDateFormat
    : "YYYY-MM-DD";

  if (!folderPath) {
    return assignedNoteName ? assignedNoteName : "";
  }

  const pathExist = await app.vault.exists(folderPath);
  if (!pathExist) {
    new tp.obsidian.Notice(ml.t("FolderPathNotExist", { folderPath }));
    return;
  }

  const templateNote = tp.file.find_tfile(template);

  if (!templateNote) {
    new tp.obsidian.Notice(ml.t("TemplateNotExist", { template }));
    return "";
  }

  const noteType = folderPath.split("/").last().split("-").last();
  const isInDrawingFolder = folderPath.toLowerCase().includes("draw");
  const isInCanvasFolder = folderPath.toLowerCase().includes("canvas");

  if (
    isInDrawingFolder &&
    !app.plugins.enabledPlugins.has("obsidian-excalidraw-plugin")
  ) {
    new tp.obsidian.Notice(ml.t("ExcalidrawPluginNotInstalled"));
    return "";
  }

  let openOrLink = undefined;

  if (
    isNaN(defaultNewNoteFollowUpAction) ||
    0 == defaultNewNoteFollowUpAction ||
    defaultNewNoteFollowUpAction > 4
  ) {
    openOrLink = await tp.system.suggester(
      [
        ml.t("InsertLinkAfterCreate"),
        ml.t("OpenNoteAfterCreate"),
        ml.t("InsertLinkAndOpenNoteAfterCreate"),
        ml.t("DoNotInsertLinkAndDoNotOpenNoteAfterCreate"),
      ],
      [1, 2, 3, 4]
    );
  } else {
    openOrLink = defaultNewNoteFollowUpAction;
  }

  if (!openOrLink) {
    return (tR += assignedNoteName ? assignedNoteName : "");
  }

  if (folderPath.includes(fleetingNotePrefixSetting)) {
    noteName =
      fleetingNotePrefixSetting +
      "-" +
      tp.date.now(fleetingNoteDateFormatSetting);
  } else {
    noteName =
      (noteNamePrefix ? noteNamePrefix : "") +
      (assignedNoteName
        ? assignedNoteName
        : await tp.system.prompt(ml.t("PleaseInputNoteName", { noteType }))) +
      (noteNamePostfix ? noteNamePostfix : "");
  }

  if ("null" === noteName) {
    return "";
  }

  if (isInDrawingFolder) {
    noteName += "";
  }

  if (isInCanvasFolder) {
    noteName += ".canvas";
  }

  const notePath = folderPath + "/" + noteName;

  const file = tp.file.find_tfile(notePath);

  if (file) {
    note = file;
  } else if (isInDrawingFolder) {
    if (defaultExcalidrawTemplate) {
      const defaultExcalidrawTemplateNote = tp.file.find_tfile(
        defaultExcalidrawTemplate
      );
      if (!defaultExcalidrawTemplateNote) {
        new tp.obsidian.Notice(
          ml.t("ExcalidrawTemplateNotExist", {
            defaultExcalidrawTemplate,
          })
        );
        return "";
      } else {
        note = await tp.file.create_new(
          tp.file.find_tfile(defaultExcalidrawTemplate),
          noteName,
          false,
          app.vault.getAbstractFileByPath(folderPath)
        );
      }
    } else {
      note = await app.vault.create(
        notePath + ".md",
        getExcalidrawDefaultContent()
      );
    }
  } else if (isInCanvasFolder) {
    note = await app.vault.create(notePath, "{}");
  } else {
    note = await tp.file.create_new(
      tp.file.find_tfile(template),
      noteName,
      false,
      app.vault.getAbstractFileByPath(folderPath)
    );
  }

  const link = app.metadataCache.fileToLinktext(note, app.vault.getName());

  switch (openOrLink) {
    case 1:
      tR += `[[${link}]]`;
      break;
    case 2:
      app.workspace.openLinkText(note.path, "/", true);
      break;
    case 3:
      tR += `[[${link}]]`;
      app.workspace.openLinkText(note.path, "/", true);
      break;
    case 4:
      break;
    default:
      tR += assignedNoteName ? assignedNoteName : "";
      break;
  }
  return tR;
}

function getExcalidrawDefaultContent() {
  const Excalidraw = app.plugins.plugins["obsidian-excalidraw-plugin"];
  const GITHUB_RELEASES =
    "https://github.com/zsviczian/obsidian-excalidraw-plugin/releases/tag/";
  const PLUGIN_VERSION = Excalidraw.manifest.version;
  const FRONTMATTER_KEY = "excalidraw-plugin";
  const BLANK_DRAWING = `{"type":"excalidraw","version":2,"source":"${
    GITHUB_RELEASES + PLUGIN_VERSION
  }","elements":[],"appState":{"gridSize":null,"viewBackgroundColor":"#ffffff"}}`;
  const DARK_BLANK_DRAWING = `{"type":"excalidraw","version":2,"source":"${
    GITHUB_RELEASES + PLUGIN_VERSION
  }","elements":[],"appState":{"theme":"dark","gridSize":null,"viewBackgroundColor":"#ffffff"}}`;

  const FRONTMATTER = [
    "---",
    "",
    `${FRONTMATTER_KEY}: parsed`,
    "tags: [excalidraw]",
    "",
    "---",
    "",
  ].join("\n");

  const blank =
    Excalidraw.settings.matchTheme && isObsidianThemeDark()
      ? DARK_BLANK_DRAWING
      : BLANK_DRAWING;
  return `${FRONTMATTER}\n# Drawing\n\x60\x60\x60json\n${blank}\n\x60\x60\x60\n%%`;
}

module.exports = IOTOCreateOrOpenNote;
