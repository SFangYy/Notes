---
<%* 
const projectName = app.metadataCache.getFileCache(tp.config.active_file)?.frontmatter?.Project;
_%>
<%* if(projectName) { _%>
Project: ["<% projectName %>"]
<%* } _%>
description:
area: 工作
tags: code
parent: Resource
---
# <% tp.file.folder() %>