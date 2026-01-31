---
Project:
  - Tools
description:
tags:
  - linux
created: 2025-08-26 | 14:39
parent: Resource
---
# 001-Video

## 调整窗口大小
```
要调整 Tmux 窗格大小，你需要先按下前缀键（默认为 `Ctrl+b`），然后使用以下快捷键：

- `Alt+方向键`：以 5 个单元格为单位调整
    
- `Ctrl+方向键`：以 1 个单元格为单位精细调整
    
- `:resize-pane -[方向]`：通过命令调整特定方向的大小
```
## 插件
```
git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
```

## 前缀
```
set -g prefix ` 
bind ` send-prefix

```

