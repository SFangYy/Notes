---
<%* const {projectNameFormat} = app.plugins.plugins["ioto-settings"].settings;
const projectName = await tp.user.IOTOCreateProjectName(tp.file.folder(true), projectNameFormat); _%>
Project: ["<% projectName %>"]
Status: Ongoing
---