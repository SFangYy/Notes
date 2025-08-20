---
Project:
title: 
description: 
source: 
author: 
tags: 
created: 2025-08-20 | 21:47
parent: Resource
branch: 
---
# 003-GPT

# Git 提交记录精简与修改全流程

## 将多次 Git Commit 精简为几次

**User:** 我想将之前多次git commit提交记录精简为几个，要怎么做


### 将多次Git Commit精简为几次的实用指南

在软件开发过程中，我们常常会为了记录每一个微小的改动而进行频繁的`git commit`。这虽然保证了工作的可追溯性，但当一个功能开发完毕准备合并到主分支时，冗长而琐碎的提交历史会显得杂乱无章，不利于代码审查（Code Review）和后续的版本追溯。为了保持一个清晰、可读的提交历史，我们需要将这些零散的提交记录精 简为几个有意义的提交。本文将详细介绍如何使用 Git 的交互式变基（Interactive Rebase）功能来“压缩”你的提交记录。

#### 核心工具：`git rebase -i`

精简 commit 的核心命令是 `git rebase -i`，这里的 `-i` 代表 `--interactive`，即交互式的。这个命令允许你“回到过去”，重新编辑一系列的提交，包括修改、合并、拆分或者删除它们。

#### 操作步骤详解

假设你的提交历史如下，你希望将最近的三个提交合并成一个：

```bash 
git log --oneline 
c3f4e5a (HEAD -> feature-branch) Final tweaks 
b1d2c3d Add feature documentation 
a0b1c2d Implement the core feature 
d4e5f6g (main) Initial commit
```

1. **第一步：启动交互式变基**

```
git rebase -i HEAD~3

gir rebase -i d4e5f6g
```
显示内容如下
```bash 
pick a0b1c2d Implement the core feature 
pick b1d2c3d Add feature documentation 
pick c3f4e5a Final tweaks # Rebase d4e5f6g..c3f4e5a onto d4e5f6g (3 commands) # # Commands:
```
根据需要，修改pick为对应的命令
- s : squash 合并多次提交记录(squash) 会将这个 commit 合并到它的**前一个** commit 中。
- e : edit 可以重新添加文件，并编辑
- r: 仅修改提交内容

### seuash
本次调整需要将rebase的文件修改如下格式
```
pick a0b1c2d Implement the core feature  1 
s b1d2c3d Add feature documentation      2
pick c3f4e5a Final tweaks                3
pick c3f4e5a Final tweaks1               4

```

退出后，需要需要编辑1，2次提交合并后的commit信息

### edit
可以对本次提交的文件进行修改，还可以重新编辑此次的提交信息

## r 
在新弹出的窗口中编辑历史提交信息

## 
如果想要按照某种顺序将历史提交汇总起来，则可以通过使用 s 将所有的提交暂时合并为同一个提交，然后将将`HEAD` 指针指向上一次提交记录，之后重新提交每次的代码，具体操作如下

```
git rebase -i e7428cea4bb7a93b47fa12b4b0ff383da292db8a
```

```
pick <commit-1-sha> commit message 1 
pick <commit-2-sha> commit message 2 
pick <commit-3-sha> commit message 3 
pick <commit-4-sha> commit message 4 
pick <commit-5-sha> commit message 5 
pick <commit-6-sha> commit message 6 

修改为
pick <commit-1-sha> commit message 1 
s <commit-2-sha> commit message 2 
s <commit-3-sha> commit message 3 
s <commit-4-sha> commit message 4 
s <commit-5-sha> commit message 5 
s <commit-6-sha> commit message 6 
```
- 保存，退出

然后运行如下命令,执行软重置
`git reset HEAD~`

重置好后，头指针在commit0上，可以重新提交后续内容