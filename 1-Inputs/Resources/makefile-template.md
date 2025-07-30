---
Project: ["BuildPdb"]
title: 
description: 
source: 
author: 
tags: 
created: 2025-07-29 | 20:05
parent: Resource
branch: 
---
# Resources
- https://github.com/OpenXiangShan/XiangShan/commit/5c824f#diff-9bb3ef6cfa20777b1b22d65153ede84989ee3388b87f8c409a4a10568a082e12
this is a simply makefile about build xspdb in Xiangshan repo
its target is a file ,not a operation
use file link in filelist.f not cp file 
```Makefile
picker_include = $(shell picker --show_xcom_lib_location_cpp|grep include|awk '{print $$2}')



picker_libfile = $(shell picker --show_xcom_lib_location_cpp|grep "lib$$"|awk '{print $$2}')


GEN_CSRC_DIR = $(BUILD_DIR)/generated-src


PDB_DIR = $(BUILD_DIR)/pdb


PYTHONPATH := scripts/pdb/:$(PDB_DIR)


export PYTHONPATH





DIFFTEST_INCLUDE = $(filter -I%, $(LIB_CXXFLAGS))


$(GEN_CSRC_DIR)/difftest-swig.cpp: $(GEN_CSRC_DIR)/difftest.i


	mkdir -p $(PDB_DIR)


	swig -c++ -outdir $(PDB_DIR) -o $@ -Idifftest/src/test/csrc/difftest -Idifftest/src/test/csrc/common -python $<





#swig -Idifftest/src/test/csrc/difftest \


	     -Idifftest/src/test/csrc/common \


	     -python -outdir $(PDB_DIR) \


	     -c++ -o $@ $<





#LD_LIB       += $(shell python3-config --ldflags)


$(PDB_DIR)/_difftest.so: $(GEN_CSRC_DIR)/difftest-swig.cpp


	$(MAKE) -C ./difftest difftest-so \


		NOOP_HOME=$(NOOP_HOME) \


		CC=g++ \


		WITH_CONSTANTIN=0 WITH_CHISELDB=0 \


		EXTRA_CXXFLAGS="-std=c++20 $(shell python3-config --includes) $(addprefix -I,$(picker_include))" \


		LIBDIFFTEST_SO=$(addprefix $(shell pwd)/,$@)





$(PDB_DIR)/filelist.f: $(RTL_DIR)/filelist.f \


		       $(PDB_DIR)/_difftest.so


	mkdir -p $(dir $@)


	( \


	  find $(realpath difftest/src/test/vsrc) -name "*.v" -or -name "*.sv"; \


	  find $(realpath $(RTL_DIR)) -name array*ext.v; \


	  sed -e '/^SimTop.sv$$/d' -e 's/^/$(subst /,\/,$(realpath $(RTL_DIR)))\//' \


	      $(filter %.f,$^) \


	) > $@





pdb-build: $(PDB_DIR)/filelist.f sim-verilog


	time \


	picker export $(SIM_TOP_V) --rw 1 --lang python \


		      -V "--no-timing;--threads;8;+define+DIFFTEST;+incdir+$(realpath $(GEN_CSRC_DIR))" \


		      -C "-fPIC -lz -I$(picker_include)" \


		      --tdir $(realpath $(PDB_DIR))/dut --fs $<


pdb:


	python scripts/pdb/XSIT_test.py


```
a

# 123
