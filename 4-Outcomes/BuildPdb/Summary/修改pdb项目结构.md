---
Project: ["BuildPdb"]
title: 
description: 
source: 
author: 
tags: 
created: 2025-07-31 | 11:12
parent: Resource
branch: 
---
# 003-GPT
修改以后的项目结构如下

```bash
xspdb/
├── .gitignore
├── LICENSE
├── pyproject.toml
├── README.md
├── pdb-run.py
├── Make
├── src/
    └── xspdb/
        ├── __init__.py
        ├── xspdb.py
        └── cmds/
    └── pyxscore/
        └── libUTSimTop.so
    └── pydifftest/
        ├── difftest.so
        └── difftest.py


```