async function IOTOAddLinkToTDL(tp, tR, settings) {
  if (!tR) return tR;
  const ml = new (tp.user.IOTOMultiLangs(tp))(tp);
  let { taskFolder, targetHeading, tdlDateFormat, followUpAction } = settings;
  const {
    taskSelectorShowOptionOrder,
    taskSelectorShowBasePath,
    taskSelectorFolderOptionTemplate,
  } = tp.app.plugins.plugins["ioto-settings"].settings;

  const activeFile = tp.config.active_file;
  const activeCache = tp.app.metadataCache.getFileCache(activeFile);
  const activeFileFM = activeCache?.frontmatter;
  const doNotAddToTDL = activeFileFM?.doNotAddToTDL;

  if (doNotAddToTDL) return tR;

  const project = activeFileFM?.Project;

  const activeFileName = activeFile.basename;

  const defaultTemplate = ml.t("DefaultTDLTemplate");
  const tdlTemplate = await tp.user.IOTOLoadTemplate(
    tp,
    tR,
    app,
    defaultTemplate,
    false
  );

  let projectPath = "";
  let currentTDL = "";
  let tdlFile = null;
  let isEmptyTaskList = false;

  currentTDL = project + "-" + tp.date.now(tdlDateFormat);

  tdlFile = tp.file.find_tfile(currentTDL);

  const missingTDLFile = !tdlFile;

  if (missingTDLFile) {
    const tldTargetPath =
      projectPath ||
      (await tp.user.IOTOGetFolderOption(tp, {
        folderPath: taskFolder,
        excludesPaths: [`-${project}`],
        showBasePathInOption: taskSelectorShowBasePath,
        optionContentTemplate: taskSelectorFolderOptionTemplate,
        showOptionOrder: taskSelectorShowOptionOrder,
      }));
    if (tldTargetPath) {
      tdlFile = await tp.file.create_new(
        tp.file.find_tfile(tdlTemplate),
        currentTDL,
        false,
        tp.app.vault.getAbstractFileByPath(tldTargetPath)
      );
      await new Promise((r) => setTimeout(r, 100)); //wait for metadata to update, steal from obsidian excalidraw
    } else {
      return tR;
    }
  }

  const tdlContent = await tp.app.vault.read(tdlFile);

  const tdlLines = tdlContent.trim().split("\n");
  const tdlCache = tp.app.metadataCache.getFileCache(tdlFile);

  const headings = tdlCache.headings;
  const tdlFileLinks = tdlCache?.links;
  const tdlFileBlocks = tdlCache?.blocks;
  const tdlFilePureLinks = tdlFileLinks?.map((link) => link.original);
  let tdlItemBlockID = `^tdl-${tp.date.now("YYYYMMDDHHmmss")}`;
  let embedItem = "";

  if (activeFileName !== currentTDL) {
    const isSlection = tR === tp.file.selection();
    const choice =
      followUpAction ||
      (await tp.system.suggester(
        [
          ml.t(isSlection ? "Return selected text" : "Insert link"),
          ml.t("Embed TDL item"),
        ],
        [1, 2]
      ));

    if (!tdlFilePureLinks?.includes(tR)) {
      embedItem = `![[${currentTDL}#${tdlItemBlockID}]]`;
      const targetHeadingSection = headings
        .filter((hs) => hs.heading === targetHeading)
        .first();
      const targetHeadingStartLine = targetHeadingSection.position.start.line;
      const embedTDLItem = 2 === choice ? true : false;
      const targetHeadingSectionIndex = tdlCache.sections.findIndex(
        (element) => element?.position?.start?.line === targetHeadingStartLine
      );
      const targetListSectionEndLine =
        tdlCache.sections[targetHeadingSectionIndex + 1].position.end.line;

      const taskItem = `- [ ] ${tR}${embedTDLItem ? ` ${tdlItemBlockID}` : ""}`;

      tdlLines.splice(targetListSectionEndLine + 1, 0, taskItem);

      isEmptyTaskList =
        tdlLines[tdlLines.length - 1].trim() === "- [ ]" ? true : false;

      await tp.app.vault.modify(
        tdlFile,
        tdlLines.join("\n").concat(isEmptyTaskList ? " " : "")
      );
      await new Promise((r) => setTimeout(r, 100)); //wait for metadata to update, steal from obsidian excalidraw
    } else {
      const targetLinkStartLine = tdlFileLinks.find(
        (link) => link.original === tR
      )?.position.start.line;

      const [targetLinkBlcokId = ""] =
        Object.entries(tdlFileBlocks || {}).find(
          ([_, block]) => block.position.start.line === targetLinkStartLine
        ) || [];

      if (!targetLinkBlcokId) {
        tdlLines[targetLinkStartLine] += tdlItemBlockID;

        isEmptyTaskList =
          tdlLines[tdlLines.length - 1].trim() === "- [ ]" ? true : false;
        await tp.app.vault.modify(
          tdlFile,
          tdlLines.join("\n").concat(isEmptyTaskList ? " " : "")
        );
        await new Promise((r) => setTimeout(r, 100)); //wait for metadata to update, steal from obsidian excalidraw
      }

      embedItem = `![[${currentTDL}#^${
        targetLinkBlcokId || tdlItemBlockID.slice(1)
      }]]`;
    }

    return choice === 2 ? embedItem : tR;
  } else {
    return tR;
  }
}

module.exports = IOTOAddLinkToTDL;
