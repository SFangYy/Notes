---
Project: ["undefined"]
description: 
tags: 
created: 2025-09-08 | 14:07
parent: Resource
---
# 003-GPT

```
# /etc/nixos/configuration.nix

environment.systemPackages = with pkgs; [
  flameshot
  grim         # Wayland 下的截图工具
  slurp        # Wayland 下的选区工具
  wl-clipboard # Wayland 剪贴板工具
  # ... 你已有的其他包 ...
];
```

## 给niri配置快捷键
```
"Mod+G".action = spawn [
   "bash"
   "-c" 
   "grim -g \"$(slurp)\" - | swappy -f -" 
];
```
