---
Project:
  - LearnAI
title:
description:
source:
author:
tags:
  - docker
created: 2025-07-01 | 14:40
parent: Resource
branch:
---
# Resources
1. define docker file, this file will put at last
2. build docker image by
	- `docker build -t picker-basic-env -f Dockerfile .`
	- `docker build -t vcs_env -f Dockerfile.full .`
3. run docker container
	- `docker run -d -p 2223:22 -p 5902:5901 --name my_vnc -v /home/sfangyy/work:/home/sfangyy/Documents/work -v /home/sfangyy/Documents/vcs_verdi2018:/home/sfangyy/synopsys/Synopsys2024 --hostname sfangyy --mac-address 02:42:ac:11:00:02 vcs_env`
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
# Use Ubuntu 22.04 as the base image
FROM ubuntu:22.04

# Set non-interactive installation
ENV DEBIAN_FRONTEND=noninteractive

# Set the locale
ENV LANG=C.UTF-8
ENV LANGUAGE=C.UTF-8
ENV LC_ALL=C.UTF-8
# Use https for apt repositories
RUN apt update && \
    apt install -y --no-install-recommends apt-transport-https ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
RUN sed -i 's|http|https|g' /etc/apt/sources.list 

# Set the timezone to France
ENV TZ=Asia/Shanghai
RUN apt-get update && \
    apt-get install -y --no-install-recommends tzdata && \
    ln -fs /usr/share/zoneinfo/$TZ /etc/localtime && \
    dpkg-reconfigure --frontend noninteractive tzdata && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    build-essential \
    git \
    sudo \
    wget \
    curl \
    vim \
    software-properties-common \
    python3 \
    python3-pip \
    python3-dev \
    python3-venv \
    libpcre3-dev \
    pkg-config \
    libfl-dev \
    bison \  
    flex \
    gperf \
    clang \
    g++ \
    zlib1g-dev \
    openssh-server \
    gnupg \
    autoconf \
    automake \
    libtool \
    openjdk-17-jdk \
    libpcre2-dev \
    net-tools \
    dos2unix \
    lsb \
    openssh-server \
    tigervnc-standalone-server \
    xfce4 xfce4-goodies \
    lightdm  \
    help2man && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install SWIG (4.2.1)d
RUN git clone https://github.com/swig/swig.git -b v4.2.1 --depth=1 /tmp/swig && \
    cd /tmp/swig && \
    ./autogen.sh && \
    ./configure --prefix=/usr/local && \
    make -j$(nproc) && \
    make install && \
    rm -rf /tmp/swig

# Set up Kitware repository and install the latest CMake
RUN wget -O - https://apt.kitware.com/keys/kitware-archive-latest.asc 2>/dev/null | \
    gpg --dearmor - | tee /usr/share/keyrings/kitware-archive-keyring.gpg >/dev/null && \
    echo 'deb [signed-by=/usr/share/keyrings/kitware-archive-keyring.gpg] https://apt.kitware.com/ubuntu/ jammy main' | \
    tee /etc/apt/sources.list.d/kitware.list >/dev/null && \
    apt-get update && \
    apt-get install -y --no-install-recommends cmake && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Verilator (5.0 series latest version, e.g. v5.018)
RUN git clone https://github.com/verilator/verilator -b v5.018 --depth=1 /tmp/verilator && \
    cd /tmp/verilator && \
    autoconf && \
    ./configure --prefix=/usr/local && \
    make -j$(nproc) && make test && \
    make install && \
    rm -rf /tmp/verilator

# Verify Dependency installations
RUN swig -version && \
    cmake --version && \
    verilator --version && \
    java --version && \
    python3 --version

# Install Picker
ENV BUILD_XSPCOMM_SWIG=python,java
RUN mkdir /workspace && \
    cd /workspace && \
    git clone https://github.com/XS-MLVP/picker.git --depth=1 && \
    wget https://github.com/chipsalliance/verible/releases/download/v0.0-3979-g786edf03/verible-v0.0-3979-g786edf03-linux-static-x86_64.tar.gz && \
    tar -xzf verible-v0.0-3979-g786edf03-linux-static-x86_64.tar.gz -C /usr/local/ --strip-components=1 && \
    rm verible-v0.0-3979-g786edf03-linux-static-x86_64.tar.gz && \
    cd picker && make init && \
    make -j$(nproc) && \
    make install && \
    make clean && \
    chmod 755 /usr/local/bin -R 

