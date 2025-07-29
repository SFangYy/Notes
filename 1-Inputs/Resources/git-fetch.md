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
