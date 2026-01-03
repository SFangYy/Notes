<%*



const {inputFolder, outputFolder, taskFolder, outcomeFolder, LTDListOutputSectionHeading, addLinkToCurrentTDL, defaultTDLHeadingLevel, defaultTDLDateFormat} = app.plugins.plugins["ioto-settings"].settings;


const specificFolderPath = `${inputFolder}/2-碎片笔记`;


const settings = {

	template: "My-TP-Input-CreateInputNote",

	defaultNewNoteFollowUpAction: 1,

	noteNamePrefix: "",

	assignedNoteName: tp.file.selection() ? tp.file.selection() : "",
	
	noteNamePostfix: "",

	defaultExcalidrawTemplate: ""
}


tR += await tp.user.IOTOCreateOrOpenNote(tp, tR, specificFolderPath, settings);

if(addLinkToCurrentTDL){
	const addLinkToTDLSettings = {
		taskFolder: taskFolder,
		targetHeading: LTDListOutputSectionHeading,
		headingLevel: defaultTDLHeadingLevel,
		tdlDateFormat: defaultTDLDateFormat
	};
	
	await tp.user.IOTOAddLinkToTDL(tp, tR, addLinkToTDLSettings);
}
%>