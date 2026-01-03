async function IOTOCreateProjectName(targetPath, projectNameFormat) {
  const { projectNameSource, outcomeFolder } =
    app.plugins.plugins["ioto-settings"].settings;
  const isFirstLevel = projectNameSource === "first";

  const pathParts = targetPath.split("/").filter(Boolean);
  let projectFolderName;

  if (isFirstLevel || targetPath.startsWith(outcomeFolder)) {
    projectFolderName = pathParts[1] || "";
  } else {
    projectFolderName = pathParts[pathParts.length - 1] || "";
  }

  let projectName = projectFolderName;

  if (projectNameFormat === "firstDash") {
    const dashIndex = projectFolderName.indexOf("-");
    projectName =
      dashIndex !== -1
        ? projectFolderName.slice(dashIndex + 1)
        : projectFolderName;
  } else if (projectNameFormat === "lastDash") {
    const lastDashIndex = projectFolderName.lastIndexOf("-");
    projectName =
      lastDashIndex !== -1
        ? projectFolderName.slice(lastDashIndex + 1)
        : projectFolderName;
  }

  return projectName;
}

module.exports = IOTOCreateProjectName;
