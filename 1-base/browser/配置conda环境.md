---
Project: ["Unitychip"]
---
# browser
```
conda create -n env_ucagent -c conda-forge \

python=3.13 \
gcc_linux-64=13.2 gxx_linux-64=13.2 sysroot_linux-64 \
"cmake>=3.11" \
"verilator>=5.020" \
"swig>=4.2.0" \
verible



```

```
conda install -c conda-forge nodejs gcc_linux-64=13.2 gxx_linux-64=13.2 sysroot_linux-64 cmake verilator swig verible python=3.13
```

- gcc软链接
```
cd /home/sfangyy/.conda/envs/env_ucagent/bin/
(env_ucagent) [sfangyy@sfangyy bin]$ ln -s x86_64-conda-linux-gnu-gcc gcc
(env_ucagent) [sfangyy@sfangyy bin]$ ln -s x86_64-conda-linux-gnu-g++ g++
```

## 其他基础操作
```
sudo env PATH=$PATH make install
```
### env

| **操作**   | **命令**                                    | **说明**                               |
| -------- | ----------------------------------------- | ------------------------------------ |
| **创建环境** | `conda create -n my_env python=3.9`       | 创建名为 `my_env` 且指定 Python 版本为 3.9 的环境 |
| **激活环境** | `conda activate my_env`                   | 进入该环境，终端前缀会变                         |
| **退出环境** | `conda deactivate`                        | 回到 base 环境                           |
| **查看环境** | `conda env list` (或 `conda info -e`)      | 列出所有已创建的环境                           |
| **删除环境** | `conda env remove -n my_env`              | 彻底删除某个环境                             |
| **复制环境** | `conda create -n new_env --clone old_env` | 克隆一个现有的环境                            |
### 备份
```
conda env export > environment.yml
conda env create -f environment.yml
```

### 包管理
|**操作**|**命令**|**说明**|
|---|---|---|
|**安装包**|`conda install numpy`|安装 numpy|
|**指定版本安装**|`conda install numpy=1.21`|安装特定版本|
|**搜索包**|`conda search pandas`|查看仓库里有哪些版本可用|
|**列出已装包**|`conda list`|查看当前环境装了哪些包|
|**更新包**|`conda update numpy`|更新某个包|
|**卸载包**|`conda remove numpy`|卸载某个包|
|**更新 Conda**|`conda update conda`|更新 Conda 自身|
```
$cat environment.yml 

name: env_ucagent
channels:
  - conda-forge
  - defaults
dependencies:
  - _libgcc_mutex=0.1=conda_forge
  - _openmp_mutex=4.5=2_gnu
  - binutils_impl_linux-64=2.40=ha1999f0_7
  - binutils_linux-64=2.40=hb3c18ed_9
  - bzip2=1.0.8=hda65f42_8
  - c-ares=1.34.6=hb03c661_0
  - ca-certificates=2025.11.12=hbd8a1cb_0
  - cmake=4.2.1=hc85cc9f_0
  - flex=2.6.4=h58526e2_1004
  - gcc_impl_linux-64=13.2.0=h9eb54c0_13
  - gcc_linux-64=13.2.0=h50dba11_9
  - gxx_impl_linux-64=13.2.0=h2a599c4_13
  - gxx_linux-64=13.2.0=h4ebd915_9
  - icu=75.1=he02047a_0
  - kernel-headers_linux-64=6.12.0=he073ed8_5
  - keyutils=1.6.3=hb9d3cd8_0
  - krb5=1.21.3=h659f571_0
  - ld_impl_linux-64=2.40=hf3520f5_7
  - libabseil=20250512.1=cxx17_hba17884_0
  - libbrotlicommon=1.2.0=hb03c661_1
  - libbrotlidec=1.2.0=hb03c661_1
  - libbrotlienc=1.2.0=hb03c661_1
  - libcurl=8.17.0=h4e3cde8_1
  - libedit=3.1.20250104=pl5321h7949ede_0
  - libev=4.33=hd590300_2
  - libexpat=2.7.3=hecca717_0
  - libffi=3.5.2=h9ec8514_0
  - libgcc=15.2.0=he0feb66_16
  - libgcc-devel_linux-64=13.2.0=hdb50d1a_113
  - libgcc-ng=15.2.0=h69a702a_16
  - libgomp=15.2.0=he0feb66_16
  - liblzma=5.8.1=hb9d3cd8_2
  - libmpdec=4.0.0=hb9d3cd8_0
  - libnghttp2=1.67.0=had1ee68_0
  - libsanitizer=13.2.0=h6ddb7a1_13
  - libsqlite=3.51.1=h0c1763c_1
  - libssh2=1.11.1=hcf80075_0
  - libstdcxx=15.2.0=h934c35e_16
  - libstdcxx-devel_linux-64=13.2.0=hdb50d1a_113
  - libstdcxx-ng=15.2.0=hdf11a46_16
  - libuuid=2.41.3=h5347b49_0
  - libuv=1.51.0=hb03c661_1
  - libxcrypt=4.4.36=hd590300_1
  - libzlib=1.3.1=hb9d3cd8_2
  - m4=1.4.20=hb9d3cd8_0
  - make=4.4.1=hb9d3cd8_2
  - ncurses=6.5=h2d0b736_3
  - nodejs=25.2.1=he2c55a7_1
  - openssl=3.6.0=h26f9b46_0
  - pcre2=10.47=haa7fec5_0
  - perl=5.32.1=7_hd590300_perl5
  - pip=25.3=pyh145f28c_0
  - python=3.13.11=hc97d973_100_cp313
  - python_abi=3.13=8_cp313
  - readline=8.3=h853b02a_0
  - rhash=1.4.6=hb9d3cd8_1
  - swig=4.4.1=h793e66c_0
  - sysroot_linux-64=2.39=hc4b9eeb_5
  - tk=8.6.13=noxft_ha0e22de_103
  - tzdata=2025c=h8577fbf_0
  - verible=0.0_3667_g88d12889=h434a139_0
  - verilator=5.042=h10c590a_0
  - zstd=1.5.7=hb78ec9c_6

```