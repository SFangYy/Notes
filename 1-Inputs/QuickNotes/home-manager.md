用于生成配置文件

在nix项目的home文件夹下

通常可以分为
- lib:用于管理应用配置参数
- program:用于生成配置文件

使用home-manager
```
home-manager switch --flake .
```

简单的启用软件
```
home.program.waybar.enable = true
```

```
diff --git a/Makefile b/Makefile
index f354440d..341735f0 100644
--- a/Makefile
+++ b/Makefile
@@ -85,7 +85,7 @@ WITH_CHISELDB = 0
 WITH_CONSTANTIN = 0
 endif

-DIFFTEST_CXXFILES = $(shell find $(DIFFTEST_CSRC_DIR) -name "*.cpp")
+DIFFTEST_CXXFILES = $(shell find $(DIFFTEST_CSRC_DIR) -name "*.cpp") $(shell find $(SIM_CONFIG_DIR) -name "*.cpp")
 ifeq ($(NO_DIFF), 1)
 SIM_CXXFLAGS += -DCONFIG_NO_DIFFTEST
 else
@@ -245,6 +245,7 @@ include vcs.mk
 include palladium.mk
 include libso.mk
 include fpga.mk
+include python.mk

 clean: vcs-clean pldm-clean fpga-clean
        rm -rf $(BUILD_DIR)
diff --git a/config/config.h b/config/config.h
index d8fa5657..b54fcbbf 100644
--- a/config/config.h
+++ b/config/config.h
@@ -42,14 +42,17 @@
 #define DEFAULT_EMU_RAM_SIZE (8 * 1024 * 1024 * 1024UL) // 8 GB
 #endif

+extern uint64_t PMEM_BASE;
+extern uint64_t FIRST_INST_ADDRESS;
+
 // physical memory base address
-#define PMEM_BASE 0x80000000UL
+#define _PMEM_BASE 0x80000000UL

 // first valid instruction's address, difftest starts from this instruction
 #if defined(CPU_NUTSHELL)
-#define FIRST_INST_ADDRESS 0x80000000UL
+#define _FIRST_INST_ADDRESS 0x80000000UL
 #elif defined(CPU_XIANGSHAN) || defined(CPU_ROCKET_CHIP)
-#define FIRST_INST_ADDRESS 0x10000000UL
+#define _FIRST_INST_ADDRESS 0x10000000UL
 #endif

 // sdcard image to be used in simulation
diff --git a/src/test/csrc/difftest/difftest.h b/src/test/csrc/difftest/difftest.h
index bf9c90a2..5bad7568 100644
--- a/src/test/csrc/difftest/difftest.h
+++ b/src/test/csrc/difftest/difftest.h
@@ -180,12 +180,12 @@ public:
   void display(int coreid);

 private:
-  const static int DEBUG_GROUP_TRACE_SIZE = 16;
+  static const int DEBUG_GROUP_TRACE_SIZE = 16;
```