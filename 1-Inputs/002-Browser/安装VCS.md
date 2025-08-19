---
Project:
  - UVM
title:
description:
source:
author:
tags:
  - UVM
created: 2025-08-19 | 09:49
parent: Resource
branch:
url: https://blog.csdn.net/weixin_43444334/article/details/147316674
---
# 002-Browser
### 运行安装脚本
```
./Synopsys2024/Installer_5.8/setup.sh

```
### fish 配置环境变量
- 配置vcs home,path, VCS_ARCH_OVERRIDE 
```
set -gx VCS_HOME "/home/sfangyy/work/9-dependency/synopsys/vcs/W-2024.09-SP1"
set -gx PATH "$VCS_HOME/bin" $PATH
set -gx VCS_ARCH_OVERRIDE linux
```

### 复制patch到vcs路径下


### 测试是否安装成功
- 运行`vcs -full64 hello.v -o simv`若不报错，则安装成功
```verilog 
// hello.v
module hello;
  initial begin
    $display("VCS is working! Hello World!");
    $finish;
  end
endmodule
```


## docker 中运行vcs

![[docker-basic-function#文件映射]]

在容器中配置环境变量


