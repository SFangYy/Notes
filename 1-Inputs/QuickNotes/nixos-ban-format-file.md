---
Project: ["LearnTools"]
title: 
description: 
source: 
author: 
tags: 
created: 2025-07-02 | 19:40
parent: Resource
branch: 
---
# QuickNotes
### 1. 禁用 `conform-nvim` 对 YAML 文件的格式化

这是最直接的解决方案，你可以将 `formatters_by_ft.yaml` 设置为空列表，这样 `conform-nvim` 就不会对 `.yaml` 文件应用任何格式化器。

在你的 `lsp.nix` 文件中，找到 `plugins.conform-nvim.settings.formatters_by_ft.yaml`，并将其修改为：

### 3. 配置 `yamlfmt` 避免折叠多行字符串 (高级)

如果上述方法都不能完全满足你的需求，或者你仍然希望使用 `yamlfmt` 但避免它折叠多行字符串，你需要研究 `yamlfmt` 的具体配置选项。

通常，`yamlfmt` 或其他 YAML 格式化工具会有配置选项来控制如何处理多行字符串（例如，是否使用字面量风格 `|` 或折叠风格 `>`）。你可能需要在你的 Nixvim 配置中，为 `yamlfmt` 添加额外的参数，或者在你的项目中创建一个 `yamlfmt` 的配置文件（例如 `.yamlfmt`）。

但是，考虑到你描述的问题，最简单有效的方法就是 **禁用 `conform-nvim` 对 YAML 文件的自动格式化**，因为这种转换多行到单行的行为在 `YAML` 文件中通常是不希望发生的。


