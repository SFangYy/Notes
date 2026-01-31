---
Project:
  - undefined
description:
tags:
  - linux
created: 2025-09-08 | 10:43
parent: Resource
---
# 004
1. 下载[nixos配置](https://github.com/SFangYy/nixos)到home下
2. 在hosts下定义`inspiron`的配置
3. 生成本机硬件配置并复制到`inspiron`下
4. 使用新配置重新构建系统
5. 使用`home-manager`生成配置文

```
git clone git@github.com:SFangYy/nixos.git && cd nixos

nixos-generate-config --dir hosts/aesthetic --force

cp hosts/aesthetic/hardware-configuration.nix hosts/inspiron

sudo nixos-rebuild switch --flake .#inspiron

home-manager switch --flake .
```

## 生成flake lock
```
	若lock文件冲突，则可以删除flake.lock文件然后
	nix flake lock --extra-experimental-features 'nix-command flakes'
```

### 附：nixos项目结构
```
~/nixos/ (or /etc/nixos/)
├── flake.nix
├── flake.lock
├── hosts/
    ├── inspiron/  (config hardware home-manager and monitor info)
├── os/
    └── system/     (optional)
        ├── configuration.nix  (system basic info)
    └── programs/    (optional)
└── home-manager/
    ├── default.nix  (or home.nix)
    └── modules/     (optional)
    └── programs/    (optional)
    └── services/    (optional)
```
1. **The Flake (`flake.nix`)**: This is the entry point. It describes your _inputs_ (where to get Nixpkgs, Home Manager, etc.) and your _outputs_ (the things you can build, like your system and home configuration).
2. **NixOS Config (`configuration.nix`)**: This file is an output of the flake and defines your system-wide settings (kernel, bootloader, system packages, etc.).
3. **Home Manager Config (`home/default.nix`)**: This file defines your _user-specific_ settings (shell, GUI apps, dotfiles, user services). It's managed by the `home-manager` input in your flake.


