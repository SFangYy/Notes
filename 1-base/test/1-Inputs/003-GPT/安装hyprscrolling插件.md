---
Project:
  - LearnTools
description:
tags:
  - linux
created: 2025-08-23 | 14:17
parent: Resource
---
# 003-GPT
在hyprland中实现滚动平铺


Hyprland的滚动平铺插件：告别拥挤，拥抱无限工作流

对于追求极致效率和个性化桌面的 Hyprland 用户来说，滚动平铺（Scrolling Tiling）插件提供了一种全新的窗口管理方式。它借鉴了 PaperWM 和 sway 等窗口管理器的理念，将工作区从固定的网格布局中解放出来，转变为一个可以无限滚动的线性工作流，让您即使在小屏幕上也能够优雅地同时处理大量窗口。

Hyprland 社区目前涌现了多款优秀的滚动平铺插件，其中以 hyprscroller 和官方维护的 hyprscrolling 最为知名和功能完善。此外，还有 hyprslidr 等其他选择，为用户提供了多样化的滚动平铺体验。

主要插件介绍

### 1. hyprscroller

hyprscroller 是由 dawsers 开发的一款功能非常全面的滚动平铺插件。它旨在提供类似 PaperWM 的顺滑体验，并加入了许多实用的增强功能。

- 核心特性：
	- 两种布局模式：
		- 行模式 (Row Mode): 新窗口默认在右侧以新列的形式创建，形成一个水平滚动的布局。用户可以方便地调整列宽。
		- 列模式 (Column Mode): 新窗口在当前活动窗口的下方创建，在同一列内垂直排列。用户可以调整行高。
	-  窗口概览与快速跳转： 提供一个类似 Exposé 的概览模式，可以清晰地看到所有打开的窗口，并通过键盘快捷键快速聚焦到任意窗口。
	-   强大的窗口和列管理： 支持固定列（Pinned Columns）、窗口标记、窗口复制粘贴等高级功能，方便组织复杂的工作流。
	-   触摸板手势支持： 可以通过触摸板手势直观地滚动工作区和列，带来更加流畅的交互体验。
	- 高度可定制： 提供丰富的配置选项，可以自定义动画、边框、间隙、快捷键等，以满足不同用户的个性化需求。

- 安装与配置：
	- 通常可以通过 Hyprland 的插件管理器 hyprpm 进行安装。安装后，需要在 hyprland.conf 中将默认布局设置为 scrolling，并添加 plugin:hyprscroller 的相关配置。

示例配置片段：
```

general {
    layout = "scrolling"
}

plugin {
    hyprscroller {
        # 配置项...
    }
}

```

### 2. hyprscrolling

hyprscrolling 是 Hyprland 官方插件仓库中的一员，由核心开发团队维护，保证了其与 Hyprland 的兼容性和稳定性。虽然它可能不像 hyprscroller 那样功能繁多，但提供了坚实可靠的滚动平铺核心体验。

- 核心特性：
	- 官方支持： 作为官方插件，能够更好地与 Hyprland 的新版本和新特性保持同步。
	- 简洁高效： 专注于提供滚动平铺的核心功能，配置相对简单，更容易上手。
	- 焦点跟随： 当窗口获得焦点时，布局会自动滚动以使其可见，确保您始终能看到正在操作的窗口。
	- 灵活的布局控制： 支持通过 dispatcher 来移动布局、调整列宽，以及对窗口进行适配和对齐。

- 安装与配置：
	- 同样，推荐使用 hyprpm 进行安装。配置方式与 hyprscroller 类似，需要在 hyprland.conf 中启用并进行设置。
示例配置片段：
Nix
```
general {
    layout = "scrolling"
}

plugin {
    hyprscrolling {
        # 配置项...
    }
}

```

3. hyprslidr

hyprslidr 是另一款实现滚动平铺布局的插件。虽然它的知名度可能不及前两者，但同样为用户提供了一种可行的选择。建议用户在选择前，访问其项目主页，了解其具体的特性和开发活跃度。


## 第二部分：如何使用 hyprscrolling


Hyprscrolling 是 Hyprland 官方维护的一款滚动平铺插件，它能将您的工作区变成一个可以水平滚动的线性布局，非常适合需要同时处理多个窗口的工作流。

第一步：安装 Hyprscrolling

安装 Hyprscrolling 最推荐、最简单的方式是使用 Hyprland 官方的插件管理器 hyprpm。
- 打开您的 Hyprland 配置文件 ~/.config/hypr/hyprland.conf，在文件任意位置（建议是开头或结尾）添加以下一行：
```
plugin = /usr/lib/hyprland-plugins/hyprscrolling.so

```
注意：上面的路径是 hyprpm 安装插件的默认路径。如果您的系统不同，请确认实际路径。

2. 使用 hyprpm 安装
打开终端，执行以下命令：
```bash
hyprpm add https://github.com/hyprwm/hyprscrolling
hyprpm enable hyprscrolling

# hyprpm 会自动克隆仓库、编译并安装插件。
```

3. 重新加载 Hyprland
    保存 hyprland.conf 文件。您可以通过在终端执行 hyprctl reload 或使用您设置的重载快捷键（通常是 SUPER + SHIFT + R）来重新加载 Hyprland。如果一切顺利，插件此时应该已经加载成功了。

### 第二步：核心配置

要启用 Hyprscrolling，您需要将 Hyprland 的默认布局设置为 scrolling。

   设置默认布局
   - 在 hyprland.conf 中找到 general 部分，修改或添加 layout 变量：
