---
Project: ["LearnAI"]
title: 
description: 
source: 
author: 
tags: 
created: 2025-07-01 | 14:40
parent: Resource
branch: 
---
# Resources
1. define docker file, this file will put at last
2. build docker image by
	- `docker build -t ubuntu-desktop-vnc .`
3. run docker container
	- `docker run -it -p 2222:22 -p 5901:5901 --name my-vnc -v /home/sfangyy/work:/home/user/Document/work  my-env`
		- `-p`: port mapping last is container port
		- '-v': file mapping last is container file path
4. use by ssh
	- `ssh sfangyy@localhost -p 51202`
	- `ssh sfangyy@localhost -p 22`
5. use by vnc 
	1. run vnc client like rem 
	2. connect address `ocalhost:5901`
	3. input password 

## create virtual env
```
python -m venv myenv

source myenv/bin/activate
```

## create basic docker image
this is a basic ,include vnc ssh,and other dev tools
```dockerfile
# 使用 Ubuntu 22.04 作为基础镜像
FROM ubuntu:22.04

# 设置环境变量，避免交互式安装
ENV DEBIAN_FRONTEND=noninteractive
ENV HOME=/home/sfangyy

# 安装必要的软件包：桌面环境、VNC服务器、SSH服务器、sudo、字体等
RUN apt-get update && apt-get install -y \
    xfce4 xfce4-goodies \
    tightvncserver \
    openssh-server \
    sudo \
    net-tools \
    iputils-ping \
    # 添加必要的字体包，解决VNC启动时的字体缺失问题
    xfonts-base \
    xfonts-utils \
    xfonts-scalable \
    # 确保D-Bus和X相关的库已安装
    libxkbcommon0 \
    dbus-x11 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 创建用户 sfangyy 并设置密码
RUN useradd -m -s /bin/bash sfangyy && \
    echo "sfangyy:192837" | chpasswd && \
    usermod -aG sudo sfangyy

# 配置SSH允许密码认证
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config && \
    sed -i 's/PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config && \
    sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config && \
    sed -i 's/PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config

# 暴露SSH和VNC端口
EXPOSE 22
EXPOSE 5901

# 配置VNC服务器 (VNC密码和xstartup脚本)
USER sfangyy
RUN mkdir -p $HOME/.vnc && \
    echo "192837" | vncpasswd -f > $HOME/.vnc/passwd && \
    chmod 600 $HOME/.vnc/passwd && \
    echo '#!/bin/bash' > $HOME/.vnc/xstartup && \
    echo 'xrdb $HOME/.Xresources' >> $HOME/.vnc/xstartup && \
    echo 'startxfce4 &' >> $HOME/.vnc/xstartup && \
    chmod +x $HOME/.vnc/xstartup && \
    # 确保 dbus-launch 在启动 xfce4 之前运行，解决桌面环境启动问题
    sed -i 's/startxfce4 &/dbus-launch --exit-with-session startxfce4 &/' $HOME/.vnc/xstartup

# 切换回root用户以便启动服务
USER root

# 拷贝并设置启动脚本
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# 定义容器启动时执行的命令
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
```

- this is a advance env, include some picker and vcs dev tools in this
```dockerfile
# Use your existing base image as the starting point
FROM picker-basic-env:latest
# Use your existing base image as the starting point

# Ensure we are running as root for package installations
USER root

# Set environment variables for non-interactive installations
ENV DEBIAN_FRONTEND=noninteractive

# Install SSH and VNC server, XFCE4 desktop environment, and LightDM
# Assuming Debian/Ubuntu base image. Adjust for Alpine (apk) or CentOS/RHEL (yum/dnf).
RUN apt-get update && \
    apt-get install -y openssh-server tigervnc-standalone-server xfce4 xfce4-goodies lightdm && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Configure SSH for the 'user' user
#RUN mkdir /var/run/sshd
# Disable password authentication entirely for SSH for better security if using keys

# Ensure the .ssh directory exists and has correct permissions for 'user'
# Assuming 'user' exists and is named 'user' with home directory /home/user
RUN sed -i 's|^Port .*|Port 22|' /etc/ssh/sshd_config && \
    sed -i 's|^ListenAddress .*|ListenAddress 0.0.0.0|' /etc/ssh/sshd_config
# Configure VNC for the 'user' user
# Create a VNC password for 'user'. Replace 'your_vnc_password' with a strong password.
# The VNC password is still necessary for VNC connections.
RUN mkdir -p /home/user/.vnc && \
    echo "192837" | vncpasswd -f > /home/user/.vnc/passwd && \
    chmod 600 /home/user/.vnc/passwd && \
    chown -R user:user /home/user/.vnc

# Ensure the .Xauthority file can be created and is owned by 'user'
# This is crucial for X session authentication
RUN touch /home/user/.Xauthority && \
    chmod 600 /home/user/.Xauthority && \
    chown user:user /home/user/.Xauthority

# Create xstartup script for XFCE4, which vncserver will use by default
COPY xstartup /home/user/.vnc/xstartup
RUN chmod +x /home/user/.vnc/xstartup && \
    chown user:user /home/user/.vnc/xstartup 

# Set the VNC display number (e.g., :1) and geometry
ENV DISPLAY=:1
ENV VNC_GEOMETRY=1280x800
ENV VNC_DEPTH=24

# Create a startup script for SSH and VNC
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose the ports for SSH (22) and VNC (5901 for display :1)
EXPOSE 22 5901

# Run the entrypoint script when the container launches
CMD ["/usr/local/bin/entrypoint.sh"]
```

