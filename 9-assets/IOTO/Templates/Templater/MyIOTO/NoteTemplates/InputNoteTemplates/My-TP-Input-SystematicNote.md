---
<%* 
const projectName = app.metadataCache.getFileCache(tp.config.active_file)?.frontmatter?.Project;
_%>
<%* if(projectName) { _%>
Project: ["<% projectName %>"]
<%* } _%>
description:
area:
tags:
parent: Resource
---
# <% tp.file.folder() %>[[111]]