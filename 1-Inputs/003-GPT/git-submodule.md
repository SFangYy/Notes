---
Project:
  - BuildPdb
title: 
description: this file tell you how set and update a submodule
source: 
author: 
tags:
  - git
created: 2025-07-07 | 22:16
parent: Resource
branch:
---
# Resources
## 1. add submodules

git submodule add https://github.com/你的用戶名/你的私有倉庫.git path/to/submodule
git commit -m "添加私有子倉庫"
git push

### exist repo
if you want to change a exist folder in a repo to a submodule 
like`002-Area/009-repo`,you should 
1. 从暂存区移除路径
2. 清理工作目录
3. 重新添加子模块
```
git rm -r --cached 2-Areas/009-daily
rm -rf 2-Areas/009-daily
git submodule add git@github.com:SFangYy/Daily-Notes.git 2-Areas/009-daily
```

### example 
add exist obsidian config rep to Note

```
ls -a .obsidian
.git .gitignore  xxx

git submodule add git@github.com:SFangYy/obconfig.git .obsidian
Adding existing repo at '.obsidian' to the index

cat .gitmodules 
[submodule ".obsidian"]
	path = .obsidian
	url = git@github.com:SFangYy/obconfig.git

## use submodules

Git 子模块的设计理念是让主仓库精确地指向子模块的某个特定提交，而不是一个分支的最新状态。这保证了当你克隆主仓库时，所有子模块都会回到一个已知且稳定的状态，避免了子模块自动更新到最新版本可能带来的兼容性问题。

### how update a submodules
1. init
2. fetch 
3. checkout 

```


## 2. update submodule

更新到追踪分支的最新提交：
当 gitmodules 文件配置了 branch 选项后，你可以运行：

```Bash
git submodule update --remote # 这会更新所有追踪远程分支的子模块
# 或者只更新特定的子模块：
git submodule update --remote path/to/your/submodule

```
执行此命令后，Git 会拉取子模块远程分支的最新提交，并更新主仓库中子模块的引用。你同样需要 git add 和 git commit 主仓库的更改。

```bash
git checkout pdb
branch 'pdb' set up to track 'origin/pdb'.
Switched to a new branch 'pdb'

git submodule update --init --recursive difftest
Submodule 'difftest' (https://github.com/OpenXiangShan/difftest.git) registered for path 'difftest'
Cloning into '/home/sfangyy/work/pdb1/difftest'...
Submodule path 'difftest': checked out '2cbbfbc05945e37548b44c293913b638e38e0e40'

z difftest/
git fetch origin master
From https://github.com/OpenXiangShan/difftest
 * branch              master     -> FETCH_HEAD

git reset --hard  cf7e
HEAD is now at cf7e5105 fix(squash): exclude squashEnable update for FPGA (#634)

git add .
git commit -m 'add build xspdb ci'
pdb 5aee4a319 add build xspdb ci
 2 files changed, 68 insertions(+), 1 deletion(-)
 create mode 100644 .github/workflows/release_pdb.yml
 
```



```
`git submodule update --init difftest `

如果你想让子模块指向一个特定的提交（Commit SHA），通常的流程是这样的：

1. 进入子模块目录

首先，你需要进入到你想要修改的子模块的本地目录。
Bash

cd path/to/your/submodule

2. 切换到目标提交

在子模块目录中，使用 git checkout 命令切换到你想要的特定提交。你需要知道该提交的完整 SHA-1 哈希值（或者足够长能唯一标识的短哈希值）。
Bash

git checkout <specific_commit_sha>

示例：
Bash

git checkout a1b2c3d4e5f678901234567890abcdef12345678

执行这个命令后，子模块会进入“分离 HEAD (detached HEAD)”状态。这意味着你当前不再依附于任何分支，而是直接指向了一个提交。

3. 返回主仓库并提交更改

切换完子模块的提交后，你需要返回主仓库，并将子模块的这一更改记录下来。
Bash

cd ../.. # 返回到主仓库根目录
git add path/to/your/submodule # 将子模块的变化添加到暂存区
git commit -m "Update submodule <submodule_name> to specific commit <specific_commit_sha>"
git push # 推送主仓库的更改

重要提示：

    分离 HEAD (Detached HEAD)： 当你在子模块内 git checkout <specific_commit_sha> 后，子模块会处于“分离 HEAD”状态。这是正常的，因为子模块是由主仓库通过精确的提交哈希值来跟踪的，而不是通过分支。

    记录在主仓库： 关键是最后一步，你必须在主仓库中 git add 和 git commit 子模块的更改。这样，主仓库就会更新它所指向的子模块的提交哈希值。下次其他人克隆主仓库并运行 git submodule update 时，他们的子模块就会被拉取到你刚刚指定的那个精确提交。

如果你想让子模块追踪特定分支的最新提交

虽然子模块默认是追踪特定提交的，但如果你想让子模块自动更新到某个分支的最新提交，可以使用 git submodule set-branch 或 git submodule update --remote。

    设置追踪分支 (推荐，Git 2.8+):
    在主仓库目录中，你可以设置子模块追踪一个特定的分支。
    Bash

git submodule set-branch -b <branch_name> path/to/your/submodule
git add .gitmodules # 提交 .gitmodules 文件的修改
git commit -m "Set submodule to track <branch_name>"

更新到追踪分支的最新提交：
当 gitmodules 文件配置了 branch 选项后，你可以运行：
Bash

    git submodule update --remote # 这会更新所有追踪远程分支的子模块
    # 或者只更新特定的子模块：
    git submodule update --remote path/to/your/submodule

    执行此命令后，Git 会拉取子模块远程分支的最新提交，并更新主仓库中子模块的引用。你同样需要 git add 和 git commit 主仓库的更改。

选择哪种方法取决于你的需求：

    稳定性和可重复性（默认行为）：指向特定提交 SHA 是最可靠的方式，因为它确保每次构建都使用完全相同的代码。

    需要自动更新到最新功能：如果子模块是你的内部依赖，且你希望它总是使用最新版本，那么设置追踪分支并定期 git submodule update --remote 更方便。

通常，为了 CI/CD 的稳定性，推荐使用指向特定提交 SHA 的方式。