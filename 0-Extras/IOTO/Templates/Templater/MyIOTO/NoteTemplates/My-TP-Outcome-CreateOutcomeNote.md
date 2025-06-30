<%* 
const {projectNameFormat} = app.plugins.plugins["ioto-settings"].settings;
const projectName = await tp.user.IOTOCreateProjectName(tp.file.folder(true), projectNameFormat); 
const folderPath = tp.file.folder(true).split("/").last();
_%>
<%* if(!folderPath.includes("IOTO-Docs")){ _%>
---
Project: ["<% projectName %>"]
Status: Ongoing
---
<%* } _%>