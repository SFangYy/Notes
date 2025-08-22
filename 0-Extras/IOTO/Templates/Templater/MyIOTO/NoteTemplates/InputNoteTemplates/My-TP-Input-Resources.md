---
<%* 
const projectName = app.metadataCache.getFileCache(tp.config.active_file)?.frontmatter?.Project;
_%>
Project: ["<% projectName %>"]
description: 
tags: 
created: <% tp.date.now("YYYY-MM-DD | HH:mm") %>
parent: Resource
---
# <% tp.file.folder() %>