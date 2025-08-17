---
<%* const {LTDListInputSectionHeading, LTDListOutputSectionHeading, LTDListOutcomeSectionHeading, defaultTDLDateFormat, projectNameFormat, defaultTDLHeadingLevel} = app.plugins.plugins["ioto-settings"].settings;
const projectName = await tp.user.IOTOCreateProjectName(tp.file.folder(true), projectNameFormat); 
const aimAndPlan = projectName + "-A&P";
_%>
Project: ["<% projectName %>"]
cssclasses: ["iotoTDL"]
aimAndPlan: "[[<% aimAndPlan %>]]"
tags: 
parent: Project
branch: 
Archived: 
cssclasses: []
startDate: <% tp.date.weekday("YYYY-MM-DD", 0) %>
endDate: <% tp.date.weekday("YYYY-MM-DD", 7) %>
---
## Task
![[0-Extras/form/test.components]]
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

![[]]