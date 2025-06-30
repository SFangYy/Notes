/*
 ** Script Name: Create Tasks List
 ** Author: Johnny
 ** Bilibili: https://space.bilibili.com/432408734
 ** Version: 1.9.1
 */

// enableFutureDaysChoices: Allow users to choose whether to create TDL for future dates
// timestampFormat: Allow users to set the timestamp format themselves

async function IOTOCreateTasksList(tp, folderPath, settings) {
  // If no folder path is provided, return directly
  if (!folderPath) return;

  const ml = new (tp.user.IOTOMultiLangs())();

  const {
    template,
    enableFutureDaysChoices,
    timestampFormat: origTimestampFormat,
    useCustomTDLName,
    projectNameFormat,
  } = settings;

  // Handle date offset
  let offset = 0;
  let timestampFormat = origTimestampFormat;
  if (enableFutureDaysChoices) {
    const futureDaysChoices = [
      ml.t("CreateTodayTasksList"),
      ml.t("CreateTomorrowTasksList"),
      ml.t("CreateAfterTomorrowTasksList"),
      ml.t("CreateBigAfterTomorrowTasksList"),
    ];
    const futureDaysOptions = [0, 1, 2, 3];
    timestampFormat = "YYYY-MM-DD";
    offset =
      (await tp.system.suggester(futureDaysChoices, futureDaysOptions)) ?? 0;
  }

  // Generate task list name
  const projectName = await tp.user.IOTOCreateProjectName(
    folderPath,
    projectNameFormat
  );
  const userAssignedName = useCustomTDLName
    ? await tp.system.prompt(ml.t("PleaseSpecifyTDLTopic"))
    : "";
  const customTDLName = userAssignedName ? `-${userAssignedName}` : "";
  const tdlName = `${projectName}-${tp.date.now(
    timestampFormat,
    offset
  )}${customTDLName}`;

  // Create or open the task list
  const tdlNote = tp.file.find_tfile(`${folderPath}/${tdlName}`);
  const targetPath =
    tdlNote?.path ||
    (
      await tp.file.create_new(
        tp.file.find_tfile(template),
        tdlName,
        false,
        app.vault.getAbstractFileByPath(folderPath)
      )
    ).path;

  // Open the task list in a new tab
  app.workspace.openLinkText(targetPath, "/", true);
}

module.exports = IOTOCreateTasksList;
