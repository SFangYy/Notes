---
Project: ["undefined"]
description: 
tags: 
created: 2025-08-31 | 20:22
parent: Resource
---
# 003-GPT
在bashrc中添加
```
if [[ $- == *i* ]] && [[ $(ps -p $$ -o comm=) != "fish" ]]; then
    exec fish
fi
```