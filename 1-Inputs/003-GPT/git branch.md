---
Project:
  - BuildPdb
title:
description:
tags:
  - git
  - xspdb
created: 2025-07-08 | 11:09
parent: Resource
---
# Resources
在GitHub上，如果你希望将主分支（通常称为`main`或`master`，取决于你的仓库设置）上的内容同步到子分支（例如`feature`分支），有几种方法可以实现这一点。这里介绍几种常见的方法：

### 方法1：使用Git命令行

1. **切换到子分支**：
    

- ```bash
    git checkout feature
    ```
    
- **从主分支拉取最新的更改**：
    

```bash
git pull origin main
```

或者，如果你使用的是默认的`master`分支，可以使用：

- ```bash
    git pull origin master
    ```
    
- **如果有冲突，解决冲突**：
    
    如果有合并冲突，Git会提示你解决它们。解决完冲突后，你需要：
    
- ```bash
    git add .git commit -m "解决合并冲突"
    ```
    
- **将更改推送到远程子分支**：
    

1. 
```bash
    git push origin feature
    ```
## conflict with submodule
```
From https://github.com/SFangYy/XiangShan
 * branch                master     -> FETCH_HEAD
Auto-merging Makefile
Failed to merge submodule difftest (not checked out)
CONFLICT (submodule): Merge conflict in difftest
hint: Recursive merging with submodules currently only supports trivial cases.
hint: Please manually handle the merging of each conflicted submodule.
hint: This can be accomplished with the following steps:
hint:  - come back to superproject and run:
hint:
hint:       git add difftest
hint:
hint:    to record the above merge or update
hint:  - resolve any other conflicts in the superproject
hint:  - commit the resulting index in the superproject
hint:
hint: Disable this message with "git config set advice.submoduleMergeConflict false"
```