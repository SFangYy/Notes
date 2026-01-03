<%*
const {taskFolder, useUserTemplate, defaultTDLDateFormat, projectNameFormat, taskSelectorExcludesPaths, taskSelectorShowOptionOrder, taskSelectorShowBasePath, taskSelectorFolderOptionTemplate, taskSelectorEnableFutureDaysChoices, taskSelectorUseCustomTdlNames} = app.plugins.plugins["ioto-settings"].settings;

const ml = new (tp.user.IOTOMultiLangs(tp))(tp);

const tasksFolderSettings = {

    folderPath: taskFolder,

    excludesPaths: taskSelectorExcludesPaths ? taskSelectorExcludesPaths.split("\n") : [],

    showBasePathInOption: taskSelectorShowBasePath,
    optionContentTemplate: taskSelectorFolderOptionTemplate,
    showOptionOrder: taskSelectorShowOptionOrder,

}

const noteTemplate = await tp.user.IOTOLoadTemplate(tp, tR, this.app, ml.t("IOTODefaultTaskNoteTemplate"), false);

const tasksSettings = {

    template: noteTemplate,
    enableFutureDaysChoices: taskSelectorEnableFutureDaysChoices,
    timestampFormat: defaultTDLDateFormat,
    projectNameFormat: projectNameFormat,
    useCustomTDLName: taskSelectorUseCustomTdlNames,

}

await tp.user.IOTOCreateTasksList(tp, await tp.user.IOTOGetFolderOption(tp, tasksFolderSettings), tasksSettings);
_%>
