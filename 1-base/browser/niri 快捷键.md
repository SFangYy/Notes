---
---
# browser

这些快捷键在 `home/programs/desktop/niri/swhkd.nix` 中配置。

  

| 快捷键                                   | 动作                                         | 描述                             |
| :------------------------------------ | :----------------------------------------- | :----------------------------- |
| **窗口管理**                              |                                            |                                |
| `Super + q`                           | `quit`                                     | 退出 Niri                        |
| `Super + w`                           | `close-window`                             | 关闭当前窗口                         |
| `Super + Shift + w`                   | *Script*                                   | 更改壁纸/主题 (运行 `change-wal-niri`) |
| `Super + Shift + a`                   | `toggle-overview`                          | 切换窗口概览                         |
| `Super + t`                           | `toggle-column-tabbed-display`             | 切换当前列的标签式显示                    |
| `Super + Shift + Space`               | `toggle-window-floating`                   | 切换窗口悬浮状态                       |
| `Super + Space`                       | `switch-focus-between-floating-and-tiling` | 在悬浮和平铺窗口间切换焦点                  |
| `Super + f`                           | `maximize-column`                          | 最大化当前列                         |
| `Super + Shift + f`                   | `fullscreen-window`                        | 切换窗口全屏                         |
| `Super + Ctrl + f`                    | `toggle-windowed-fullscreen`               | 切换窗口化全屏                        |
| `Super + c`                           | `center-column`                            | 居中当前列                          |
| `Super + Comma (,)`                   | `consume-window-into-column`               | 将窗口吸入当前列                       |
| `Super + Period (.)`                  | `expel-window-from-column`                 | 将窗口从当前列排出                      |
| `Super + r`                           | `switch-preset-column-width`               | 切换预设列宽                         |
| `Super + [Shift +] -`                 | `set-column-width "-10%"`                  | 减小列宽 (Shift: 窗口高度)             |
| `Super + [Shift +] =`                 | `set-column-width "+10%"`                  | 增加列宽 (Shift: 窗口高度)             |
| **导航**                                |                                            |                                |
| `Super + {h, j, k, l}`                | `focus-*`                                  | 聚焦列/显示器 (h/l) 或 窗口/工作区 (j/k)   |
| `Super + {Left, Down, Up, Right}`     | `focus-column-*`                           | 按方向聚焦列                         |
| `Super + Shift + {h, j, k, l}`        | `move-*`                                   | 按方向移动列/窗口                      |
| `Super + Ctrl + {h, j, k, l}`         | `focus-monitor-*`                          | 按方向聚焦显示器                       |
| `Super + Shift + Ctrl + {h, j, k, l}` | `move-window-to-monitor-*`                 | 将窗口移动到指定方向的显示器                 |
| `Super + [Shift +] 1-9`               | `focus/move-to-workspace`                  | 聚焦或移动窗口到工作区 1-9                |
| **悬浮窗口**                              |                                            |                                |
| `Super + Alt + {h, j, k, l}`          | `move-floating-window`                     | 精确移动悬浮窗口                       |
| **实用工具**                              |                                            |                                |
| `Super + n`                           | `nautilus`                                 | 打开文件管理器 (Nautilus)             |
| `Print`                               | `screenshot`                               | 全屏截图                           |
| `Ctrl + Print`                        | `screenshot-screen`                        | 屏幕截图                           |
| `Alt + Print`                         | `screenshot-window`                        | 窗口截图                           |
| `Super + Ctrl + c`                    | *Script*                                   | 取色并复制 Hex 代码到剪贴板               |
| **投屏 (Screencasting)**                |                                            |                                |
| `Super + Alt + m`                     | `set-dynamic-cast-monitor`                 | 设置动态投屏监视器                      |
| `Super + Alt + w`                     | `set-dynamic-cast-window`                  | 设置动态投屏窗口                       |
| `Super + Alt + n`                     | `clear-dynamic-cast-target`                | 清除动态投屏目标                       |