/*
 ** Script Name: Get Sub Folders Option
 ** Author: Johnny
 ** Bilibili: https://space.bilibili.com/432408734
 ** Version: 1.1.0
 */

async function IOTOGetSubFolders(
  tp,
  parentFolder,
  excludesPaths,
  includeParent = false
) {
  let allSubFolders = [];
  const ml = new (tp.user.IOTOMultiLangs())();

  tp.obsidian.Vault.recurseChildren(parentFolder, (child) => {
    if (
      child instanceof tp.obsidian.TFolder &&
      child.path !== parentFolder.path
    ) {
      allSubFolders.push(child);
    }
  });

  allSubFolders = allSubFolders
    .sort((a, b) => a.path.localeCompare(b.path))
    .filter((f) =>
      excludesPaths.every((e) => {
        return e.startsWith("-")
          ? f.path.includes(e.slice(1))
          : !f.path.includes(e);
      })
    );

  if (includeParent) {
    allSubFolders.unshift(parentFolder);
  }

  return allSubFolders;
}

const countSlashes = (str) => {
  const matches = str.match(/\//g);
  return matches ? matches.length : 0;
};

async function createPathIfNeeded(tp, folderPath, subFolders = []) {
  const { vault } = tp.app;
  const directoryExists = await vault.exists(folderPath);
  if (!directoryExists) {
    await vault.createFolder(tp.obsidian.normalizePath(folderPath));
    if (
      subFolders.length &&
      subFolders.every((folder) => folder.trim().length)
    ) {
      for (let index = 0; index < subFolders.length; index++) {
        const folder = subFolders[index];
        await vault.createFolder(
          tp.obsidian.normalizePath(folderPath + "/" + folder)
        );
      }
    }
  }
}

async function IOTOGetFolderOption(tp, settings) {
  let {
    folderPath,
    excludesPaths,
    showBasePathInOption,
    optionContentTemplate,
    showOptionOrder,
    isOutcomeSelector,
    taskFolder,
    includeParentFolder,
    outcomeProjectDefaultSubFolders,
  } = settings;

  const iotoTaskFolder =
    tp.app.plugins.plugins["ioto-settings"].settings.taskFolder;

  const activeFile = tp.config.active_file;
  const currentFolder = activeFile.parent.name;
  const currentParentPath = activeFile.parent.path;
  const project =
    app.metadataCache.getFileCache(activeFile)?.frontmatter?.Project;
  const targetIsInTaskFolder = folderPath.startsWith(iotoTaskFolder);

  // Check required parameters
  if (!folderPath || !(await app.vault.exists(folderPath))) {
    new tp.obsidian.Notice(
      !folderPath
        ? ml.t("NoFolderPath")
        : ml.t("FolderPathNotExist", { folderPath })
    );
    return;
  }

  // Set and validate option template
  optionContentTemplate = optionContentTemplate || ml.t("CreateNoteInFolder");
  if (!optionContentTemplate.includes("{{folder}}")) {
    new tp.obsidian.Notice(ml.t("OptionTemplateMustIncludeFolder"));
    return;
  }

  // If it is an outcome selector
  if (isOutcomeSelector) {
    // Get the project name from the current path
    const projectPath = currentParentPath.split("/")[1];
    // Determine if the current path is a task or outcome folder
    const isTaskOrOutcomeFolder =
      (currentParentPath.startsWith(taskFolder) ||
        currentParentPath.startsWith(folderPath)) &&
      currentParentPath !== taskFolder;
    // Determine if there is a valid project
    const hasValidProject =
      project &&
      project.length &&
      (await app.vault.exists(folderPath + "/" + project));

    // Set folder path based on conditions
    if (isTaskOrOutcomeFolder) {
      folderPath = `${folderPath}/${projectPath}`;
    } else if (hasValidProject) {
      folderPath = `${folderPath}/${project}`;
    }

    // Create folder and its subfolders if needed
    await createPathIfNeeded(tp, folderPath, outcomeProjectDefaultSubFolders);
  }

  // Get parent folder
  const parentFolder = app.vault.getAbstractFileByPath(folderPath);

  // Get all subfolders
  const allSubFolders = await IOTOGetSubFolders(
    tp,
    parentFolder,
    excludesPaths,
    includeParentFolder
  );

  // Filter out the current folder and other folders
  let filteredSubFolders = allSubFolders.filter(
    (f) => f.name !== currentFolder
  );
  let targetFolder = allSubFolders.filter((f) => f.name === currentFolder);

  // Resort folders, put the current folder at the top
  const resortedSubFolders = targetIsInTaskFolder
    ? [...targetFolder, ...filteredSubFolders]
    : allSubFolders;

  // Generate option list
  const choices = resortedSubFolders.map((p, index) => {
    // Count the number of slashes in the path for indentation
    const slashInPath = countSlashes(p.path);
    // Whether to show the order number
    const optionOrder = showOptionOrder ? `${index + 1}. ` : "";
    // Calculate indentation length
    const tabLength =
      includeParentFolder && countSlashes(folderPath) === 0
        ? slashInPath
        : slashInPath - 1;
    // Display full path or relative path according to settings
    const folderDisplay = showBasePathInOption
      ? p.path
      : p.path.replace(folderPath + "/", "");
    // Return formatted option text
    return (
      "\t".repeat(tabLength) +
      optionOrder +
      optionContentTemplate.replace("{{folder}}", folderDisplay)
    );
  });
  // Generate option value list
  const options = resortedSubFolders.map((p) => p.path);
  // Show the selector and get the user's choice
  const option = await tp.system.suggester(choices, options);

  // Return the selected path, or an empty string if not selected
  return option || "";
}

module.exports = IOTOGetFolderOption;
