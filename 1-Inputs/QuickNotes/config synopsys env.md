---
Project: ["UVM"]
title: 
description: 
source: 
author: 
tags: 
created: 2025-07-02 | 10:59
parent: Resource
branch: 
---
# QuickNotes
## config and verify license
```bash
sssverify /home/zjc/vcs/license/Synopsys.dat
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
export PATH="/home/sfangyy/vcs/vcs2018/vcs/O-2018.09-SP2/gui/dve/bin:"$PATH
export DVE_HOME="/home/sfangyy/vcs/vcs2018/vcs/O-2018.09-SP2/gui/dve"
export PATH="/home/sfangyy/vcs/vcs2018/vcs/O-2018.09-SP2/bin:"$PATH
export VCS_HOME="/home/sfangyy/vcs/vcs2018/vcs/O-2018.09-SP2"
#export VCS_ARCH_OVERRIDE="linux"
#verdi
export PATH="/home/sfangyy/vcs/verdi/verdi/Verdi_O-2018.09-SP2/bin:"$PATH
export VERDI_HOME="/home/sfangyy/vcs/verdi/verdi/Verdi_O-2018.09-SP2"
export LD_LIBRARY_PATH="/home/sfangyy/vcs/verdi/verdi/Verdi_O-2018.09-SP2/share/PLI/lib/LINUX64":$LD_LIBRARY_PATH
export VERDI_DIR="/home/sfangyy/vcs/verdi/verdi/Verdi_O-2018.09-SP2"
export NOVAS_INST_DIR="/home/sfangyy/vcs/verdi/verdi/Verdi_O-2018.09-SP2"
export NPI_PLATFORM="LINUX64_GNU_472"
export LD_LIBRARY_PATH="$NOVAS_INST_DIR/share/NPI/lib/LINUX64_GNU_520":$LD_LIBRARY_PATH
export NOVAS_HOME="/home/sfangyy/vcs/verdi/verdi/Verdi_O-2018.09-SP2"
 
#LICENSE
export SNPSLMD_LICENSE_FILE="/home/sfangyy/vcs/license/Synopsys.dat"
export SNPSLMD_LICENSE_FILE=27000@sfangyy-virtual-machine
export LM_LICENSE_FILE="/home/sfangyy/vcs/license/Synopsys.dat"
 
alias lmli="/home/sfangyy/vcs/SCL2018/scl/2018.06/linux64/bin/lmgrd -c /home/sfangyy/vcs/license/Synopsys.dat"
#SCL
export PATH=/home/sfangyy/vcs/SCL2018/scl/2018.06/linux64/bin:$PATH
alias dve="dve -full64 &"
alias vcs64="vcs -full64"
alias verdi="verdi -full64 &"
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
sudo cp ~/vcs/license/Synopsys.dat license.bat
```
- script2
```
lmdown
ps auf | grep lmgrd
kill -9 lmgrd 的进程号
```

## autostart script