```
# Use your existing base image as the starting point
FROM picker-basic-env:latest
# Use your existing base image as the starting point

# Ensure we are running as root for package installations
USER root

# Set environment variables for non-interactive installations
ENV DEBIAN_FRONTEND=noninteractive

# Install SSH and VNC server, XFCE4 desktop environment, and LightDM
# Assuming Debian/Ubuntu base image. Adjust for Alpine (apk) or CentOS/RHEL (yum/dnf).
RUN apt-get update && \
    apt-get install -y openssh-server tigervnc-standalone-server xfce4 xfce4-goodies lightdm && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Configure SSH for the 'user' user
#RUN mkdir /var/run/sshd
# Disable password authentication entirely for SSH for better security if using keys

# Ensure the .ssh directory exists and has correct permissions for 'user'
# Assuming 'user' exists and is named 'user' with home directory /home/user
RUN sed -i 's|^Port .*|Port 22|' /etc/ssh/sshd_config && \
    sed -i 's|^ListenAddress .*|ListenAddress 0.0.0.0|' /etc/ssh/sshd_config
# Configure VNC for the 'user' user
# Create a VNC password for 'user'. Replace 'your_vnc_password' with a strong password.
# The VNC password is still necessary for VNC connections.
RUN mkdir -p /home/user/.vnc && \
    echo "192837" | vncpasswd -f > /home/user/.vnc/passwd && \
    chmod 600 /home/user/.vnc/passwd && \
    chown -R user:user /home/user/.vnc

# Ensure the .Xauthority file can be created and is owned by 'user'
# This is crucial for X session authentication
RUN touch /home/user/.Xauthority && \
    chmod 600 /home/user/.Xauthority && \
    chown user:user /home/user/.Xauthority

# Create xstartup script for XFCE4, which vncserver will use by default
COPY xstartup /home/user/.vnc/xstartup
RUN chmod +x /home/user/.vnc/xstartup && \
    chown user:user /home/user/.vnc/xstartup 

# Set the VNC display number (e.g., :1) and geometry
ENV DISPLAY=:1
ENV VNC_GEOMETRY=1280x800
ENV VNC_DEPTH=24

# Create a startup script for SSH and VNC
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose the ports for SSH (22) and VNC (5901 for display :1)
EXPOSE 22 5901

# Run the entrypoint script when the container launches
CMD ["/usr/local/bin/entrypoint.sh"]
```

- entrypoint.sh
	- this is a start vnc script
```
#!/bin/bash

# 确保SSH服务所需的目录存在，解决SSH启动问题
mkdir -p /run/sshd

# 启动SSH服务
/usr/sbin/sshd

# --- VNC 配置和启动 ---

# 确保VNC相关目录和文件具有正确的权限和所有权
mkdir -p /home/sfangyy/.vnc
chown sfangyy:sfangyy /home/sfangyy/.vnc
chmod 700 /home/sfangyy/.vnc

# 再次确认VNC密码文件是否存在并设置权限
if [ ! -f /home/sfangyy/.vnc/passwd ]; then
    echo "192837" | su - sfangyy -c "vncpasswd -f > /home/sfangyy/.vnc/passwd"
    su - sfangyy -c "chmod 600 /home/sfangyy/.vnc/passwd"
fi

# 以sfangyy用户身份执行VNC会话启动前的配置
su - sfangyy -c '
# 确保VNC的xstartup脚本存在且可执行
if [ ! -f "$HOME/.vnc/xstartup" ]; then
    echo "#!/bin/bash" > "$HOME/.vnc/xstartup"
    echo "xrdb $HOME/.Xresources" >> "$HOME/.vnc/xstartup"
    echo "startxfce4 &" >> "$HOME/.vnc/xstartup"
    chmod +x "$HOME/.vnc/xstartup"
fi
# 再次确认xstartup中包含dbus-launch，防止重复添加
if ! grep -q "dbus-launch" "$HOME/.vnc/xstartup"; then
    sed -i "s/startxfce4 &/dbus-launch --exit-with-session startxfce4 &/" "$HOME/.vnc/xstartup"
fi

# 为X程序设置DISPLAY环境变量
export DISPLAY=:1
# 确保.Xauthority文件存在，由sfangyy拥有并具有正确权限，解决xauth相关错误
xauth_path="$HOME/.Xauthority"
if [ ! -f "$xauth_path" ]; then
    touch "$xauth_path"
fi
# 显式设置所有权和权限，防止“not writable”错误
chown sfangyy:sfangyy "$xauth_path"
chmod 600 "$xauth_path"

# 添加Xauthority条目，防止认证问题
xauth add :1 . $(mcookie)
'

# 终止所有可能存在的VNC服务器进程，确保从干净状态启动
su - sfangyy -c "vncserver -kill :1 || true"

# 启动VNC服务器
# 移除 -localhost no 选项，让VNC监听所有接口，解决“Unrecognized option: no”
# TightVNCServer 默认不带 -localhost 选项时会监听所有接口
su - sfangyy -c "vncserver :1 -geometry 1280x800 -depth 24 -rfbauth $HOME/.vnc/passwd"

# 保持容器在前台运行，以便SSH和VNC服务持续工作
tail -f /dev/null
```

llI

