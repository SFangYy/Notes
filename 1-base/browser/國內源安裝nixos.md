---
Project:
  - Tools
url: https://www.bilibili.com/video/BV1KfiuBhE6i
---
# browser
### NixOS 完整安装过程（针对国内网络加速版）

  

以下是从零开始、在国内网络环境下快速安装 NixOS 的完整、详细步骤。当前（2025 年 12 月 31 日）最新稳定版为 **NixOS 25.11**（25.05 已于今日正式 EOL，不再接收安全更新）。整个过程假设 UEFI 系统（最常见），并优先使用国内镜像加速下载。

  

#### 1. 下载 NixOS ISO（推荐用国内镜像站）

直接从国内镜像下载最新 ISO，避免官网下载慢：

  

- 清华大学 TUNA：https://mirrors.tuna.tsinghua.edu.cn/nixos/iso/

- 上海交大 SJTU：https://mirror.sjtu.edu.cn/nixos/iso/

- 其他镜像站搜索 “NixOS ISO 镜像”

  

推荐选择：

- `nixos-plasma6-*.iso`（KDE Plasma 桌面，图形化友好）

- 或 `nixos-gnome-*.iso`（GNOME 桌面）

- 或 `nixos-minimal-*.iso`（最小化，体积小，适合服务器或手动加桌面）

  

下载后验证 SHA256 校验和（镜像站通常提供，与官网一致）。

  

#### 2. 制作启动 U 盘

```bash

# Linux 下

sudo dd if=nixos-xxx.iso of=/dev/sdX status=progress && sync

# sdX 换成你的 U 盘设备（用 lsblk 查看，千万别选错！）

  

# Windows 用 Rufus 或 Ventoy

```

  

#### 3. 进入 Live 系统

- 插入 U 盘，重启电脑，进入 BIOS 设置启动顺序（U 盘优先）。

- 选择 “NixOS Installer” 启动。

- 进入后先联网（图形化 ISO 会自动弹出网络管理器）：

- KDE：右下角网络图标 → 连接 Wi-Fi 或有线。

- 或终端用：`nmtui` 配置网络。

  

#### 4. 分区与挂载（UEFI + ext4 示例，推荐方案）

推荐最简单、官方默认的 **双分区方案**（适用于大多数桌面/笔记本）：

  

- **分区 1：EFI 系统分区（ESP）**

大小：512 MiB ~ 1 GiB（512 MiB 足够）

类型：EFI System（文件系统 FAT32）

挂载点：**/boot**（NixOS 特色，整个 EFI 分区直接作为 /boot）

  

- **分区 2：根分区（/）**

大小：剩余全部空间

类型：Linux filesystem（推荐 ext4，也可 btrfs/zfs）

挂载点：/

  

**操作步骤**（推荐图形化工具，更安全直观）：

  

1. 查看磁盘（确认目标磁盘，如 /dev/sda，千万别选错！）

```bash

lsblk -f

```

  

2. 推荐：用图形工具分区（Plasma/GNOME ISO 自带）

- KDE：搜索打开 “Partition Manager”

- 或运行：sudo nix-shell -p gparted && sudo gparted（更专业）

- 操作：

- 创建 GPT 分区表（UEFI 必须）。

- 新建 EFI 分区：512M，文件系统 vfat/FAT32，旗标 boot + esp。

- 新建根分区：剩余空间，文件系统 ext4。

- 应用更改。

  

3. 命令行格式化（假设 EFI 为 /dev/sda1，根为 /dev/sda2）

  

```bash

sudo mkfs.fat -F32 /dev/sda1 # EFI 分区

sudo mkfs.ext4 -L nixos /dev/sda2 # 根分区（可选加标签）

```

  

4. 挂载分区

```bash

sudo mount /dev/sda2 /mnt # 先挂载根分区

  

sudo mkdir -p /mnt/boot

sudo mount /dev/sda1 /mnt/boot # EFI 分区挂载到 /boot

```

  

（可选：加 swap 分区，如 /dev/sda3：`sudo mkswap /dev/sda3 && sudo swapon /dev/sda3`）

  

#### 5. 在安装前配置国内加速

```bash

sudo mkdir -p /etc/nix

sudo tee /etc/nix/nix.conf <<EOF

experimental-features = nix-command flakes

substituters = https://mirrors.tuna.tsinghua.edu.cn/nix-channels/store https://cache.nixos.org/

trusted-public-keys = cache.nixos.org-1:6NCHdD59X431o0gWypbMrAURkbJ16ZPMQFGspcDShjY=

EOF

```

  

#### 6. 生成初始配置文件

```bash

sudo nixos-generate-config --root /mnt

```

  

会在 `/mnt/etc/nixos/` 生成 `hardware-configuration.nix` 和 `configuration.nix`。

  

