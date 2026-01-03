---
<%* const {projectNameFormat} = app.plugins.plugins["ioto-settings"].settings;
const projectName = app.metadataCache.getFileCache(tp.config.active_file)?.frontmatter?.Project || await tp.user.IOTOCreateProjectName(tp.file.folder(true), projectNameFormat); _%>
<%* if(projectName) { _%>
Project: ["<% projectName %>"]
<%* } _%>
Status: Ongoing
---