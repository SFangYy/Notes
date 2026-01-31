---
Project:
  - LearnAI
description:
tags:
  - linux
  - command
created: 2025-07-01 | 22:36
parent: Resource
---
# Resources
## 不输入密码连接远程主机
- 本地:arch 
```
本地：arch

$ssh-keygen -t rsa -b 4096 -C "sfangyy@163.com"
$cat ~/.ssh/id_rsa.pub
ssh-rsa AAAAB3NzaC1yc2EAAAA xxxx

远程主机 

```

- fedora or kxy101
```
echo "在这里粘贴你刚刚复制的公钥内容" >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh 
chmod 600 ~/.ssh/authorized_keys

```

- use 
```
ssh username@ip

```

## 配置在登录到远程之后执行source .bashrc命令
```
# 创建 .bash_profile 文件， 添加如下内容 
if [ -f ~/.bashrc ]; then
    source ~/.bashrc
fi

```


## kitty终端ssh后不支持tmux 
1. 修改本地ssh配置文件
2. 为服务器添加环境变量
```
# 1. `~/.ssh/config`
Host your-server
    HostName your-server.com
    User your-username
    SendEnv TERM
    # 或者强制设置 TERM
    SetEnv TERM=xterm-256color

# 2. 修改.bashrc
export TERM=xterm-256color
```

```
报错ssh root@localhost -p 2222

@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @

@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!

Someone could be eavesdropping on you right now (man-in-the-middle attack)!

It is also possible that a host key has just been changed.

The fingerprint for the ED25519 key sent by the remote host is

SHA256:Xf+22Zu3XPrHvNlf5F9d842ha4M8B0Ddl7tQx9Yl/Vg.

Please contact your system administrator.

Add correct host key in /home/sfangyy/.ssh/known_hosts to get rid of this message.

Offending ECDSA key in /home/sfangyy/.ssh/known_hosts:6

Host key for [localhost]:2222 has changed and you have requested strict checking.

Host key verification failed.
```

您遇到的这个错误 WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED! 是一个非常常见的 SSH 警告，尤其是在 Docker 环境中。它不是容器内部配置或 SSH 服务的问题，而是您 主机上 SSH 客户端的问题。

错误原因

SSH 客户端在第一次连接一个服务器时，会记录该服务器的主机密钥指纹到您本地的 ~/.ssh/known_hosts 文件中。当您再次连接同一个服务器时，SSH 客户端会检查这个指纹是否匹配。

在 Docker 环境中，每次您销毁一个旧容器并用新镜像（或甚至旧镜像）启动一个新容器时，这个新容器会生成一套全新的 SSH 主机密钥。这意味着，尽管您连接的 IP 地址和端口（localhost:2222）没变，但它背后的 "服务器"（新的 Docker 容器）已经更换了身份，导致指纹不匹配。SSH 客户端认为这可能是一个"中间人攻击"（man-in-the-middle attack），因此发出警告并拒绝连接。

解决方案

您需要从您本地的 ~/.ssh/known_hosts 文件中删除旧的、不匹配的条目。

    确定受影响的行号：
    错误信息通常会告诉你哪一行有问题：
    Offending ECDSA key in /home/sfangyy/.ssh/known_hosts:6
    这里的 :6 表示问题出在 known_hosts 文件的第 6 行。

    删除该行：

    最安全、最直接的方法是使用 ssh-keygen -R 命令，它会为您自动处理：
    Bash

ssh-keygen -R "[localhost]:2222"

这个命令会从 known_hosts 文件中查找并移除所有与 [localhost]:2222 相关的旧主机密钥条目。

或者，手动删除（不推荐给新手）：
你也可以手动编辑 ~/.ssh/known_hosts 文件（使用 nano 或 vim）：
Bash

nano ~/.ssh/known_hosts

然后找到报错中提到的那一行（例如第 6 行），将其删除，然后保存并退出。

重新尝试 SSH 连接：
删除旧的条目后，再次尝试 SSH 连接：
Bash

    ssh root@localhost -p 2222

    这次，SSH 客户端会提示你接受新的主机密钥指纹。输入 yes 并按回车即可。

    The authenticity of host '[localhost]:2222 ([::1]:2222)' can't be established.
    ECDSA key fingerprint is SHA256:Xf+22Zu3XPrHvNlf5F9d842ha4M8B0Ddl7tQx9Yl/Vg.  # 这是新的指纹
    Are you sure you want to continue connecting (yes/no/[fingerprint])? yes

02:42:ac:11:00:02
host 2d6078b92a68