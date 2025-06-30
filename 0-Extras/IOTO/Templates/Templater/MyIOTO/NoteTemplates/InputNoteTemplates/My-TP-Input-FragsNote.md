---
<%* 
const projectName = app.metadataCache.getFileCache(tp.config.active_file)?.frontmatter?.Project;
_%>
Project: ["<% projectName %>"]
title: 
description: 
source: 
author: 
tags: 
created: <% tp.date.now("YYYY-MM-DD | HH:mm") %>
parent: Resource
branch: 
---
# <% tp.file.folder() %>


