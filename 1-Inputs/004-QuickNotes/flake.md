用于配置并管理nix系统

目录结构
- host:配置并管理nix用户,hardware配置等
- os:配置系统级应用
- pkgs:相关包

使用flake
```
nixos-rebuild switch --flake .#inspiron
```