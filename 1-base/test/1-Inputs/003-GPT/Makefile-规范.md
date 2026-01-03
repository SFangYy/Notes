---
Project:
  - BuildPdb
title:
tags:
  - Makefile
  - xspdb
created: 2025-07-22 | 14:37
parent: Resource
---
# Resources
好的，一份規範、清晰的 Makefile 能極大地提高專案的可維護性和易用性。
一份好的 Makefile 應該像一份清晰的說明書，核心目標是**自動化**、**可移植**和**易於理解**。
### ## 📜 核心組成
Makefile 的基本單位是**規則 (Rule)**，它定義了如何生成目標檔案。

```
# 這是一條規則 
target: prerequisites 
		command
```

### ## ✨ 寫法規範與最佳實踐

遵循以下規範，可以讓你的 Makefile 變得專業且易於維護。
#### 1. 使用變數 (Variables)
**不要硬編碼**任何檔名或編譯器指令，永遠用變數代替。這樣當你需要修改時，只需改動一處。
- **定義變數**：使用 `VARIABLE_NAME = value` 的格式。
- **使用變數**：用 `$(VARIABLE_NAME)` 或 `${VARIABLE_NAME}`。

**常見變數約定：**

|變數|用途|範例|
|---|---|---|
|`CC`|C 編譯器|`gcc`|
|`CXX`|C++ 編譯器|`g++`|
|`CFLAGS`|C 編譯選項|`-g -Wall -O2`|
|`CXXFLAGS`|C++ 編譯選項|`-g -Wall -std=c++17`|
|`LDFLAGS`|連結器選項 (Linker Flags)|`-L/usr/local/lib`|
|`LDLIBS`|連結時所需的函式庫|`-lm -lpthread`|
|`RM`|刪除命令|`rm -f`|
|`SRCS`|來源檔案列表|`main.c utils.c`|
|`OBJS`|目標檔案列表|`main.o utils.o`|
|`TARGET`|最終生成的可執行檔|`my_app`|

```
WORK_HOME = $(abspath ./)
RTL_HOME  = $(abspath ./build/rtl)
PDB_HOME  = $(abspath ./build/xspdb)
PICKER_INCLUDE = $(shell picker --show_xcom_lib_location_cpp|grep include|awk '{print $$2}')
PYTHON_VERSION = $(shell python3 --version|awk '{print $$2}'|cut -d'.' -f1-2)
lib_diff_path  = $(abspath ./build/rtl)
SIM_LDFLAGS    = $(shell cat ./build/xspdb/python/sim_ld_flags.txt)

export LD_LIBRARY_PATH := ${lib_diff_path}
pdb_all: pdb-prepare xspython-build pdb-build

pdb-prepare:
        cd $(WORK_HOME) && NOOP_HOME=$(WORK_HOME) make sim-verilog WITH_CONSTANTIN=0 WITH_CHISELDB=0
        rm $(WORK_HOME)/build/xspdb/python -rf
        rm $(WORK_HOME)/build/xspdb/swig_obj -rf
        cd $(WORK_HOME) && NOOP_HOME=$(WORK_HOME) make -C difftest/ difftest_python WITH_CONSTANTIN=0 WITH_CHISELDB=0

xspython-build:
        cp $(WORK_HOME)/difftest/src/test/vsrc/common/* $(RTL_HOME)
        cp $(WORK_HOME)/build/xspdb/python/_difftest.so $(WORK_HOME)/build/rtl/libdifftest.so
        cd $(WORK_HOME)/build/rtl && ls|grep -E "\.sv$$|\.v$$|\.cpp$$|\.so$$"|grep -v "SimTop\.sv" > picker.f
        cd $(PDB_HOME) && time picker export $(RTL_HOME)/SimTop.sv --rw 1 -w xs.fst --lang python --tdir XSIT --fs $(RTL_HOME)/picker.f -V "--no-timing;--threads;8;+define+DIFFTEST" -C "-fPIC -lz -I$(PICKER_INCLUDE) -L$(RTL_HOME) -ldifftest -lpython${PYTHON_VERSION} ${SIM_LDFLAGS}"

pdb-build:
        cd $(PDB_HOME)/XSIT && rm -rf _difftest.so libdifftest.so difftest.py
        cp $(WORK_HOME)/build/xspdb/python/_difftest.so $(PDB_HOME)/XSIT/
        ln -s $(PDB_HOME)/XSIT/_difftest.so $(PDB_HOME)/XSIT/libdifftest.so
        cp $(WORK_HOME)/build/xspdb/python/difftest.py $(PDB_HOME)/XSIT
        cp -r $(WORK_HOME)/scripts/xspdb $(PDB_HOME)/XSPdb
        mv $(PDB_HOME)/XSIT $(PDB_HOME)/XSPdb/XSPython
        cp -r $(WORK_HOME)/ready-to-run $(PDB_HOME)/XSPdb/

pdb-compress:
        cd $(PDB_HOME) && tar czvf xspdb.tar.gz XSPdb  

pdb-test:
        cd $(PDB_HOME)/XSPdb && make test
        
pdb_clean:
        rm -rf $(PDB_HOME)/XSIT
        rm -rf __pycache__

info:
        @echo $(PDB_HOME)
        @echo "include:" $(picker_include)
"pdb.mk" 45L, 1978B                                                                                                                                   1,25          All


```