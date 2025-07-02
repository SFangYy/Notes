---
Project: ["LearnTools"]
title: 
description: 
source: 
author: 
tags: 
created: 2025-06-30 | 15:29
parent: Resource
branch: 
---
# Resources


## Marp

由于核心插件幻灯片不如人意，所以第三方插件市场出现了一些 PPT 插件，其中比较著名的是基于 Marp 的 Markdown 转 PPT 插件。

![https://cdnfile.sspai.com/2025/03/08/article/0623576f91ef809cbd113c3fac79d711.png?imageView2/2/w/1120/q/90/interlace/1/ignore-error/1/format/webp](https://cdnfile.sspai.com/2025/03/08/article/0623576f91ef809cbd113c3fac79d711.png?imageView2/2/w/1120/q/90/interlace/1/ignore-error/1/format/webp)

相比起核心插件幻灯片，Marp Slides 支持实时预览，并且提供了丰富的导出选项（支持导出为PPT、PDF、PNG）。实时预览这个特性让我们可以实时地调整每一页内容的多少，不需要像幻灯片插件一样，整体演示的时候才知道哪些页面内容溢出了。 

![https://cdnfile.sspai.com/2025/03/08/article/c6745773d5ad8451a19973ecffb44b91.png?imageView2/2/w/1120/q/90/interlace/1/ignore-error/1/format/webp](https://cdnfile.sspai.com/2025/03/08/article/c6745773d5ad8451a19973ecffb44b91.png?imageView2/2/w/1120/q/90/interlace/1/ignore-error/1/format/webp)

![https://cdnfile.sspai.com/2025/03/08/article/3cc5dab514017c3ad00d3b4d8703aa2f.png?imageView2/2/w/1120/q/90/interlace/1/ignore-error/1/format/webp](https://cdnfile.sspai.com/2025/03/08/article/3cc5dab514017c3ad00d3b4d8703aa2f.png?imageView2/2/w/1120/q/90/interlace/1/ignore-error/1/format/webp)

![https://cdnfile.sspai.com/2025/03/08/article/990058ece9835d0337a841fb82b12023.png?imageView2/2/w/1120/q/90/interlace/1/ignore-error/1/format/webp](https://cdnfile.sspai.com/2025/03/08/article/990058ece9835d0337a841fb82b12023.png?imageView2/2/w/1120/q/90/interlace/1/ignore-error/1/format/webp)

![https://cdnfile.sspai.com/2025/03/08/article/5141999ddd500c13c40b01d57ac9044f.png?imageView2/2/w/1120/q/90/interlace/1/ignore-error/1/format/webp](https://cdnfile.sspai.com/2025/03/08/article/5141999ddd500c13c40b01d57ac9044f.png?imageView2/2/w/1120/q/90/interlace/1/ignore-error/1/format/webp)

Marp Slides 支持使用自定义主题。只需要下载你需要的主题`.scss`文件，之后在属性中选择使用的主题即可。

![https://cdnfile.sspai.com/2025/03/08/article/133ac233be31eacc99e8fff58b88602b.png?imageView2/2/w/1120/q/90/interlace/1/ignore-error/1/format/webp](https://cdnfile.sspai.com/2025/03/08/article/133ac233be31eacc99e8fff58b88602b.png?imageView2/2/w/1120/q/90/interlace/1/ignore-error/1/format/webp)

使用主题后的效果：

![https://cdnfile.sspai.com/2025/03/08/article/00f8ed80a69200f4ff038997dc7a6e04.png?imageView2/2/w/1120/q/90/interlace/1/ignore-error/1/format/webp](https://cdnfile.sspai.com/2025/03/08/article/00f8ed80a69200f4ff038997dc7a6e04.png?imageView2/2/w/1120/q/90/interlace/1/ignore-error/1/format/webp)

我这里使用的主题来自 [Awesome Marp](https://github.com/favourhong/Awesome-Marp)，其提供了一整套相关 Marp 主题，并且配合 Marp 的特殊 Markdown 语法可以做出样式丰富、风格统一的 PPT。由于我只想在 PPT 上偷懒，我提供的案例并不能显露出 Marp 排版以及 Awesome Marp 的强大能力，这里我直接援引 Awesome Marp 作者的 PPT 展示：

![https://cdnfile.sspai.com/2025/03/08/article/f03ca8b35c5389d83d3f9d313152a297.png?imageView2/2/w/1120/q/90/interlace/1/ignore-error/1/format/webp](https://cdnfile.sspai.com/2025/03/08/article/f03ca8b35c5389d83d3f9d313152a297.png?imageView2/2/w/1120/q/90/interlace/1/ignore-error/1/format/webp)

![https://cdnfile.sspai.com/2025/03/08/article/aa6b2c65604a552f82c15f20e6221f04.png?imageView2/2/w/1120/q/90/interlace/1/ignore-error/1/format/webp](https://cdnfile.sspai.com/2025/03/08/article/aa6b2c65604a552f82c15f20e6221f04.png?imageView2/2/w/1120/q/90/interlace/1/ignore-error/1/format/webp)

![https://cdnfile.sspai.com/2025/03/08/article/c88ffe1d112c503d4f86e6481e18ed98.png?imageView2/2/w/1120/q/90/interlace/1/ignore-error/1/format/webp](https://cdnfile.sspai.com/2025/03/08/article/c88ffe1d112c503d4f86e6481e18ed98.png?imageView2/2/w/1120/q/90/interlace/1/ignore-error/1/format/webp)

就我个人体验而言，Marp Slides 有一个比较严重的 bug，那就是在尚未配置好导出选项的时候按下右上角四个键会**一键删除当前文件**。如果没有备份机制的话，这样的 bug 会造成一定的损失。由此可见，这个插件尚不算非常完善，有待后续进一步更新。

## use marp cli 
- install nodejs first then install marp-cli
```
# ~/.config/home-manager/home.nix 或 ~/.config/nixpkgs/home.nix

{ config, pkgs, ... }:

{
  home.username = "你的用户名"; # 替换为你的实际用户名
  home.homeDirectory = "/home/你的用户名"; # 替换为你的实际主目录

  # 添加你希望安装的软件包
  home.packages = with pkgs; [
    # ... 其他你已经安装的包 ...
    nodejs_20. # 关键在这里！Nix 会自动处理 Node.js 依赖
    marp-cli
  ];

  # ... 其他 Home Manager 配置 ...

  # 如果你想让这些包的manpages可用
  home.sessionVariables = {
    MANPATH = "${pkgs.nodePackages.marp-cli}/share/man${pkgs.lib.optionalString stdenv.isLinux ":/usr/local/share/man"}";
  };
}
```

- in your markdown folder ,run this command
	- `marp --server .`
- config themes
	- 

```
npm install -g @marp-team/marp-cli

```