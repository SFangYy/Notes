---
Project:
  - Unitychip
tags:
  - git
area: "[[工作]]"
---
# browser
### 1. 查看当前的远程仓库

要查看你的本地仓库关联了哪些远程仓库（以及对应的 URL），可以使用以下命令：

Bash

```
git remote -v
```

运行后你会看到类似这样的输出：

- **origin**: 远程仓库的默认名称。
    
- **fetch**: 用于拉取的地址。
    
- **push**: 用于推送的地址。
    

---

### 2. 拉取远程仓库的最新代码

拉取代码主要有两种方式，取决于你是否想自动合并到当前分支：

#### 方法 A：使用 `git pull`（最常用）

这个命令会自动下载远程代码并**立即尝试合并**到你当前所在的分支。

Bash

```
git pull origin <分支名称>
```

> **注意：** 如果你已经在该分支上，且已经设置了上游追踪，直接运行 `git pull` 即可。

#### 方法 B：使用 `git fetch` + `git merge`（更安全）

如果你想先看看远程有哪些更新，但不急着合并，可以分两步走：

1. **获取更新：** `git fetch origin`（这会将远程代码下载到本地仓库，但不会修改你目前的工作内容）。
    
2. **手动合并：** `git merge origin/<分支名称>`。

## 如果是fork 的其他仓库

### 1. 配置上游仓库 (只需执行一次)

首先，你需要告诉 Git 那个“原作者的仓库”地址在哪里。我们通常将其命名为 `upstream`。

Bash

```
# 将原作者的仓库地址添加为 upstream
git remote add upstream <原作者仓库的URL>
```

_例如：`git remote add upstream https://github.com/XS-MLVP/UCAgent.git`

添加完成后，你可以运行 `git remote -v` 确认，你应该能看到 `origin`（你自己的库）和 `upstream`（原作者的库）。

---

### 2. 获取并合并最新代码

当你想要同步时，执行以下命令：

Bash

```
# 1. 获取原仓库的所有更新
git fetch upstream

# 2. 确保你在自己想要同步的本地分支（比如 main 或 master）
git checkout main

# 3. 将原仓库的更新合并到你的本地分支
git merge upstream/main
```

---

### 3. 更新你自己的远程仓库 (Fork 库)

上面的操作只更新了你**电脑本地**的代码，你还需要将这些更新推送到你在 GitHub/Gitee 上的那个 Fork 库：

Bash

```
git push origin main
```

---

### 快速总结 (常用命令流)

配置好一次后，以后每次想同步只需执行：

1. `git fetch upstream`
    
2. `git merge upstream/main`
    
3. `git push origin main`

```
╰─ 󰈺  git push myrepo formal
Enumerating objects: 22, done.
Counting objects: 100% (22/22), done.
Delta compression using up to 16 threads
Compressing objects: 100% (18/18), done.
Writing objects: 100% (20/20), 34.42 KiB | 17.21 MiB/s, done.
Total 20 (delta 2), reused 1 (delta 0), pack-reused 0 (from 0)
remote: Resolving deltas: 100% (2/2), completed with 2 local objects.
remote: 
remote: Create a pull request for 'formal' on GitHub by visiting:
remote:      https://github.com/SFangYy/UCAgent/pull/new/formal
remote: 
To github.com:SFangYy/UCAgent.git
 * [new branch]      formal -> formal
```

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
	- `git merge upstream/main`i

## 将多个远程仓库的多条commit合并为一条
```
git merge --squash upstream/main
git commit -m "chore: merge upstream changes from A"
```

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
