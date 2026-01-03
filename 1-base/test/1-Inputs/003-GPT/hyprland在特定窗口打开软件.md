---
Project:
  - LearnTools
description:
tags:
  - linux
created: 2025-08-13 | 14:15
parent: Resource
---
# 003-GPT
在 Hyprland 中配置特定窗口打开应用的快捷键，需要通过 `hyprland.conf` 配置文件实现。以下是详细配置方法：

### 基础配置方法

ini

# ~/.config/hypr/hyprland.conf

# 1. 定义快捷键绑定
bind = SUPER, T, exec, alacritty  # 按 Super+T 打开 Alacritty

# 2. 指定窗口打开位置和工作区
windowrulev2 = float, class:^(alacritty)$
windowrulev2 = size 60% 70%, class:^(alacritty)$
windowrulev2 = center, class:^(alacritty)$
windowrulev2 = workspace 3, class:^(alacritty)$

### 进阶配置：在特定窗口类型中打开应用

#### 方案一：在浮动窗口中打开应用

ini

# 浮动窗口打开文件管理器
bind = SUPER, E, exec, thunar
windowrulev2 = float, class:^(thunar)$
windowrulev2 = size 800 600, class:^(thunar)$
windowrulev2 = move center, class:^(thunar)$

#### 方案二：在固定工作区打开应用

ini

# 工作区5打开浏览器
bind = SUPER, B, exec, firefox
windowrulev2 = workspace 5, class:^(firefox)$

#### 方案三：在特定显示器打开应用

ini

# 在第二显示器打开IDE
bind = $mainMod, C, exec, code
windowrulev2 = monitor DP-1, class:^(code-url-handler)$

### 完整配置示例

ini

# ~/.config/hypr/hyprland.conf

# 变量定义
$mainMod = SUPER

# 应用快捷键绑定
bind = $mainMod, T, exec, alacritty  # 终端
bind = $mainMod, E, exec, nautilus   # 文件管理器
bind = $mainMod, B, exec, firefox    # 浏览器
bind = $mainMod, C, exec, code       # VSCode
bind = $mainMod, M, exec, ncmpcpp    # 音乐播放器

# 窗口规则配置
# 1. 终端 - 工作区3, 浮动居中
windowrulev2 = float, class:^(Alacritty)$
windowrulev2 = size 60% 70%, class:^(Alacritty)$
windowrulev2 = center, class:^(Alacritty)$
windowrulev2 = workspace 3, class:^(Alacritty)$

# 2. 文件管理器 - 工作区2, 浮动
windowrulev2 = float, class:^(org.gnome.Nautilus)$
windowrulev2 = size 1000 700, class:^(org.gnome.Nautilus)$
windowrulev2 = move 50% 50%, class:^(org.gnome.Nautilus)$
windowrulev2 = workspace 2, class:^(org.gnome.Nautilus)$

# 3. 浏览器 - 工作区5
windowrulev2 = workspace 5, class:^(firefox)$

# 4. VSCode - 工作区1, 主显示器
windowrulev2 = workspace 1, class:^(code-url-handler)$
windowrulev2 = monitor DP-1, class:^(code-url-handler)$

# 5. 音乐播放器 - 浮动在右下角
windowrulev2 = float, class:^(ncmpcpp)$
windowrulev2 = size 400 300, class:^(ncmpcpp)$
windowrulev2 = move 75% 70%, class:^(ncmpcpp)$hhh