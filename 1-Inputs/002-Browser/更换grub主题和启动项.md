---
Project: 
title: 
description: 
source: 
author: 
tags:
  - linux
created: 2025-08-14 | 09:42
parent: Resource
branch:
---
# 002-Browser

## 启动项 
```
GRUB_DISABLE_OS_PROBER=false
sudo pacman -S os-prober ntfs-3g
sudo grub-mkconfig -o /boot/grub/grub.cfg
```
## theme

- [tela](https://github.com/vinceliuice/grub2-themes)
	- `sudo ./install.sh -b -t tela`