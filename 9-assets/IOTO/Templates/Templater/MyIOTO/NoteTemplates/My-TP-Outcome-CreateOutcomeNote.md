---
<%* 
const {projectNameFormat} = app.plugins.plugins["ioto-settings"].settings;
const projectName = app.metadataCache.getFileCache(tp.config.active_file)?.frontmatter?.Project || await tp.user.IOTOCreateProjectName(tp.file.folder(true), projectNameFormat); 
const folderPath = tp.file.folder(true).split("/").last();
_%>
Project: ["<% projectName %>"]
Status: Ongoing
---