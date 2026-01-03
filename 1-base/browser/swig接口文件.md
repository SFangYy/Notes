---
Project: ["XSPdb"]
---
# browser

- `swig.i`:
    - 作用: 为 SWIG 生成 Python 绑定的接口说明文件，告诉 SWIG 要解析哪些头文件、如何处理特定语法。
    - 主要内容: `%include` 指向需要暴露的 C/C++ 头；以及针对编译器属性（如 `__attribute__(...)`、`__packed`、`__aligned(x)`）的“忽略”宏，让 SWIG 在解析时跳过这些 GCC 扩展，避免语法报错。
    - 范围: 只影响 SWIG 的解析与生成的 Python 封装代码，不改变实际 C/C++ 编译结果或 ABI/结构体布局。
- `export.cpp`:
    - 作用: 提供一组面向 Python/上层的“导出函数”，作为运行时桥梁，封装底层仿真/环境操作，便于调用。
    - 主要内容: 初始化/释放资源、设置/获取运行参数（如 `PMEM_BASE`、`FIRST_INST_ADDRESS`）、加载代理 so、RAM/Flash 读写、步进与检查等与仿真/差分测试相关的实用函数。
    - 范围: 这些 C++ 导出函数在构建为共享库后被 Python 侧调用，实际影响运行行为，但不负责 DPI 回调代码的生成（那是 [DPIC.scala](vscode-file://vscode-app/Applications/Visual%20Studio%20Code.app/Contents/Resources/app/out/vs/code/electron-browser/workbench/workbench.html) 的职责）。