---
<%* 
const projectName = app.metadataCache.getFileCache(tp.config.active_file)?.frontmatter?.Project;
_%>
<%* if(projectName) { _%>
Project: ["<% projectName %>"]
<%* } _%>
area:
---
# <% tp.file.folder() %>