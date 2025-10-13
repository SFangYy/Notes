---
Project:
  - LearnTools
description:
tags:
  - git
  - xspdb
created: 2025-07-30 | 15:30
parent: Resource
---
# 002-Browser
让我们一步步操作，将 fork 的仓库与原仓库同步：

- 首先添加原仓库（upstream）：
```bash

# 查看当前远程仓库
git remote -v

# 添加原仓库作为 upstream
git remote add upstream https://github.com/原作者/仓库名.git
# 或使用 SSH
git remote add upstream git@github.com:原作者/仓库名.git

git remote add upstream https://github.com/EdenQwQ/nixos.git
```



- 获取原仓库的最新代码：
```bash
# 获取原仓库的所有分支
git fetch upstream

# 确保你在正确的分支上：
# 查看当前分支
git branch

# 如果需要切换分支
git checkout main  # 或 master，取决于你的主分支名称
```


bash

    1
    2
    3
    4
    5

- 合并原仓库的更新：
```bash
# 合并 upstream 的 main 分支
git merge upstream/main

# 如果出现冲突，解决步骤：

# 查看冲突文件：

git status

# 解决冲突后：

# 添加修改
git add .

# 提交修改
git commit -m "resolve merge conflicts"
```

- 推送到你的仓库：
```

git push origin main


其他有用的命令：

    如果想放弃合并：

git merge --abort

    如果想查看具体更改：

```

    
# 查看未合并的更改
```bash
git diff upstream/main


# 如果想使用原仓库的版本：
git checkout --theirs .
git add .
git commit -m "sync with upstream"

#     如果想使用自己的版本：

git checkout --ours .
git add .
git commit -m "keep local changes"

```

git diff upstream/main


建议：

    合并前最好先创建一个新分支
    定期同步以避免出现大量冲突
    有重要修改时先备份
