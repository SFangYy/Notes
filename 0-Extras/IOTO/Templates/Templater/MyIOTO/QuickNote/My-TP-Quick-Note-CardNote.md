<%*

const {inputFolder, outputFolder, taskFolder, outcomeFolder, LTDListOutcomeSectionHeading, addLinkToCurrentTDL, defaultTDLHeadingLevel, defaultTDLDateFormat} = app.plugins.plugins["ioto-settings"].settings;


const specificFolderPath = `${outputFolder}/2-CardNotes`;


const settings = {

	template: "My-TP-Output-CreateOutputNote",

	defaultNewNoteFollowUpAction: 1,


	noteNamePrefix: "",


	assignedNoteName: tp.file.selection() ? tp.file.selection() : "",
	

	noteNamePostfix: "",


	defaultExcalidrawTemplate: ""
}


tR += await tp.user.IOTOCreateOrOpenNote(tp, tR, specificFolderPath, settings);


if(addLinkToCurrentTDL) {
	const addLinkToTDLSettings = {
		taskFolder: taskFolder,
		targetHeading: LTDListOutcomeSectionHeading,
		headingLevel: defaultTDLHeadingLevel,
		tdlDateFormat: defaultTDLDateFormat
	}
	await tp.user.IOTOAddLinkToTDL(tp, tR, addLinkToTDLSettings);
}
%>