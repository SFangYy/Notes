---
Project:
  - undefined
description:
tags:
  - linux
created: 2025-09-08 | 10:56
parent: Resource
---
# 003-GPT

### 启动git
```

```
### 不重新构建系统，使用实验特性
```
NIX_CONFIG="experimental-features = nix-command flakes pipe-operators" sudo -E nixos-rebuild switch --flake .#inspiron
```