#### 7. 编辑主配置文件（最小实用版 + 国内加速）

```bash

sudo nano /mnt/etc/nixos/configuration.nix

```

  

**全部替换为以下内容**（根据需要修改用户名、桌面等）：

```nix
{ config, pkgs, ... }:

{
  imports = [ ./hardware-configuration.nix ];

  # Bootloader（UEFI 默认）
  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;

  # 主机名与网络
  networking.hostName = "inspiron";                  # 改成你喜欢的
  networking.networkmanager.enable = true;

  # 时区与中文支持
  time.timeZone = "Asia/Shanghai";
  i18n.defaultLocale = "zh_CN.UTF-8";
  console = {
    font = "${pkgs.terminus_font}/share/consolefonts/ter-u28n.psf.gz";
    useXkbConfig = true;
  };

  # 国内加速（永久生效）
nix.settings = {
  substituters = [
    "https://mirrors.ustc.edu.cn/nix-channels/store"     # 中科大（可优先）
    "https://mirrors.tuna.tsinghua.edu.cn/nix-channels/store"  # 清华
    "https://cache.nixos.org/"
  ];
  trusted-public-keys = [
    "cache.nixos.org-1:6NCHdD59X431o0gWypbMrAURkbJ16ZPMQFGspcDShjY="
  ];
};

nix.settings.experimental-features = [
    "nix-command"
    "flakes"
    "pipe-operators"  # <--- 添加这一行
  ];

  # 普通用户（务必改用户名和初始密码）
  users.users.sfangyy = {                            # ← 改成你的用户名
    isNormalUser = true;
    extraGroups = [ "wheel" "networkmanager" ];
    initialPassword = "123qwe";                 # 登录后立即改密码！
  };

  # 基本软件包
  environment.systemPackages = with pkgs; [
    vim git wget curl nodejs localsend
  ];

  programs.clash-verge = {
    enable=true;
    package = pkgs.clash-verge-rev;
    tunMode=true;
  };
  systemd.services.clash-verge-service = {
    description = "Clash Verge Service Mode";
    wantedBy = [ "multi-user.target" ];
    serviceConfig = {
      ExecStart = "${pkgs.clash-verge-rev}/bin/clash-verge-service"; # 注意检查路径是否存在
      Restart = "always";
      User = "root"; # 服务模式必须 root 运行
    };
  };

  boot.kernelModules = ["tun"];

  # 桌面环境（根据下载的 ISO 启用一个）
  
  # KDE Plasma
  # services.desktopManager.plasma6.enable = true;

  # GNOME（GNOME ISO 用）
   services.xserver.enable = true;
   services.displayManager.gdm.enable = true;
   services.desktopManager.gnome.enable = true;

  # SSH 服务
  services.openssh.enable = true;

  # 系统版本（当前最新稳定版 25.11）
  system.stateVersion = "25.11";
}

```

  

保存退出。

  

#### 8. 开始安装

```bash

sudo nixos-install

```

  

- 下载包会优先走清华镜像（非常快）。

- 中断可多次运行（支持续传）。

- 完成后设置 root 密码。

  
  

> 假设你当前在 Live 系统终端，nixos-install 正在下载但速度慢或卡住：

  

##### 中断安装：

按 Ctrl+C（安全中断，不会损坏已下载内容）。

  

添加中科大源（临时方式，推荐）：

直接在下次运行 nixos-install 时用选项指定多个源（优先中科大 + 清华 + 官方）：

```Bash

sudo nixos-install \

--option substituters "https://mirrors.ustc.edu.cn/nix-channels/store https://mirrors.tuna.tsinghua.edu.cn/nix-channels/store https://cache.nixos.org/" \

--option trusted-public-keys "cache.nixos.org-1:6NCHdD59X431o0gWypbMrAURkbJ16ZPMQFGspcDShjY="

```

这会覆盖 Live 系统的默认配置，继续从中断处下载（更快，因为多源并行 + 国内加速）

  
  

#### 9. 完成与重启

```bash

reboot

```

  

拔掉 U 盘，用普通用户登录（首次改密码）。

  

#### 10. 安装完成后常见问题解决

如果 `sudo nixos-rebuild switch` 报 **error: public key is not valid**（通常因旧 key 配置污染）：

```bash

# 临时绕过坏 key 并 rebuild（成功后自动修复）

sudo nixos-rebuild switch \

--option substituters "https://mirrors.tuna.tsinghua.edu.cn/nix-channels/store https://cache.nixos.org/" \

--option trusted-public-keys "cache.nixos.org-1:6NCHdD59X431o0gWypbMrAURkbJ16ZPMQFGspcDShjY="

```

  

然后正常：

```bash

sudo nixos-rebuild switch --upgrade

```

  

至此安装完成！国内环境下通常 20-40 分钟搞定。祝使用愉快！