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
- 如果是编译安装到了/usr/local下
```
sudo alternatives --install /usr/bin/gcc gcc /usr/local/gcc-13.3.0/bin/gcc-13.3 130 \
--slave /usr/bin/gcc-ar gcc-ar /usr/local/gcc-13.3.0/bin/gcc-ar-13.3 \
--slave /usr/bin/gcc-nm gcc-nm /usr/local/gcc-13.3.0/bin/gcc-nm-13.3 \
--slave /usr/bin/gcc-ranlib gcc-ranlib /usr/local/gcc-13.3.0/bin/gcc-ranlib-13.3 \
--slave /usr/bin/gcov gcov /usr/local/gcc-13.3.0/bin/gcov-13.3 \
--slave /usr/bin/gcov-dump gcov-dump /usr/local/gcc-13.3.0/bin/gcov-dump-13.3 \
--slave /usr/bin/gcov-tool gcov-tool /usr/local/gcc-13.3.0/bin/gcov-tool-13.3

sudo alternatives --install /usr/bin/g++ g++ /usr/local/gcc-13.3.0/bin/g++-13.3 130
```


### 如果系统默认的版本较高，
则会在`/usr/bin`下存在原始的gcc版本（不是符号链接）
```
sudo mkdir /usr/local/gcc-15.2.0
sudo mv /usr/bin/gcc /usr/local/gcc-15.2.0/
sudo mv /usr/bin/gcc-ar /usr/local/gcc-15.2.0/
sudo mv /usr/bin/gcc-nm /usr/local/gcc-15.2.0/
sudo mv /usr/bin/gcc-ranlib /usr/local/gcc-15.2.0/
sudo mv /usr/bin/gcov /usr/local/gcc-15.2.0/
sudo mv /usr/bin/gcov-dump /usr/local/gcc-15.2.0/
sudo mv /usr/bin/gcov-tool /usr/local/gcc-15.2.0/
```




### 4. 手动选择gcc版本
```
sudo alternatives --config gcc
```
## 解决冲突

![[arch包管理#卸载]]