# set user and password
RUN useradd -m -s /bin/bash sfangyy && \
    echo "sfangyy:192837" | chpasswd && \
    adduser sfangyy sudo && \
    echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers && \
    chown sfangyy:sfangyy -R /workspace && \
    chmod 755 /workspace

# Set SSH autostart
RUN mkdir /var/run/sshd && \
    echo 'root:root' | chpasswd && \
    echo 'sfangyy:192837' | chpasswd && \
    sed -i 's|#PermitRootLogin prohibit-password|PermitRootLogin yes|' /etc/ssh/sshd_config && \
    sed -i 's|#PasswordAuthentication yes|PasswordAuthentication yes|' /etc/ssh/sshd_config && \
    sed -i 's|#PermitEmptyPasswords no|PermitEmptyPasswords yes|' /etc/ssh/sshd_config && \
    sed -i 's|#Port 22|Port 51202|' /etc/ssh/sshd_config && \
    # only listen on localhost
    sed -i 's|#ListenAddress|ListenAddress 127.0.0.1 #|' /etc/ssh/sshd_config && \
    ssh-keygen -A

# Switch to the new user
USER sfangyy
# Set the default shell to bash
SHELL ["/bin/bash", "-c"]
# Set working directory
WORKDIR /workspace
```

- this is a advance env, include some picker and vcs dev tools in this
```dockerfil]e
# Use your existing base image as the starting point
FROM picker-basic-env:latest
# Use your existing base image as the starting point

# Ensure we are running as root for package installations
USER root

# Set environment variables for non-interactive installations
ENV DEBIAN_FRONTEND=noninteractive

# Install SSH and VNC server, XFCE4 desktop environment, and LightDM
# Assuming Debian/Ubuntu base image. Adjust for Alpine (apk) or CentOS/RHEL (yum/dnf).

# Configure SSH for the 'user' user
#RUN mkdir /var/run/sshd
# Disable password authentication entirely for SSH for better security if using keys
RUN apt-get update && apt-get install -y \
    # 对应 libXScrnSaver.x86_64 / libXScrnSaver
    libxss1 \
    # 对应 xcb-util 及其相关库
    libxcb-ewmh-dev \
    libxcb-image0 \
    libxcb-keysyms1 \
    libxcb-render-util0 \
    # 对应 libXext
    libxext6 \
    # 对应 libXrender
    libxrender1 \
    # 对应 libXtst
    libxtst6 \
    # 对应 libXi
    libxi6 \
    # 对应 libXrandr
    libxrandr2 \
    dc \
    libnuma1
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Ensure the .ssh directory exists and has correct permissions for 'user'
# Assuming 'user' exists and is named 'user' with home directory /home/user
RUN sed -i 's|^Port .*|Port 22|' /etc/ssh/sshd_config && \
    sed -i 's|^ListenAddress .*|ListenAddress 0.0.0.0|' /etc/ssh/sshd_config
# Configure VNC for the 'user' user
# Create a VNC password for 'user'. Replace 'your_vnc_password' with a strong password.
# The VNC password is still necessary for VNC connections.
RUN mkdir -p /home/sfangyy/.vnc && \
    echo "192837" | vncpasswd -f > /home/sfangyy/.vnc/passwd && \
    chmod 600 /home/sfangyy/.vnc/passwd && \
    chown -R sfangyy:sfangyy /home/sfangyy/.vnc

# Ensure the .Xauthority file can be created and is owned by 'user'
# This is crucial for X session authentication
RUN touch /home/sfangyy/.Xauthority && \
    chmod 600 /home/sfangyy/.Xauthority && \
    chown sfangyy:sfangyy /home/sfangyy/.Xauthority

# Create xstartup script for XFCE4, which vncserver will use by default
COPY xstartup /home/sfangyy/.vnc/xstartup
RUN chmod +x /home/sfangyy/.vnc/xstartup && \
    chown sfangyy:sfangyy /home/sfangyy/.vnc/xstartup 

# Set the VNC display number (e.g., :1) and geometry
ENV DISPLAY=:1
ENV VNC_GEOMETRY=1920x1080
ENV VNC_DEPTH=24

# Create a startup script for SSH and VNC
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose the ports for SSH (22) and VNC (5901 for display :1)
EXPOSE 22 5901

# Run the entrypoint script when the container launches
CMD ["/usr/local/bin/entrypoint.sh"]
```
