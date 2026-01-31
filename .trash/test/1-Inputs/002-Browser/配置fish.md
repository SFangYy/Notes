---
Project:
  - LearnTools
description:
tags:
  - linux
created: 2025-08-08 | 13:26
parent: Resource
---
# 002-Browser
位置在`.config/fish/config`

配置了一些快捷键
```
alias ls 'eza --icons'
alias clear "printf '\033[2J\033[3J\033[1;1H'"
alias q 'qs -c ii'
alias z 'cd ..'    
alias c 'clear'
alias vim 'nvim'
alias update 'sudo pacman -Syu'
alias cdw 'cd ~/work'
alias cdn 'cd ~/work/Notes'

```

### 配置环境变量

配置环境变量
```
set -gx GEMINI_API_KEY AIzaSyDuSjzoFV16HO-pCrrgrpHgjK2ncRO5wPA
set -gx VCS_HOME "/home/sfangyy/work/9-dependency/synopsys/vcs/W-2024.09-SP1"
set -gx PATH "$VCS_HOME/bin" $PATH
set -gx VCS_ARCH_OVERRIDE linux
```

### ssh to another sh
```
### 主要原因和解决方案（按尝试顺序排列）

#### 方案 1：最可能的原因 - `TERM` 环境变量

这是最常见的原因。你的本地 Fish Shell 可能设置了 `TERM=xterm-256color` 或类似的值，但远程的 Bash 没有正确识别它。

1. **首先，在远程服务器上试试这个命令：**
    
    bash
    

reset

- 这通常会立刻临时修复问题。如果有效，说明下面的永久解决方案会奏效。
    
- **永久解决方案：修改远程服务器上的 `~/.bashrc` 文件**
    
    - 通过 SSH 登录到你的服务器。
        
    - 用你喜欢的编辑器（如 `nano` 或 `vim`）打开 `~/.bashrc` 文件：
        
        bash
        

nano ~/.bashrc

在文件的**最末尾**，添加这一行：

bash

export TERM=xterm-256color

- _（注意：有些较老的系统可能只识别 `xterm`，如果 `xterm-256color` 无效，可以尝试换成 `xterm`）_
    
- 保存并退出文件（在 nano 中是 `Ctrl+X`, 然后 `Y`, 然后 `Enter`）。
    
- 让配置立刻生效：
    
    bash
    

source ~/.bashrc

1. 或者，直接重新登录一次 SSH。
    

**为什么这能解决问题？**  
这明确地告诉远程的 Bash：“我连接的是一个现代化的、支持颜色的终端（xterm-256color）”，Bash 和 Readline 库就能正确地理解 Delete 等键发出的信号了。
```