---
Project:
  - LearnTools
title: act
description: 
source: 
author: 
tags:
  - git
created: 2025-07-07 | 10:54
parent: Resource
branch:
---
# Resources
1. add git remote repo
	- `git remote add upstream https://github.com/EdenQwQ/nixos.git`
2. list remote repo 
	- `git remote -v`
```
origin	https://github.com/SFangYy/nixos (fetch)
origin	https://github.com/SFangYy/nixos (push)
upstream	https://github.com/EdenQwQ/nixos.git (fetch)
upstream	https://github.com/EdenQwQ/nixos.git (push)
```

3. update repo
	- `git fetch upstream`

4. merge update
	- `git merge upstream/main`

before merge remote version you should commit your local change first
## nixos 
1. if conflict with flake.lock,you can delete it first,
	- `rm -rf flake.lock `
2. then genteate flake.lock by after git add 
```
git add . 
home-manager switch --flake .
nix flake update 
```

## updare diffteest
```
git remote add upstream https://github.com/OpenXiangShan/difftest.git

git remote -v

git fetch upstream

git merge upstream/master

# handle corrept

git commit


```

git merge upstream/master 时有报错说文件有冲突，要怎么处理呢

当执行 `git merge upstream/master` 遇到文件冲突时，可以按照以下步骤解决：

### 1. 首先查看冲突状态

bash

git status

这会显示哪些文件有冲突（标记为"both modified"）

### 2. 打开冲突文件手动解决

冲突部分会被标记为：

text

<<<<<<< HEAD
你的本地修改内容
=======
上游的修改内容
>>>>>>> upstream/master

手动编辑文件：

1. 删除 `<<<<<<<`，`=======` 和 `>>>>>>>` 这些标记行
    
2. 保留你想要的内容（或合并两者）
    
3. 保存文件
    

### 3. 标记冲突已解决

对每个解决完冲突的文件执行：

```bash

git add <文件名>
```

### 4. 完成合并


```bash

git commit
```

─ …/nixos    kxy_device  »(1)!(2)++(1)?(1) 󰋑                                                                                                                                                   13:07 󰧱 
╰─   git remote add upstream https://github.com/EdenQwQ/nixos.git

╭─ …/nixos    kxy_device  »(1)!(2)++(1)?(1) 󰋑                                                                                                                                                   13:09 󰧱 
╰─   git remote -v
origin	https://github.com/SFangYy/nixos (fetch)
origin	https://github.com/SFangYy/nixos (push)
upstream	https://github.com/EdenQwQ/nixos.git (fetch)
upstream	https://github.com/EdenQwQ/nixos.git (push)

╭─ …/nixos    kxy_device  »(1)!(2)++(1)?(1) 󰋑                                                                                                                                                   13:09 󰧱 
╰─   git fetch upstream
remote: Enumerating objects: 106, done.
remote: Counting objects: 100% (106/106), done.
remote: Compressing objects: 100% (29/29), done.
remote: Total 69 (delta 43), reused 60 (delta 37), pack-reused 0 (from 0)
Unpacking objects: 100% (69/69), 12.38 KiB | 65.00 KiB/s, done.
From https://github.com/EdenQwQ/nixos
 * [new branch]      main       -> upstream/main

╭─ …/nixos    kxy_device  ⇡(1)                                                                                                                                                                  13:16 󰧱 
╰─   git merge upstream/main
Auto-merging flake.lock
CONFLICT (content): Merge conflict in flake.lock
Auto-merging flake.nix
CONFLICT (content): Merge conflict in flake.nix
Auto-merging home/programs/browser/default.nix
CONFLICT (content): Merge conflict in home/programs/browser/default.nix
CONFLICT (modify/delete): home/programs/browser/zen.nix deleted in upstream/main and modified in HEAD.  Version HEAD of home/programs/browser/zen.nix left in tree.
Auto-merging home/programs/desktop/niri/default.nix
Auto-merging hosts/inspiron/home.nix
Auto-merging os/programs/default.nix
CONFLICT (content): Merge conflict in os/programs/default.nix
Auto-merging overlays/default.nix
Automatic merge failed; fix conflicts and then commit the result.

╭─ …/nixos    kxy_device  =++(18)⇡(1)                                                                                                                                                           13:16 󰧱 
╰─   nvim flake.nix 

╭─ …/nixos    kxy_device  =++(18)⇡(1)                                                                                                                                                           13:18 󰧱 
╰─   nvim flake.nix

╭─ …/nixos    kxy_device  =++(18)⇡(1)                                                                                                                                                           13:25 󰧱 
╰─   nvim home/programs/browser/default.nix 

╭─ …/nixos    kxy_device  =++(18)⇡(1)                                                                                                                                                           13:26 󰧱 
╰─   nvim os/programs/default.nix 

╭─ …/nixos    kxy_device  =++(18)⇡(1)                                                                                                                                                           13:28 󰧱 
╰─   ls home/programs/browser/zen.nix 
home/programs/browser/zen.nix

╭─ …/nixos    kxy_device  =++(18)⇡(1)                                                                                                                                                           13:28 󰧱 
╰─   nvim home/programs/browser/zen.nix

╭─ …/nixos    kxy_device  =++(18)⇡(1)                                                                                                                                                           13:28 󰧱 
╰─   git add .
