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