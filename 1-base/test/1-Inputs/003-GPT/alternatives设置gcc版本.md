---
Project:
  - undefined
description:
tags:
  - linux
created: 2025-08-27 | 09:30
parent: Resource
---
# 003-GPT

## 设置gcc
```
sudo alternatives --install /usr/bin/gcc gcc /usr/local/gcc-13.3.0/bin/gcc-13.3 130 \
          --slave /usr/bin/gcc-ar gcc-ar /usr/local/gcc-13.0.0/bin/gcc-ar-13.3 \
          --slave /usr/bin/gcc-nm gcc-nm /usr/local/gcc-13.3.0/bin/gcc-nm-13.3 \
          --slave /usr/bin/gcc-ranlib gcc-ranlib /usr/local/gcc-13.3.0/bin/gcc-ranlib-13.3 \
          --slave /usr/bin/gcov gcov /usr/local/gcc-13.3.0/bin/gcov-13.3 \
          --slave /usr/bin/gcov-dump gcov-dump /usr/local/gcc-13.3.0/bin/gcov-dump-13.3 \
          --slave /usr/bin/gcov-tool gcov-tool /usr/local/gcc-13.3.0/bin/gcov-tool-13.3
```

## 删除gcc配置
```
sudo alternatives --remove gcc /usr/local/gcc-13.3.0/bin/gcc
```

## 配置默认版本
```
sudo alternatives --config gcc
sudo alternatives --config g++
sudo alternatives --config gfortran  # 如果安装了
```123



