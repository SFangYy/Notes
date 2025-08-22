---
Project:
  - UVM
description:
tags:
  - UVM
created: 2025-07-02 | 10:59
parent: Resource
---
# QuickNotes
## config and verify license
```bash
sssverify /home/sfangyy/synopsys/vcs/license/Synopsys.dat
```
## bashrc
- config bashrc first
- then run `lmli` command,if error 
	- if can not find licence path, you can run *script1*
	- if the port is use you canb run the script2
	- finally if its always error, you can delete `SNPSLMD_LICENSE_FILE=27000@zjc-virtual-machin`in .bashrc

```bash
#export export SYNOPSYS="/usr/software/synopsys" 
export VCS_TARGET_ARCH="amd64"
export PATH="/home/sfangyy/synopsys/vcs/O-2018.09-SP2/gui/dve/bin:"$PATH
export DVE_HOME="/home/sfangyy/synopsys/vcs/O-2018.09-SP2/gui/dve"
export PATH="/home/sfangyy/synopsys/vcs/O-2018.09-SP2/bin:"$PATH
export VCS_HOME="/home/sfangyy/synopsys/vcs/O-2018.09-SP2"
#export VCS_ARCH_OVERRIDE="linux"
#verdi
export PATH="/home/sfangyy/synopsys/verdi/Verdi_O-2018.09-SP2/bin:"$PATH
export VERDI_HOME="/home/sfangyy/synopsys/verdi/Verdi_O-2018.09-SP2"
export LD_LIBRARY_PATH="/home/sfangyy/synopsys/verdi/Verdi_O-2018.09-SP2/share/PLI/lib/LINUX64":$LD_LIBRARY_PATH
export VERDI_DIR="/home/sfangyy/synopsys/verdi/Verdi_O-2018.09-SP2"
export NOVAS_INST_DIR="/home/sfangyy/synopsys/verdi/Verdi_O-2018.09-SP2"

export NOVAS_HOME="/home/sfangyy/synopsys/verdi/Verdi_O-2018.09-SP2"
 
#LICENSE
#export LM_LICENSE_FILE="/home/sfangyy/synopsys/license/Synopsys.dat"
export SNPSLMD_LICENSE_FILE=27000@sfangyy
export LM_LICENSE_FILE="/home/sfangyy/synopsys/license/Synopsys.dat"
 
alias lmli="/home/sfangyy/synopsys/scl/2018.06/linux64/bin/lmgrd -c /home/sfangyy/synopsys/license/Synopsys.dat"
#SCL
export PATH=/home/sfangyy/synopsys/scl/2018.06/linux64/bin:$PATH
alias dve="dve -full64 &"
alias vcs64="vcs -full64"
alias verdi="verdi -full64 &"

alias cracks="LD_PRELOAD=/home/sfangyy/synopsys/scl/2018.06/linux64/bin/snpslmd-hack.so /home/sfangyy/synopsys/scl/2018.06/linux64/bin/lmgrd -c /home/sfangyy/synopsys/license/Synopsys.dat"
```

- script1
```
cd /usr
sudo mkdir tmp
cd local
sudo mkdir flexlm
cd flexlm
sudo mkdir licenses
cd licenses
sudo cp ~/synopsys/license/Synopsys.dat license.bat
```
- script2
```
lmdown
ps auf | grep lmgrd
kill -9 lmgrd 的进程号
```

- script


## key
```
/home/sfangyy/synopsys/scl/2018.06/linux64/bin/snpslmd

```

## file to obtain license 
it may in license/Synopsys.dat

or 

time zone error in docker and window
## multi lnpslmd
- create `gen-snpslmd-hack.c` in scl/2018-06/linux64/bin
- `gcc -ldl -shared -fPIC gen-snpslmd-hack.c -o snpslmd-hack.so`
- `LD_PRELOAD=./snpslmd-hack.so `

