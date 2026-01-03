---
Project:
  - LearnTools
description:
tags:
  - vim
created: 2025-07-05 | 23:30
parent: Resource
---
# Resources
## some useful hotkey 
- `:bd`: delete current buffer 
- `Ctrl + h/l`: move a shiftwidth
- 匹配模式下
	- `n`: 跳转到下一个匹配项
	- `shift + n`: 跳转到上一个匹配项
```
{ config, pkgs, lib, ... }:

{
  programs.nixvim = {
    enable = true;
    # ... 其他 Nixvim 配置

    keymaps = [
      # --- 插入模式下的移动 (来自上一个回答，保留以便完整性) ---
      {
        mode = "i";
        key = "<C-h>"; # 示例：使用 Ctrl+h 作为你的键
        action = "<Left>";
        options = {
          desc = "在插入模式下向左移动";
        };
      }
      {
        mode = "i";
        key = "<C-j>"; # 示例：使用 Ctrl+j 作为你的键
        action = "<Down>";
        options = {
          desc = "在插入模式下向下移动";
        };
      }
      {
        mode = "i";
        key = "<C-k>"; # 示例：使用 Ctrl+k 作为你的键
        action = "<Up>";
        options = {
          desc = "在插入模式下向上移动";
        };
      }
      {
        mode = "i";
        key = "<C-l>"; # 示例：使用 Ctrl+l 作为你的键
        action = "<Right>";
        options = {
          desc = "在插入模式下向右移动";
        };
      }

      # --- 快速删除键位 (普通模式) ---
      {
        mode = "n"; # 普通模式
        key = "<leader>dw"; # 删除当前光标到下一个单词开头
        action = "dw";
        options = {
          desc = "删除单词";
        };
      }
      {
        mode = "n";
        key = "<leader>dW"; # 删除当前光标到下一个大单词开头 (忽略标点)
        action = "dW";
        options = {
          desc = "删除大单词";
        };
      }
      {
        mode = "n";
        key = "<leader>dl"; # 删除当前行（不包括换行符）
        action = "dd"; # 'dd' 是删除整行，'dl' 通常是删除字符
        options = {
          desc = "删除当前行";
        };
      }
      {
        mode = "n";
        key = "<leader>d$"; # 删除当前光标到行尾
        action = "d$";
        options = {
          desc = "删除到行尾";
        };
      }
      {
        mode = "n";
        key = "<leader>d0"; # 删除当前光标到行首
        action = "d0";
        options = {
          desc = "删除到行首";
        };
      }
      # 更多删除操作，例如删除括号内的内容
      {
        mode = "n";
        key = "<leader>di("; # 删除括号内的内容 (包括括号)
        action = "di(";
        options = {
          desc = "删除括号内内容";
        };
      }
      {
        mode = "n";
        key = "<leader>da{"; # 删除花括号内的内容 (包括花括号)
        action = "da{";
        options = {
          desc = "删除花括号内内容";
        };
      }


      # --- 快速跳转键位 (普通模式) ---
      {
        mode = "n";
        key = "<leader>h"; # 跳转到行首 (等同于 0)
        action = "0";
        options = {
          desc = "跳转到行首";
        };
      }
      {
        mode = "n";
        key = "<leader>l"; # 跳转到行尾 (等同于 $)
        action = "$";
        options = {
          desc = "跳转到行尾";
        };
      }
      {
        mode = "n";
        key = "<leader>w"; # 跳转到下一个单词开头
        action = "w";
        options = {
          desc = "跳转到下一个单词";
        };
      }
      {
        mode = "n";
        key = "<leader>b"; # 跳转到上一个单词开头
        action = "b";
        options = {
          desc = "跳转到上一个单词";
        };
      }
      {
        mode = "n";
        key = "<leader>e"; # 跳转到当前或下一个单词的结尾
        action = "e";
        options = {
          desc = "跳转到单词结尾";
        };
      }
      {
        mode = "n";
        key = "<leader>gg"; # 跳转到文件开头
        action = "gg";
        options = {
          desc = "跳转到文件开头";
        };
      }
      {
        mode = "n";
        key = "<leader>G"; # 跳转到文件结尾
        action = "G";
        options = {
          desc = "跳转到文件结尾";
        };
      }
      # 查找字符跳转
      {
        mode = "n";
        key = "<leader>f"; # 查找当前行中的字符 (f 后面跟字符)
        action = "f"; # 'f' 是操作符，需要输入一个字符
        options = {
          desc = "查找当前行中的字符";
        };
      }
      {
        mode = "n";
        key = "<leader>t"; # 跳转到当前行中指定字符的前一个字符 (t 后面跟字符)
        action = "t"; # 't' 是操作符，需要输入一个字符
        options = {
          desc = "跳转到指定字符前";
        };
      }
    ];
  };
}
```
