# 仅供个人学习交流，请于 24 小时内删除

## 概要

> [Bubblewrap](https://github.com/containers/bubblewrap) is a lightweight sandbox application used by [Flatpak](https://wiki.archlinux.org/title/Flatpak) and other container tools. It has a small installation footprint and minimal resource requirements. While the package is named bubblewrap, the actual command-line interface is [bwrap(1)](https://man.archlinux.org/man/bwrap.1). Notable features include support for cgroup/IPC/mount/network/PID/user/UTS [namespaces](https://en.wikipedia.org/wiki/Linux_namespaces) and [seccomp](https://en.wikipedia.org/wiki/Seccomp) filtering. Note that bubblewrap drops all [capabilities](https://wiki.archlinux.org/title/Capabilities) within a sandbox and that child tasks cannot gain greater privileges than its parent. Notable feature exclusions include the lack of explicit support for blacklisting/whitelisting file paths.
>
> —— From [Archlinux wiki - Bubblewrap](https://wiki.archlinux.org/title/Bubblewrap)

总之，bubblewrap 无需root权限，可以提供更轻量、方便的沙箱机制，给相关 eda 工具配置专门的运行环境，从而保证能在较新的 Linux 发行版当中运行。通三益，也能够尽量减少对系统依赖的修改。

## 步骤

假设以下操作均在 `$HOME/EDAWorkbench` 中进行，给沙箱配置的环境为 [Almalinux 9](https://almalinux.org/)。

### 安装 sn0p\$y\$

安装时文件夹请选择： `$HOME/EDAWorkbench/syonpsys`。

假设没有使用 scl，而是整体直接 patch 好的。

安装时不建议勾选 32 位的程序，因为没给它做 patch。

### 下载 almalinux9 的 rootfs

```bash
# 访问 https://github.com/AlmaLinux/container-images/tree/9/default/amd64

# 下载 
wget https://github.com/AlmaLinux/container-images/raw/refs/heads/9/default/amd64/almalinux-9-default-amd64.tar.xz

mkdir -p $HOME/EDAWorkbench/almalinux9-rootfs

# 解压到文件夹almalinux9-rootfs之中
tar xvf ./almalinux-9-default-amd64.tar.xz -C $HOME/EDAWorkbench/almalinux9-rootfs

# 删除压缩包
rm ./almalinux-9-default-amd64.tar.xz
```

### 修改hosts和nameserver

首先修改 `$HOME/EDAWorkbench/almalinux9-rootfs/etc/resolv.conf`：

```bash
echo "" > $EDA_HOME/almalinux9-rootfs/etc/resolv.conf
```

然后修改`$HOME/EDAWorkbench/almalinux9-rootfs/etc/hosts`：

```bash
echo "127.0.0.1   localhost verdi03.vdc.azure.synopsys.com" >> $EDA_HOME/almalinux9-rootfs/etc/hosts
```

### 配置 UVM-1.2 （可选）

> [!tip]
>
> 如果你不需要配置 UVM，可以忽略此节。

把代码下载到 `$HOME/EDAWorkbench`中：

```bash
cd $EDA_HOME
wget https://www.accellera.org/images/downloads/standards/uvm/uvm-1.2.tar.gz
tar xvf uvm-1.2.tar.gz
rm uvm-1.2.tar.gz
```

### 创建启动脚本

创建文件`$HOME/EDAWorkbench/active`，内容为：

```bash
eda_playground() {
    VCS_HOME=$HOME/EDAWorkbench/synopsys/vcs/W-2024.09-SP1
    VERDI_HOME=$HOME/EDAWorkbench/synopsys/verdi/W-2024.09-SP1
    APPEND_PATH=$VCS_HOME/bin:$VERDI_HOME/bin
    VCS_ARCH_OVERRIDE=linux
    UVM_HOME=$HOME/EDAWorkbench/uvm-1.2

    if [ $# -eq 0 ]; then
        echo "在配置好的eda环境中运行相关程序"
        echo "用法: eda_playground <参数>"
        echo "示例: eda_playground vcs -full64 ..."
        return 1
    fi

    # 如果输入的是 `verdi`，需要开启 share-net
    SHARE_NET=$([ "$1" = "verdi" ] && echo -n "--share-net" || echo -n "")
    echo $SHARE_NET

    bwrap --bind /home/frank/EDAWorkbench/almalinux9-rootfs / \
          --bind $HOME $HOME \
          --ro-bind /etc/passwd /etc/passwd \
          --ro-bind /etc/group /etc/group \
          --dev-bind /dev /dev \
          --proc /proc \
          --tmpfs /tmp \
          --tmpfs /run \
          --ro-bind /sys/dev/char /sys/dev/char \
          --ro-bind /sys/devices /sys/devices \
          --ro-bind /run/dbus /run/dbus \
          --ro-bind /usr/lib /usr/lib \
          --ro-bind /usr/lib64 /usr/lib64 \
          --setenv WAYLAND_DISPLAY "$WAYLAND_DISPLAY" \
          --ro-bind "$XDG_RUNTIME_DIR" "$XDG_RUNTIME_DIR" \
          --ro-bind /tmp/.X11-unix /tmp/.X11-unix \
          --setenv HOME $HOME \
          --setenv LINUX_VMR_OS linux \
          --setenv VCS_HOME $VCS_HOME \
          --setenv VCS_ARCH_OVERRIDE linux \
          --setenv UVM_HOME $UVM_HOME \
          --setenv VCS_UVM_HOME $UVM_HOME/src \
          --setenv VERDI_HOME $VERDI_HOME \
          --setenv PATH /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:$APPEND_PATH \
          --unshare-all \
          ${SHARE_NET} \
          --die-with-parent \
          "$@"
}

eda_sudo() {
    sudo -E bwrap --bind /home/frank/EDAWorkbench/almalinux9-rootfs / \
      --dev-bind /dev /dev \
      --ro-bind /etc/resolv.conf /etc/resolv.conf \
      --proc /proc \
      --tmpfs /tmp \
      --tmpfs /run \
      --setenv PATH /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin \
      --share-net \
      --die-with-parent \
      bash
}
```

如果使用的是fish，则要将其修改为fish支持的语法, 
1. `~/.config/fish/functions/eda_playground`
```
# ~/.config/fish/functions/eda_playground.fish

function eda_playground
    # --- 变量定义 ---
    # 使用 set 来定义变量
    set VCS_HOME $EDA_HOME/synopsys/vcs/W-2024.09-SP1
    set VERDI_HOME $EDA_HOME/synopsys/verdi/W-2024.09-SP1
    set APPEND_PATH $VERDI_HOME/bin $VCS_HOME/bin
    set VCS_ARCH_OVERRIDE linux
    set UVM_HOME $HOME/EDAWorkbench/uvm-1.2

    set APPEND_PATH_STRING (string join ":" $APPEND_PATH)
    # # --- 参数检查 ---
    # # 使用 (count $argv) 检查参数数量
    # if test (count $argv) -eq 0
    #     echo 在配置好的eda环境中运行相关程序
    #     echo "用法: eda_playground <参数>"
    #     echo "示例: eda_playground vcs -full64 ..."
    #     return 1
    # end
    #
    # --- 条件逻辑 ---
    # # 使用 if/else/end 结构
    # set SHARE_NET ""
    # if test "$argv[1]" = verdi
    #     set SHARE_NET --share-net
    # end
    #
    if test "$argv[1]" = verdi
        set SHARE_NET --share-net
    else
        set SHARE_NET ""
    end

    #echo $SHARE_NET
    # --- 主命令 ---
    # bash 的 "$@" 在 fish 中是 $argv
    bwrap --bind /home/sfangyy/work/9-dependency/EDAWorkbench/almalinux9-rootfs / \
        --bind $HOME $HOME \
        --ro-bind /etc/passwd /etc/passwd \
        --ro-bind /etc/group /etc/group \
        --dev-bind /dev /dev \
        --proc /proc \
        --tmpfs /tmp \
        --tmpfs /run \
        --ro-bind /sys/dev/char /sys/dev/char \
        --ro-bind /sys/devices /sys/devices \
        --ro-bind /run/dbus /run/dbus \
        --setenv WAYLAND_DISPLAY "$WAYLAND_DISPLAY" \
        --ro-bind "$XDG_RUNTIME_DIR" "$XDG_RUNTIME_DIR" \
        --ro-bind /tmp/.X11-unix /tmp/.X11-unix \
        --clearenv \
        --setenv HOME $HOME \
        --setenv LINUX_VMR_OS linux \
        --setenv VCS_HOME $VCS_HOME \
        --setenv VCS_ARCH_OVERRIDE linux \
        --setenv UVM_HOME $UVM_HOME \
        --setenv VCS_UVM_HOME $UVM_HOME/src \
        --setenv DISPLAY $DISPLAY \
        --setenv PATH /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:$APPEND_PATH_STRING \
        --unshare-all \
        $SHARE_NET \
        --die-with-parent \
        $argv # 使用 $argv 传递所有参数
end
```

2. `~/.config/fish/functions/eda_sudo`
```
function eda_sudo
    # 注意：这里假设 sudo 密码已经缓存，或者你有免密权限
    # 否则在函数中直接调用 sudo 可能会有交互问题
    sudo -E bwrap --bind /home/sfangyy/work/9-dependency/EDAWorkbench/almalinux9-rootfs / \
        --dev-bind /dev /dev \
        --ro-bind /etc/resolv.conf /etc/resolv.conf \
        --proc /proc \
        --tmpfs /tmp \
        --tmpfs /run \
        --setenv PATH /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin \
        --share-net \
        --die-with-parent \
        bash
end
```
其中，`eda_playground` 用于启动相关软件的环境，如果需要执行sudo权限的命令，比如安装软件，那就执行 `eda_sudo`。

**记得添加到环境变量中**：`source $EDA_HOME/active`。

### 进入 rootfs 配置

执行 `eda_sudo` 进行配置。

> 注意，在`eda_sudo`模式下使用的是宿主机的hosts，不需要额外修改 `/etc/resolv.conf`。

#### 修改为清华源

执行以下内容：

```bash
dnf install epel-release -y
sed -e 's!^metalink=!#metalink=!g' \
    -e 's!^#baseurl=!baseurl=!g' \
    -e 's!https\?://download\.fedoraproject\.org/pub/epel!https://mirrors.tuna.tsinghua.edu.cn/epel!g' \
    -e 's!https\?://download\.example/pub/epel!https://mirrors.tuna.tsinghua.edu.cn/epel!g' \
    -i /etc/yum.repos.d/epel{,-testing}.repo
dnf update
```

#### 安装编译工具和依赖

```bash
dnf install bc time gcc g++ perl automake make git vim -y
```

如果还缺少其他库的依赖，可以通过在宿主机安装，因为在 `eda_playground` 中把宿主机的 `/usr/lib` 和 `/usr/lib64` 挂载到了 bwrap 沙箱中。

> [!tip]
>
> 如果出于其他原因，想使用 rootfs(almalinux9) 环境下的依赖，你可以删除 `active` 中的两行：
>
> ```bash
> --ro-bind /usr/lib /usr/lib \
> --ro-bind /usr/lib64 /usr/lib64 \
> ```
>
> 为了保证 verdi 的正常使用，你还需要在 `eda_sudo`中安装 x11 的相关依赖：
>
> ```bash
> dnf install xorg-x11-server-Xorg xorg-x11-xauth xorg-x11-utils -y
> ```

### 使用

直接运行工具：

- 运行 vcs：`eda_playground vcs -full64`。
- 运行 verdi：`eda_playground verdi` ；注意，要在桌面环境中执行该命令，其他情况请自行配置。

运行使用 Makefile 的项目：

1. 直接运行 make：`eda_playground make xxx` 即可。
2. 在 makefile 中使用：`source $HOME/EDAWorkbench/active && eda_playground $COMMAND`。