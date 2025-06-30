---
Project: ["LearnIOTO"]
title: 
description: 
source: 
author: 
tags: 
created: 2025-06-30 | 12:56
parent: Resource
branch: 
---
# Resources

git submodule add https://github.com/你的用戶名/你的私有倉庫.git path/to/submodule
git commit -m "添加私有子倉庫"
git push

## example 
add exist obsidian config rep to Note

```
╰─   ls -a .obsidian
.git .gitignore  xxx

git submodule add git@github.com:SFangYy/obconfig.git .obsidian
Adding existing repo at '.obsidian' to the index

╰─   cat .gitmodules 
[submodule ".obsidian"]
	path = .obsidian
	url = git@github.com:SFangYy/obconfig.git

```