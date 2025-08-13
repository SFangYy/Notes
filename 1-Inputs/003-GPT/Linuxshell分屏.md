---
Project:
title: 
description: 
source: 
author: 
tags: 
created: 2025-08-13 | 10:45
parent: Resource
branch: 
---
# 003-GPT
### 方法一：使用 Tmux（推荐）

#### 1. 安装 Tmux

bash

# Ubuntu/Debian
sudo apt update && sudo apt install tmux

# CentOS/RHEL
sudo yum install tmux

# Fedora
sudo dnf install tmux

#### 2. 基础分屏操作

|操作|快捷键|说明|
|---|---|---|
|启动新会话|`tmux`||
|垂直分屏|`Ctrl+b` → `%`|创建左右窗格|
|水平分屏|`Ctrl+b` → `"`|创建上下窗格|
|切换窗格|`Ctrl+b` → 方向键|↑↓←→ 在窗格间移动|
|关闭当前窗格|`Ctrl+d` 或 `exit`||
|调整窗格大小|`Ctrl+b` + `Alt+方向键`|按住调整|
|全屏当前窗格|`Ctrl+b` → `z`|再次按 `z` 恢复|
|退出 Tmux|`Ctrl+b` → `d`|脱离会话（后台运行）|
|重新连接会话|`tmux attach`|恢复最后会话|

#### 3. 高级功能

bash

# 创建命名会话
tmux new -s mysession

# 分屏后执行命令（垂直分屏并运行 top）
tmux split-window -h 'top'

# 列出会话
tmux ls

# 连接特定会话
tmux attach -t mysession