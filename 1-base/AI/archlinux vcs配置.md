## 安装
- 依赖
```
sudo pacman -S bc time inetutils
```

环境变量
```
export VCS_ARCH_OVERRIDE=linux
export VCS_HOME=$HOME/EDAHome/vcs/W-2024.09-SP1
export VERDI_HOME=$HOME/EDAHome/verdi/W-2024.09-SP1
export PATH=$VCS_HOME/bin:$VERDI_HOME/bin:$PATH
alias vcs="vcs -LDFLAGS '-Wl,--no-as-needed'"
```

## 测试
```
module test;
  initial begin
    $display("----------------------");
    $display("Success! VCS is working.");
    $display("----------------------");
    $finish;
  end
endmodule
```

```
vcs -full64 -sverilog -debug_access+all hello.v
```

## UVMC
```
cd ~/EDA_HOME
git clone https://gitcode.com/open-source-toolkit/12cd0.git
mv 12cd0/eetop.cn_uvmc-2.3.1\ \(1\).tar.gz .
tar zxvf eetop.cn_uvmc-2.3.1\ \(1\).tar.gz
export UVMC_HOME=/home/sfangyy/EDAHome/uvmc-2.3.1
```

## 加载问题
`python3: symbol lookup error: /home/sfangyy/EDAHome/vcs/W-2024.09-SP1/linux64/lib/libvcsucli.so: undefined symbol: snpsStrdupFunc`

```
 有几种系统配置方案：

  方案 1: 在 shell 配置文件中设置 LD_PRELOAD（推荐）

  在 ~/.bashrc 或 ~/.zshrc 中添加：

  export LD_PRELOAD="${VCS_HOME}/linux64/lib/libvfs.so:${VCS_HOME}/linux64/lib/libsnpsmalloc.so:${LD_PRELOAD}"

  方案 2: 使用 ldconfig 将 VCS 库添加到系统库路径

  # 创建配置文件（需要 root 权限）
  echo "/home/sfangyy/EDAHome/vcs/W-2024.09-SP1/linux64/lib" | sudo tee /etc/ld.so.conf.d/vcs.conf
  sudo ldconfig

  方案 3: 设置 LD_LIBRARY_PATH（部分解决）

  export LD_LIBRARY_PATH="${VCS_HOME}/linux64/lib:${LD_LIBRARY_PATH}"

  但这种方式对 LD_PRELOAD 的场景可能不够用，因为符号需要在加载时就被预先解析。

  ---
  你想使用哪种方案？方案 1 最简单且不需要 root 权限。
```