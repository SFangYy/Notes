<%*
const {outputFolder, LTDListOutcomeSectionHeading, LTDListOutputSectionHeading, taskFolder, useUserTemplate, addLinkToCurrentTDL, defaultTDLDateFormat, outputSelectorExcludesPaths, outputSelectorShowOptionOrder, outputSelectorShowBasePath, outputSelectorFolderOptionTemplate, newOutputNoteFollowUpAction, fleetingNoteFolder, 
fleetingNotePrefix, fleetingNoteDateFormat, outputNoteNamePrefix, outputNoteNamePostfix, outputNoteDefaultExcalidrawTemplate, defaultTDLHeadingLevel, newOutputNoteAddedToTDLFollowUpAction} = app.plugins.plugins["ioto-settings"].settings;

const ml = new (tp.user.IOTOMultiLangs(tp))(tp);

const outputsFolderSettings = {
folderPath: outputFolder,
excludesPaths: outputSelectorExcludesPaths ? outputSelectorExcludesPaths.trim().split("\n") : [],
showBasePathInOption: outputSelectorShowBasePath,
optionContentTemplate: outputSelectorFolderOptionTemplate,
showOptionOrder: outputSelectorShowOptionOrder,
}

const noteTemplate = await tp.user.IOTOLoadTemplate(tp, tR, this.app, ml.t("IOTODefaultOutputNoteTemplate"), false);

const outputsNoteSettings = {

    template: noteTemplate,
    defaultNewNoteFollowUpAction: parseInt(newOutputNoteFollowUpAction),
    noteNamePrefix: outputNoteNamePrefix,
    assignedNoteName: tp.file.selection() ? tp.file.selection() : "",
    noteNamePostfix: outputNoteNamePostfix,
    defaultExcalidrawTemplate: outputNoteDefaultExcalidrawTemplate,
    fleetingNotePrefix: fleetingNotePrefix,
    fleetingNoteFolder: fleetingNoteFolder,
    fleetingNoteDateFormat: fleetingNoteDateFormat,

}

const newNoteLink = await tp.user.IOTOCreateOrOpenNote(tp, tR, await tp.user.IOTOGetFolderOption(tp, outputsFolderSettings), outputsNoteSettings);

if(addLinkToCurrentTDL) {
const addLinkToTDLSettings = {
taskFolder: taskFolder,
targetHeading: LTDListOutputSectionHeading,
headingLevel: defaultTDLHeadingLevel,
tdlDateFormat: defaultTDLDateFormat,
followUpAction: parseInt(newOutputNoteAddedToTDLFollowUpAction)
};
tR += await tp.user.IOTOAddLinkToTDL(tp, newNoteLink, addLinkToTDLSettings)
} else {
tR += newNoteLink;
}
_%>
