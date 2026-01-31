---
Project:
  - undefined
description:
tags:
  - linux
  - nixos
created: 2025-09-07 | 15:51
parent: Resource
---
# 003-GPT
# Flake
## 配置input
```
# flake.nix
{
  inputs = {
    nixpkgs-stable.url = "github:NixOS/nixpkgs/nixos-25.05";
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable-small";
    # --- 只需要这一个输入 ---
    # 它会自动处理从 YalTeR/niri 拉取最新源码
    niri-flake = {
      url = "github:sodiboo/niri-flake";
    };
  };

  # ... outputs 部分见下方 ...
}
```

## 配置output
- 使用`flake-part`和原生配置flake的方式有所不同
- 通常定义在`hosts/default`下
```
# ./flake.nix

  outputs =
    {
      self,
      nixpkgs,
      ...
    }@inputs:
    inputs.flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [ "x86_64-linux" ];
      imports = [
        ./hosts
        inputs.treefmt-nix.flakeModule
        { _module.args = { inherit inputs self nixpkgs; }; }
      ];
      flake = {
        homeManagerModules = import ./modules/home-manager;
        overlays = import ./overlays { inherit inputs self; };
        templates = import ./templates;
      };
     perSystem =
        { pkgs, ... }:
        {
          packages = import ./pkgs { inherit pkgs; };
          treefmt = {
            projectRootFile = "flake.nix";
            programs.nixfmt.enable = true;
            programs.ruff-format.enable = true;
            programs.prettier.enable = true;
            programs.beautysh.enable = true;
            programs.toml-sort.enable = true;
            settings.global.excludes = [ "*.age" ];
            settings.formatter = {
              jsonc = {
                command = "${pkgs.nodePackages.prettier}/bin/prettier";
                includes = [ "*.jsonc" ];
              };
              scripts = {
                command = "${pkgs.beautysh}/bin/beautysh";
                includes = [ "*/scripts/*" ];
              };
            };
          };
        };
    };
```

```
hosts/default.nix 
  sharedOSModules = [
    ../os
    ../nix
    inputs.stylix.nixosModules.stylix
    inputs.niri-flake.nixosModules.niri
    #inputs.maomaowm.nixosModules.maomaowm
  ];

  sharedHomeModules = [
    ../home
    ../nix/nixpkgs.nix
    inputs.stylix.homeModules.stylix
    inputs.niri-flake.homeModules.niri
    inputs.nixvim.homeModules.nixvim
    inputs.agenix.homeManagerModules.default
    ../secrets/age.nix
    # inputs.maomaowm.hmModules.maomaowm
  ] ++ (builtins.attrValues self.homeManagerModules);
```


### 启动niri
```
os/programs/niri.nix
{
  programs.niri = {
    enable = true;
  };
}

```

# home-manager


```

```
