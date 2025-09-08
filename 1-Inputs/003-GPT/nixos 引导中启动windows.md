---
Project: ["undefined"]
description: 
tags: 
created: 2025-09-07 | 16:54
parent: Resource
---
# 003-GPT
1. 查看windows引导在哪`lsblk -f`
```
NAME FSTYPE FSVER LABEL UUID FSAVAIL FSUSE% MOUNTPOINTS
nvme1n1
├─nvme1n1p1 vfat FAT32 F8FA-B2AD 589.6M 42% /boot
├─nvme1n1p2 ext4 1.0 c266b765-d5f7-4506-8e4d-45877edfa252 344.2G 20% /nix/store
│ /
└─nvme1n1p3 swap 1 swap 6f65179b-a236-4503-b03f-f55e69ee3a45 [SWAP]

nvme0n1
├─nvme0n1p1 vfat FAT32 6830-F889
├─nvme0n1p2
├─nvme0n1p3 ntfs AA04336804333723
├─nvme0n1p4 ntfs Data 3CE4954BE49507F2
└─nvme0n1p5 ntfs 8874874074872FCC
```

2. 在硬件配置中 添加windows引导所在的硬盘
3. 为boot添加额外引导
```
hosts/inspiron/hardware-configuration.nix

fileSystems."/boot/windows" = {
      device = "/dev/disk/by-uuid/6830-F889"; # <--- 我们从 lsblk 找到的 Windows ESP 的 UUID
      fsType = "vfat";
      options = [ "nofail" ];
    };
```

```
os/system/boot.nix
{ inputs, pkgs, ... }:
{
  boot = {
    kernelPackages = inputs.nixpkgs-stable.legacyPackages.${pkgs.system}.linuxPackages_zen;
    kernelParams = [
      "loglevel=3"
      "quiet"
      "spash"
      "console=tty1"
    ];
    consoleLogLevel = 0;
    initrd.verbose = false;
    loader = {
      systemd-boot.enable = false;

      #efi.canTouchEfiVariables = true;

      efi.efiSysMountPoint = "/boot";
      grub = {
        enable = true;
      
      # 3. 设置 GRUB 安装的硬盘
      # GRUB 需要被安装到硬盘的主引导记录(MBR/GPT)上。
      # 根据您的 lsblk 输出，NixOS 在 nvme1n1 上，所以我们指向这块硬盘。
        device = "/dev/nvme1n1"; # 注意：是整个硬盘，而不是分区(如 /dev/nvme1n1p1)

      # 4. 启用 os-prober 来自动检测 Windows (最关键的一步)
        useOSProber = true;
      
      # 5. (可选但推荐) 确保 GRUB 为 UEFI 模式安装
      # 既然您之前在使用 systemd-boot，那么系统肯定是 UEFI 模式。
        efiSupport = true;
        #efiSysMountPoint = "/boot";
    };
    };
    plymouth.enable = true;
  };
}
```
