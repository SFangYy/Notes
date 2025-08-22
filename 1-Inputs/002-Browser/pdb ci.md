---
Project:
  - BuildPdb
title:
description:
source:
author:
tags:
  - xspdb
created: 2025-07-21 | 14:21
parent: Resource
branch:
---
# Resources
```
name: Release XSPdb Jobs
on:
  push:
    branches: [master, pdb]
  pull_request:
    branches: [master, pdb]
jobs:
  build-xsdev-image:
    runs-on: bosc 
    container: ghcr.io/openxiangshan/xspdb:build-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set Env 
        run: |
          echo "RTL_HOME=$GITHUB_WORKSPACE/build/rtl" >> $GITHUB_ENV 
          echo "PDB_HOME=$GITHUB_WORKSPACE/scripts/xspdb" >> $GITHUB_ENV 
      - name: Init Xiangshan
        run: make init
      - name: Setup mill
        uses: jodersky/setup-mill@v0.3.0
        with:
          mill-version: 0.12.3 
      - name: Build XSPdb 
        run: |
          cd $PDB_HOME 
          make NOOP_HOME="$GITHUB_WORKSPACE" RTL_HOME="$RTL_HOME" PDB_HOME="$PDB_HOME"
      - name: Upload XSPdb
        uses: actions/upload-artifact@v4 
        with:
          name: xspdb-${{ github.sha }} 
          path: $PDB_HOME/xspdb.tar.gz 

```


```
WORK_HOME = $(abspath ../..)
RTL_HOME  = $(abspath ../../build/rtl)
PICKER_INCLUDE = $(shell picker --show_xcom_lib_location_cpp|grep include|awk '{print $$2}')
PYTHON_VERSION = $(shell python3 --version|awk '{print $$2}'|cut -d'.' -f1-2)
lib_diff_path  = $(abspath ../../build/rtl)
SIM_LDFLAGS    = $(shell cat ../../build/python/sim_ld_flags.txt)

export LD_LIBRARY_PATH := ${lib_diff_path}

all: prepare_xs  update_env build_xspython update_lib build_pdb archive_xspdb

prepare_xs:
	cd $(WORK_HOME) && NOOP_HOME=$(WORK_HOME) make sim-verilog WITH_CONSTANTIN=0 WITH_CHISELDB=0
	rm $(WORK_HOME)/build/xspdb/python -rf
	rm $(WORK_HOME)/build/xspdb/swig_obj -rf
	cd $(WORK_HOME) && NOOP_HOME=$(WORK_HOME) make -C difftest/ difftest_python WITH_CONSTANTIN=0 WITH_CHISELDB=0

update_env:
	cp $(WORK_HOME)/difftest/src/test/vsrc/common/* $(RTL_HOME)
	cp $(WORK_HOME)/build/xspdb/python/_difftest.so $(WORK_HOME)/build/rtl/libdifftest.so
	cd $(WORK_HOME)/build/rtl && ls|grep -E "\.sv$$|\.v$$|\.cpp$$|\.so$$"|grep -v "SimTop\.sv" > picker.f

build_xspython:
	time picker export $(RTL_HOME)/SimTop.sv --rw 1 -w xs.fst --lang python --tdir XSIT --fs $(RTL_HOME)/picker.f -V "--no-timing;--threads;8;+define+DIFFTEST" -C "-fPIC -lz -I$(PICKER_INCLUDE) -L$(RTL_HOME) -ldifftest -lpython${PYTHON_VERSION} ${SIM_LDFLAGS}"

update_lib:
	cd XSIT && rm -rf _difftest.so libdifftest.so difftest.py
	cd XSIT && cp $(WORK_HOME)/build/xspdb/python/_difftest.so .
	cd XSIT && ln -s _difftest.so libdifftest.so
	cd XSIT && cp $(WORK_HOME)/build/xspdb/python/difftest.py .

build_pdb:
	git clone https://github.com/OpenXiangShan/XSPdb.git
	mv XSIT XSPdb/XSPython
	cd XSPdb 
	wget https://github.com/OpenXiangShan/XSPdb/releases/download/v0.1.0-test/ready-to-run.tar.gz 
	tar zxvf ready-to-run.tar.gz 

archive_xspdb:
	tar czvf xspdb.tar.gz XSPdb  

clean:
	rm -rf XSIT
	rm -rf __pycache__


```