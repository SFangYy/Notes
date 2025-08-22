---
Project:
  - UVM
tags:
  - UVM
  - linux
created: 2025-08-19 | 09:23
parent: Resource
---
# 003-GPT

### 1. 下载预编译的gcc
```
wget https://archive.archlinux.org/packages/g/gcc13/gcc13-13.3.0-1-x86_64.pkg.tar.zst

wget https://archive.archlinux.org/packages/g/gcc13-libs/gcc13-libs-13.3.0-1-x86_64.pkg.tar.zst
```

### 2. 通过aur安装gcc

![[arch包管理#从本地安装]]


### 3. 配置gcc13 

```
sudo alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-13 60 \
--slave /usr/bin/g++ g++ /usr/bin/g++-13 \
--slave /usr/bin/gcov gcov /usr/bin/gcov-13
```

### 4. 手动选择gcc版本
```
sudo alternatives --config gcc
```
## 解决冲突

![[arch包管理#卸载]]