## 2. undefined reference to pthread_yield
```
    cd /home/michael/synopsys/vcs-mx/O-2018.09-SP2/linux64/lib
    mv vcs_save_restore_new.o vcs_save_restore_new.o.bak
    objcopy --redefine-sym pthread_yield=sched_yield ./vcs_save_restore_new.o.bak ./vcs_save_restore_new.o
```


## 3  libpng12.so.0: 
error while loading shared libraries: libpng12.so.0: cannot open shared object file: No such file or directory
sudo cp libpng12.so.0  /usr/lib/x86_64-linux-gnu/

然后就完成！Ubuntu19.04亲测可用，解决vlc安装，redisdesktop,mysqlworkbench安装问题。

```
cd 
libpng12.so.0  readme.txt
sfangyy@sfangyy:~/synopsys/Synopsys2024/libpng12.so.0$ cat readme.txt 
sudo cp libpng12.so.0  /usr/lib/x86_64-linux-gnu/

sfangyy@sfangyy:~/synopsys/Synopsys2024/libpng12.so.0$ sudo cp libpng12.so.0  /usr/lib/x86_64-linux-gnu/

```

```
```c
#define _GNU_SOURCE
#include <stdio.h>
#include <stdlib.h>
#include <dirent.h>
#include <dlfcn.h>
#include <string.h>

static int is_root = 0;
static int d_ino = -1;

static DIR *(*orig_opendir)(const char *name);
static int (*orig_closedir)(DIR *dirp);
static struct dirent *(*orig_readdir)(DIR *dirp);

DIR *opendir(const char *name)
{
    if (strcmp(name, "/") == 0)
        is_root = 1;
    return orig_opendir(name);
}

int closedir(DIR *dirp)
{
    is_root = 0;
    return orig_closedir(dirp);
}

struct dirent *readdir(DIR *dirp)
{
    struct dirent *r = orig_readdir(dirp);
    if (is_root && r)
    {
        if (strcmp(r->d_name, ".") == 0)
            r->d_ino = d_ino;
        else if (strcmp(r->d_name, "..") == 0)
            r->d_ino = d_ino;
    }
    return r;
}

static __attribute__((constructor)) void init_methods()
{
    orig_opendir = dlsym(RTLD_NEXT, "opendir");
    orig_closedir = dlsym(RTLD_NEXT, "closedir");
    orig_readdir = dlsym(RTLD_NEXT, "readdir");
    DIR *d = orig_opendir("/");
    struct dirent *e = orig_readdir(d);
    while (e)
    {
        if (strcmp(e->d_name, ".") == 0)
        {
            d_ino = e->d_ino;
            break;
        }
        e = orig_readdir(d);
    }
    orig_closedir(d);
    if (d_ino == -1)
    {
        puts("Failed to determine root directory inode number");
        exit(EXIT_FAILURE);
    }
}
```
```
## bash new
```bash 
###Synopsys
#这个写自己的主机名字
export SNPSLMD_LICENSE_FILE=27000@localhost.localdomain

#vcs
export VCS_HOME=/home/test/synopsys_2024/vcs/W-2024.09-SP1
export PATH=$PATH:$VCS_HOME/bin

#verdi
export LD_LIBRARY_PATH=/home/test/synopsys_2024/verdi/W-2024.09-SP1/share/PLI/VCS/linux64
export VERDI_HOME=/home/test/synopsys_2024/verdi/W-2024.09-SP1
export PATH=$PATH:$VERDI_HOME/bin
#scl
export SCL_HOME=/home/test/synopsys_2024/scl/2024.06
export PATH=$PATH:$SCL_HOME/linux64/bin
export VCS_ARCH_OVERRIDE=linux

#LICENCE
export LM_LICENSE_FILE=/home/test/synopsys_2024/scl/2024.06/admin/license/Synopsys.dat
alias lmg="lmgrd -c /home/test/synopsys_2024/scl/2024.06/admin/license/Synopsys.dat"


```
## autostart script

