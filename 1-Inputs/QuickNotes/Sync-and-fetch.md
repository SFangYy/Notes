---
Project: ["LearnIOTO"]
---
# QuickNotes
1. add uptream rep
2. list rep
3. merge update from 

```
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

## nixos 
rm -rf flake.lock 

nix flake update
```