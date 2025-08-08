<%*
const {inputFolder, LTDListInputSectionHeading,LTDListOutputSectionHeading, taskFolder, useUserTemplate, addLinkToCurrentTDL, defaultTDLDateFormat, inputSelectorExcludesPaths, inputSelectorShowOptionOrder, inputSelectorShowBasePath, inputSelectorFolderOptionTemplate, newInputNoteFollowUpAction, inputNoteNamePrefix, inputNoteNamePostfix, inputNoteDefaultExcalidrawTemplate, defaultTDLHeadingLevel, newInputNoteAddedToTDLFollowUpAction} = app.plugins.plugins["ioto-settings"].settings;

const ml = new (tp.user.IOTOMultiLangs())();

let tasktag = await tp.system.prompt("任务标签为");

const inputsFolderSettings = {
	folderPath: inputFolder,
    excludesPaths: inputSelectorExcludesPaths ? inputSelectorExcludesPaths.trim().split("\n") : [],
    showBasePathInOption: inputSelectorShowBasePath,
    optionContentTemplate: inputSelectorFolderOptionTemplate,
    showOptionOrder: inputSelectorShowOptionOrder,
}

const noteTemplate = await tp.user.IOTOLoadTemplate(tp, tR, this.app, ml.t("IOTODefaultInputNoteTemplate"), false);

const inputsNoteSettings = {
	template: noteTemplate,
    defaultNewNoteFollowUpAction: parseInt(newInputNoteFollowUpAction),
    noteNamePrefix: inputNoteNamePrefix,
    assignedNoteName: tp.file.selection() ? tp.file.selection() : "",
    noteNamePostfix: inputNoteNamePostfix,
    defaultExcalidrawTemplate: inputNoteDefaultExcalidrawTemplate,
}

const newNoteLink = await tp.user.IOTOCreateOrOpenNote(tp, tR, await tp.user.IOTOGetFolderOption(tp, inputsFolderSettings), inputsNoteSettings) + " #" + tasktag;

if(addLinkToCurrentTDL){
		const addLinkToTDLSettings = {
			taskFolder: taskFolder,
			targetHeading: LTDListInputSectionHeading,
			headingLevel: defaultTDLHeadingLevel,
			tdlDateFormat: defaultTDLDateFormat,
			followUpAction: parseInt(newInputNoteAddedToTDLFollowUpAction)
		};
		tR += await tp.user.IOTOAddLinkToTDL(tp, newNoteLink, addLinkToTDLSettings);
	} else {
		tR += newNoteLink;
}
_%>
