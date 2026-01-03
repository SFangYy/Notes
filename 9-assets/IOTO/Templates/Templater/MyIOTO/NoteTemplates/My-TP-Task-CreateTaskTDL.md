---
<%* const {LTDListInputSectionHeading, LTDListOutputSectionHeading, LTDListOutcomeSectionHeading, defaultTDLDateFormat, projectNameFormat, defaultTDLHeadingLevel} = app.plugins.plugins["ioto-settings"].settings;
const projectName = await tp.user.IOTOCreateProjectName(tp.file.folder(true), projectNameFormat); 
_%>
<%* if(projectName) { _%>
Project: ["<% projectName %>"]
<%* } _%>
cssclasses: ["hideProperties", "iotoTDL"]
createTime: <% tp.file.creation_date("YYYY-MM-DDTHH:mm:ss") %>
status: TODO
tags:
  - project
---
<%* if(tp.file.title === `${projectName}-${tp.date.now(defaultTDLDateFormat)}`) { _%>
<% defaultTDLHeadingLevel + " " + LTDListInputSectionHeading %>

- [ ]

<% defaultTDLHeadingLevel + " " + LTDListOutputSectionHeading %>

- [ ]

<% defaultTDLHeadingLevel + " " + LTDListOutcomeSectionHeading %>

- [ ]
<%* } _%>
<%* if (tp.file.title.toLowerCase().includes("untitle")) {
	await tp.file.rename(projectName + "-" + tp.date.now(defaultTDLDateFormat));
} _%>