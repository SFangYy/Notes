---
Project:
  - LearnTools
description: 
tags:
  - git
created: 2025-07-30 | 15:20
parent: Resource
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




# Resources
if you push a error commit to  ,you can revert it first and then commit a new ,and then push it

好的，你遇到的这个问题很常见。Git 提供了几种方法来处理这种情况，但由于你已经 push 了，所以需要特别注意，特别是如果这是共享的分支。

核心原则：已经 push 的提交需要谨慎处理

一旦提交被 push 到远程仓库，其他协作者可能已经基于这个提交进行了工作。如果你**改写（rewrite）**了历史（例如，修改了已推送的 commit message 或删除了提交），就会导致其他人的本地仓库与远程仓库不一致，从而引发冲突和混乱。

因此，最安全的方法是使用 git revert。 如果你确定只有你一个人在这个分支上工作，或者你和你的团队都理解并同意强制推送的风险，那么也可以考虑 git reset 加 git push --force。

## 方法一：使用 git revert (推荐且安全)

> git revert 是最安全的方式，因为它不会改写历史。它会创建一个新的提交，这个新提交的作用是撤销之前那个错误提交的所有改动。

- 优点：
	- 安全： 不会改写历史，不会影响其他协作者。
	- 可追溯： 提交历史是线性的，可以看到每一次的改动和撤销。
- 缺点：
	- 会多一个“撤销”的提交，历史看起来可能稍微不那么“干净”。
- 步骤：
	- 找到要撤销的提交的哈希值（commit hash）：
	- `git log --oneline`
	- 你会看到类似这样的输出：
```
abcdefg (HEAD -> your-branch) 你的错误提交信息
hijklmn 上一个正确的提交
```

- 找到你的错误提交信息对应的哈希值（例如 abcdefg）。撤销该提交：

`git revert abcdefg`

执行这个命令后，Git 会打开一个编辑器，让你为这次“撤销”操作编写 commit message。默认的 message 会说明这是对哪个提交的 revert，你可以根据需要修改，然后保存并关闭编辑器。

- 推送这个撤销的提交
	- `git push origin your-branch`
- 现在，你的远程仓库会多出一个新的提交，这个提交会撤销你之前错误提交的所有文件改动，但那条错误的 commit message 依然会保留在历史记录中（只是被“抵消”了）。
- 重新提交你的改动（如果需要）：
    如果你的目的是修正 commit -m 里写错的内容，并且实际代码也需要调整，那么在 git revert 之后，你的工作区会回到错误提交之前的状态（或者说，是撤销后的状态）。你现在可以：
```
git add . (重新暂存所有改动)
git commit -m "新的正确提交信息"
git push origin your-branch
```

## 方法二：使用 git reset --hard + git push --force (慎用，可能改写历史)

这种方法会改写历史，将远程仓库的分支指针强制移回某个提交。这意味着错误的提交将从历史中“消失”。

优点：

    历史干净： 错误的提交会从历史中移除，就像从未发生过一样。

缺点：

    危险： 如果其他人在你 push 之后，基于你错误的提交进行了 pull 或 fetch，那么你强制推送后，他们的本地仓库会与远程仓库冲突，他们需要手动处理（例如 git pull --rebase 或 git reset --hard，这可能导致他们丢失未推送的工作）。

    不适合公共/共享分支： 除非你明确知道没有其他人会受影响，否则不要在共享分支上使用。

步骤：

    确保你的本地分支是最新的：
    Bash

git pull

找到要回退到的上一个正确提交的哈希值：
Bash

git log --oneline

假设你的提交历史是：

abcdefg (HEAD -> your-branch) 你的错误提交信息
hijklmn 上一个正确的提交 <-- 你想回退到这里
...

你需要找到 hijklmn 这个正确的提交的哈希值。

本地回退到上一个正确提交：
Bash

git reset --hard hijklmn

注意： git reset --hard 会丢弃 hijklmn 之后的所有本地改动和提交。如果你在错误提交之后还有未提交的本地修改，它们会被丢失！如果你只是想改 commit message，但代码是正确的，那么 git reset --soft 会更好（但之后还需要 git commit --amend）。为了简化，我们假设你只是想撤销那个错误的提交并重写。

强制推送到远程仓库：
Bash

    git push origin your-branch --force
    # 或者更安全的选项 (Git 2.10+):
    # git push origin your-branch --force-with-lease

    --force-with-lease 会检查远程分支是否在你上次 pull 之后被别人更新过。如果有，它会拒绝强制推送，从而避免覆盖别人的工作。如果没有，它会像 --force 一样强制推送。在团队协作中，如果必须强制推送，请优先使用 --force-with-lease。

    重新提交你的改动：
    现在你的本地仓库和远程仓库都回到了 hijklmn 提交后的状态。你需要重新执行你的修改，然后：

        git add .

        git commit -m "新的正确提交信息"

        git push origin your-branch

总结和建议

    如果你的分支是共享的，或者其他人可能已经 pull 了你的错误提交，强烈建议使用 git revert。 它虽然会增加一个“撤销”提交，但能最大程度地避免给团队带来麻烦。

    如果你确定你是一个人工作，或者这个分支是临时的，并且只有你一个人碰过，那么可以使用 git reset --hard + git push --force (--force-with-lease) 来清理历史。

在做任何 reset 或 revert 操作之前，最好先 git status 确认当前工作区是否干净，并且用 git log 仔细确认要操作的提交哈希。