---
Project: ["XSPdb"]
---
# browser

hello，我定位了一下目前遇到的 segment fault，之前遇到的 DPIC 越界问题应该已经解决了，目前遇到的新问题来自 xspdb 调用 difftest_init 的问题https://github.com/OpenXiangShan/difftest/pull/738)  中修改了 difftest_init、init_nemuproxy 接口，可能需要麻烦 xspdb 进行一下适配：

difftest子仓库做了一些修改，需要对script/xspdb下的功能做了一些适配，请你完成他
1. difftest_init 添加了参数 enable_diff 和 ram_size，我尝试将 xspdb.py 中传参时指定 default_file = args.image，同时
	-  self.df.difftest_init() 改为 self.df.difftest_init(True, default_file) 会遇到段错误，出错现场可见 PR#5188 的 CI；
	 - 改为 self.df.difftest_init(False, default_file)，可以正常运行；
2. 上述段错误的原因是，enable_diff 为 True 时，difftest_init 会调用 init_goldenmem 和 update_nemuproxy.其中：
	 - init_goldenmem 需要在 difftest_init 前，首先调用 init_ram 进行初始化，对应你们的 api_init_mem，我目前的解决方法是 xspdb 传参指定 default_file = args.image
	 - update_nemuproxy 需要指定 NEMU_HOME 或 nemu so 的路径，如 ready-to-run/riscv64-nemu-interpreter-so，应该对应你们的 api_load_ref_so。
	 -  此外，删除了 init_nemuproxy 函数，可能需要你们相应删除一下对应的接口