```
general {
    # ... 其他 general 设置 ...
    layout = scrolling
    # ... 其他 general 设置 ...
}

```

添加插件配置（可选但推荐）
在 hyprland.conf 中添加 plugin:hyprscrolling 部分来自定义插件的行为。
```
    plugin {
        hyprscrolling {
            # --- 核心设置 ---
            # 滚动速度 (每次滚动多少像素)
            scroll_speed = 50
            # 是否在鼠标移动到屏幕边缘时自动滚动
            mouse_drag_at_edge = 1 # 1 为开启, 0 为关闭

            # --- 间距与样式 ---
            # 列之间的间距
            scrolling_gaps = 5
            # 切换到滚动布局时，窗口之间的默认间距
            # (注意: 这会覆盖 general:gaps_in)
            default_gaps = 5
            # 列的宽度 (百分比, 0.0 到 1.0)
            # 1.0 意味着一列占据整个显示器宽度
            column_width_percent = 0.8 # 80%

            # --- 动画效果 ---
            # 滚动动画的贝塞尔曲线
            bezier_scroll = "0.2, 0.9, 0.1, 1.05"
            # 滚动动画的速度 (毫秒)
            transition_duration = 300
        }
    }

```

 - 配置建议：
	- column_width_percent 是一个非常关键的设置。0.8 意味着屏幕上大部分时间会完整显示一列，同时还能瞥见相邻列的一部分，这在视觉上提供了很好的上下文。
	- mouse_drag_at_edge 开启后，您可以用鼠标拖动一个窗口到屏幕边缘来滚动整个工作区，非常直观。
### 第三步：设置关键快捷键 (Keybindings)

默认情况下，Hyprscrolling 不会自动绑定任何快捷键。您需要手动在 hyprland.conf 的 bind 部分添加快捷键，才能真正地使用它。

以下是一套推荐的基础快捷键设置，您可以根据自己的习惯进行修改。
Nix
```
# -----------------------------------------------
# Hyprscrolling Keybindings
# -----------------------------------------------

# SUPER = Mod4 (通常是 "Win" 键)

# 1. 滚动工作区
# 滚动到左边的列
bind = SUPER, h, plugin:scrolling:scroll_left
# 滚动到右边的列
bind = SUPER, l, plugin:scrolling:scroll_right

# 也可以使用鼠标滚轮在空白处滚动
# bind = SUPER, mouse_down, plugin:scrolling:scroll_down
# bind = SUPER, mouse_up, plugin:scrolling:scroll_up

# 2. 移动窗口
# 将当前窗口与左边的窗口交换位置
bind = SUPER SHIFT, h, plugin:scrolling:move_window_left
# 将当前窗口与右边的窗口交换位置
bind = SUPER SHIFT, l, plugin:scrolling:move_window_right

# 3. 调整列宽 (可选)
# 增加当前列的宽度
bind = SUPER CTRL, l, plugin:scrolling:resize_active_column, 10
# 减小当前列的宽度
bind = SUPER CTRL, h, plugin:scrolling:resize_active_column, -10

# 4. 在同一列内创建新窗口
# 默认新窗口会在右侧创建新列。这个快捷键可以让你在当前列的下方打开新窗口。
bind = SUPER, return, plugin:scrolling:new_window_as_child
# 如果你希望所有终端都在当前列下方打开，可以设置窗口规则 (Window Rule)
# windowrulev2 = scrolling:create_as_child, class:(kitty)

# 5. 切换窗口焦点
# 使用默认的左右方式切换，插件会自动滚动
bind = SUPER, left, movefocus, l
bind = SUPER, right, movefocus, r

# 如果你在同一列内有多个窗口，还需要上下切换
bind = SUPER, up, movefocus, u
bind = SUPER, down, movefocus, d

快捷键说明：

    plugin:scrolling:scroll_left / right: 这是最核心的功能，让您在无限的工作区中穿梭。

    plugin:scrolling:move_window_left / right: 用于重新组织窗口顺序。

    plugin:scrolling:new_window_as_child: 非常实用！当您想在一个任务（例如编码）中打开一个辅助窗口（例如终端）时，不希望它创建一个全新的列，就可以用这个功能。

```

第四步：日常使用技巧

配置完成后，您可以这样使用 Hyprscrolling：

- 打开窗口：像往常一样打开应用 (SUPER + Q 关闭终端，SUPER + D 打开程序启动器等)。新窗口默认会在右侧创建一个新的“列”。
- 导航：使用您设置的 SUPER + h 和 SUPER + l (或您自定义的键) 在这些列之间平滑滚动。
- 专注：当您聚焦某个窗口时，Hyprscrolling 会自动将该列滚动到屏幕中央。
- 整理：如果窗口顺序乱了，使用 SUPER + SHIFT + h/l 来移动它们，将相关的窗口放在一起。
- 纵向扩展：当您需要在一个任务下打开多个纵向窗口时（例如一个 Neovim 和一个终端），先聚焦 Neovim，然后按 SUPER + return (或您绑定的键) 来在它的下方打开终端。

总结

通过以上四个步骤，您应该已经成功安装并配置好了 Hyprscrolling。它可能会改变您管理窗口的习惯，但一旦适应，您会发现这种线性的、无限滚动的工作流在处理复杂任务时异常高效和整洁。

最后建议：务必访问 Hyprscrolling 的官方 GitHub 仓库，查看其 README 文件。插件的开发者会在这里发布最新的配置选项和功能更新。
