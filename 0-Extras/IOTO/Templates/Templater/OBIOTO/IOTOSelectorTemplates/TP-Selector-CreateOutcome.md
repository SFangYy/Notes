<%*
const {outcomeFolder, taskFolder, LTDListOutcomeSectionHeading, useUserTemplate, addLinkToCurrentTDL, defaultTDLDateFormat, outcomeSelectorExcludesPaths, outcomeSelectorShowOptionOrder, outcomeSelectorShowBasePath, outcomeSelectorFolderOptionTemplate, outcomeSelectorIncludeParentFolder, outcomeProjectDefaultSubFolders, newOutcomeNoteFollowUpAction, outcomeNoteNamePrefix, outcomeNoteNamePostfix, outcomeNoteDefaultExcalidrawTemplate, defaultTDLHeadingLevel, newOutcomeNoteAddedToTDLFollowUpAction} = app.plugins.plugins["ioto-settings"].settings;

const ml = new (tp.user.IOTOMultiLangs())();


const outcomesFolderSettings = {

	isOutcomeSelector: true,

    folderPath: outcomeFolder,

    excludesPaths: outcomeSelectorExcludesPaths ? outcomeSelectorExcludesPaths.trim().split("\n") : [],
    showBasePathInOption: outcomeSelectorShowBasePath,
    optionContentTemplate: outcomeSelectorFolderOptionTemplate,
    showOptionOrder: outcomeSelectorShowOptionOrder,
    includeParentFolder: outcomeSelectorIncludeParentFolder,
    taskFolder: taskFolder,
    outcomeProjectDefaultSubFolders: outcomeProjectDefaultSubFolders ? outcomeProjectDefaultSubFolders.trim().split("\n") : [],

}

const noteTemplate = await tp.user.IOTOLoadTemplate(tp, tR, this.app, ml.t("IOTODefaultOutcomeNoteTemplate"), false);

const outcomesNoteSettings ={
	template: noteTemplate,
    defaultNewNoteFollowUpAction: parseInt(newOutcomeNoteFollowUpAction),
    noteNamePrefix: outcomeNoteNamePrefix,
    assignedNoteName: tp.file.selection() ? tp.file.selection() : "",
    noteNamePostfix: outcomeNoteNamePostfix,
    defaultExcalidrawTemplate: outcomeNoteDefaultExcalidrawTemplate,

}

const newNoteLink = await tp.user.IOTOCreateOrOpenNote(tp, tR, await tp.user.IOTOGetFolderOption(tp, outcomesFolderSettings), outcomesNoteSettings);


if(addLinkToCurrentTDL) {
		const addLinkToTDLSettings = {
		taskFolder: taskFolder,
		targetHeading: LTDListOutcomeSectionHeading,
		headingLevel: defaultTDLHeadingLevel,
		tdlDateFormat: defaultTDLDateFormat,
		followUpAction: parseInt(newOutcomeNoteAddedToTDLFollowUpAction)
	}
		tR += await tp.user.IOTOAddLinkToTDL(tp, newNoteLink, addLinkToTDLSettings);
	} else {
		tR += newNoteLink;
}
_%>
