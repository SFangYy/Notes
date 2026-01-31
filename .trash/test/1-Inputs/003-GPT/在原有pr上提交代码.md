---
Project: ["undefined"]
description: 
tags: 
created: 2025-09-07 | 17:24
parent: Resource
---
# 003-GPT
```
git clone https://github.com/your-username/repo.git 
cd repo
```
#### 步骤 2: 添加原始仓库为 "upstream" 远程源

为了能够获取原始仓库的最新代码，包括您之前 PR 的信息，需要将它添加为一个远程源，通常我们将其命名为 `upstream`。
```
git remote add upstream https://github.com/upstream/repo.git
```

#### 步骤 3: 拉取 (Fetch) 原始 PR 的数据到本地

这是最关键的一步。GitHub 会为每个 PR 创建一个特殊的引用（ref），我们可以通过它直接拉取到那个 PR 的所有代码。
```
# 语法: git fetch <远程源> pull/<PR号>/head:<本地新分支名> git fetch upstream pull/123/head:feature-branch
```
- `upstream`: 我们刚刚设置的原始仓库。
- `pull/123/head`: 指向 PR #123 的头部提交。请将 `123` 换成您的 PR 号。
- `:feature-branch`:冒号后面的 `feature-branch` 是我们想在本地创建的分支名。**强烈建议使用和您原始 PR 完全相同的分支名**，这会让后续操作更简单。

#### 步骤 4: 切换到该分支并继续工作

```
# ... 进行代码修改 ...
git add .
git commit -m "这里是我的新提交"

# 或者，如果您想修改之前的提交，可以使用 rebase
# git rebase -i HEAD~3
# ... 修改后保存 ...
```

#### push
当您完成所有修改后，需要将这个分支推送到您的**新 fork** (`origin`)。因为您的新 fork 上还没有这个分支，或者即使有也和本地的不一样，所以您可能需要**强制推送**。
```
# 使用 -f 或 --force 进行强制推送 git push origin feature-branch --force
```