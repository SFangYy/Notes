---
Project:
  - LearnTools
title: 
description: 
source: 
author: 
tags:
  - git
created: 2025-07-30 | 15:20
parent: Resource
branch:
---
# 002-Browser
git 撤销到某个commit

在Git中，如果你想要撤销到某个特定的commit，有几种不同的方法可以实现这一目的。下面是一些常见的方法：

### 1. 使用 `git reset`
`git reset` 命令可以用来将HEAD指向特定的commit，并且可以选择性地保留工作目录和暂存区的更改。
-  使用`HEAD~1`可以快速回到上一个commit
- **移动HEAD到指定的commit，并保留工作目录和暂存区的更改：**
    
```bash
    git reset --soft <commit-hash>
    这不会改变工作目录或暂存区的文件。
```
- **移动HEAD到指定的commit，并重置暂存区但不改变工作目录：**
    
 ```bash
    git reset --mixed <commit-hash>

    这是默认选项，等同于 `git reset <commit-hash>`。
```

- **移动HEAD到指定的commit，并重置工作目录和暂存区：**
	

```bash
    git reset --hard <commit-hash>
    这会丢失所有未提交的更改。
    git reset --hard HEAD~1
```
    
### 2. 使用 `git revert`

如果你想要撤销某个commit的更改，但保留历史记录，可以使用 `git revert`。这个命令会创建一个新的commit，这个新的commit是用来撤销之前的更改。

```bash
git revert <commit-hash>
```

如果你需要撤销一系列的commit，可以使用：

```bash
git revert <commit-hash-1>..<commit-hash-2>
```

这会创建一个新的commit来撤销从`<commit-hash-1>`到`<commit-hash-2>`之间的所有更改。

### 3. 使用 `git checkout`

如果你只是想回到某个特定的commit，并且不关心之后的提交记录，可以使用 `git checkout`。但是，请注意，这种方法不会改变历史记录。

```bash
git checkout <commit-hash>
```

这会将HEAD指向指定的commit，但是你仍然在一个“分离HEAD”的状态。如果你想在这个点上创建一个新的分支，可以使用：

```bash
git checkout -b <new-branch-name>
```

这样，你就可以在新的分支上继续工作，而不会影响到主分支的历史。

### 4. 使用 `git switch` (Git 2.23及以上版本)

如果你使用的是Git 2.23或更高版本，可以使用 `git switch` 来切换分支或检出特定的commit。

```bash
git switch --detach <commit-hash>
```

这会让你处于一个“分离HEAD”的状态，类似于使用 `git checkout`。如果你想基于这个点创建一个新分支，可以这样做：

```bash
git switch -c <new-branch-name>
```

选择哪种方法取决于你的具体需求：是否需要保留历史记录、是否需要保留工作目录中的更改等。通常，`git reset --hard` 和 `git revert` 是最常用的两种方法。