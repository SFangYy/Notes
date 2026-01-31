---
Project:
  - undefined
description:
tags:
  - linux
created: 2025-08-31 | 20:13
parent: Resource
---
# 003-GPT
#### 1. 创建挂载点

首先，创建你想要挂载到的目标文件夹，即“挂载点”。

bash
```
sudo mkdir -p /home/nas
# 如果 /home/nas 已存在，请确保它是空文件夹。
# 更改所有权给你自己，方便读写（可选）
sudo chown $USER:$USER /home/nas

sudo dnf install cifs-utils

sudo mount -t cifs -o username=<NAS_USERNAME>,password=<NAS_PASSWORD> //<NAS_IP>/<SHARE_NAME> /home/nas

sudo mount -t cifs -o username=sfangyy,password=123qwe //192.168.41.211/attachment /home/nas/attachment/
```

### 方法二：开机自动挂载（推荐）

通过修改 `/etc/fstab` 文件，可以实现系统启动时自动挂载。

#### 1. 创建凭据文件（安全重要！）

将用户名和密码明文写在 `fstab` 中是不安全的。最佳做法是创建一个只有 root 可读的文件来存储它们。

1. 创建并编辑凭据文件：
    
    bash
    
```
- sudo nano /etc/.smbcredentials
    
- 在该文件中输入以下两行内容：
    
username=alice
password=mysecretpass
    
（请将 `alice` 和 `mysecretpass` 替换为你的实际用户名和密码）
```

    
- 保存文件后，将其权限设置为**仅 root 可读**，这是关键的安全步骤：
    
    bash
    
```
sudo chown root:root /etc/.smbcredentials
sudo chmod 600 /etc/.smbcredentials
```

    

#### 2. 编辑 `/etc/fstab` 文件

1. 备份并编辑系统挂载配置文件：
    
    bash
    
```
sudo cp /etc/fstab /etc/fstab.backup  # 可选备份
sudo nano /etc/fstab

//<NAS_IP>/<SHARE_NAME>  /home/nas  cifs  credentials=/etc/.smbcredentials,uid=<YOUR_UID>,gid=<YOUR_GID>,iocharset=utf8,_netdev  0  0

//192.168.41.211/multimedia  /home/nas  cifs  credentials=/etc/.smbcredentials,uid=1000,gid=1000,iocharset=utf8,file_mode=0777,dir_mode=0777,_netdev  0  0

```



**一个具体的示例：**

text

1. **挂载选项解释：**
    - `credentials=/etc/.smbcredentials`: 指向你创建的凭据文件。
    - `uid=1000` 和 `gid=1000`: 将挂载的文件所有者设置为你的本地用户（避免文件所有者为 root，导致无法读写）。可以通过 `id -u` 和 `id -g` 命令查看你的 UID 和 GID。
    - `file_mode=0777, dir_mode=0777`: (**可选，但常用**) 设置文件和目录的权限为 777，即所有用户可读、可写、可执行。这可以很好地解决权限问题，但安全性较低，仅适用于完全信任的家庭网络。你可以设置为 `0755`（可读可执行但不可写）等更严格的权限。
    - `iocharset=utf8`: 确保能正确显示中文等非 ASCII 字符的文件名。
    - `_netdev`: 重要！告知系统这是一个网络设备，需要在网络连接建立后再尝试挂载，避免系统启动时因网络未就绪而挂载失败。
    - `0 0`: 最后两个数字分别表示 `dump` 工具不备份和启动时不进行 `fsck` 磁盘检查。
2. 保存并关闭文件。
    
#### 3. 测试并启用自动挂载

1. 测试 `fstab` 配置是否正确。这个命令会尝试挂载所有在 `fstab` 中定义但尚未挂载的设备：
    
    bash
    

- sudo mount -a
    
- 如果没有任何错误输出，说明配置成功。现在你可以用 `df -h` 查看挂载情况，或直接访问 `/home/nas` 文件夹。
    
- 重启你的电脑，确认 NAS 共享是否会自动挂载。
    
    bash
    

1. sudo reboot
    

---