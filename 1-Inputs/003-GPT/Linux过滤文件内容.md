---
Project:
title: 
description: 
source: 
author: 
tags: 
created: 2025-08-13 | 15:39
parent: Resource
branch: 
---
# 003-GPT

### 1. 使用 `grep`（最常用）

```bash
# 基本递归搜索（区分大小写）
grep -r "search_string" /path/to/project/

# 常用选项组合：
grep -rni --color=auto --exclude-dir={.git,node_modules} "search_string" .
```
- `-r`：递归搜索子目录
- `-i`：忽略大小写
- `-n`：显示行号
- `--color=auto`：高亮显示匹配结果
- `--exclude-dir`：排除目录（多个用逗号分隔）
- `--include`：指定文件类型（如 `--include="*.py"`）