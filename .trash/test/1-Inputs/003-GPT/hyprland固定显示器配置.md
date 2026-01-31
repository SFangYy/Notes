---
Project:
  - LearnTools
description:
tags:
  - linux
created: 2025-08-12 | 19:43
parent: Resource
---
# 003-GPT
```
hyprctl monitors
```

#### 步骤 2：修改 Hyprland 配置文件

1. 打开配置文件：`nano ~/.config/hypr/hyprland.conf`
```bash
    
# 使用 `description` 或 `edid` 指定显示器：

# 原始方式（依赖易变的端口名）
# monitor = HDMI-A-1, 2560x1440@144, 0x0, 1

# 新方式（使用稳定的描述符）

monitor = desc:AU Optronics 0x591C, 2560x1440@144, 0x0, 1
monitor = desc:Samsung C27F390 0x00000ABC, 1920x1080, 2560x0, 1
```
