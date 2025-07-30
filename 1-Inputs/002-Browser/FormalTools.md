---
Project: ["Formal"]
---
# Resources# 形式化验证工具

“形式验证使用数学分析来穷尽检查设计的状态空间,从而验证设计的正确性。下图展示了 GalaxFV形式验证平台的基本使用流程” ([pdf](zotero://open-pdf/library/items/LKMYVWQI?page=24&annotation=7C4YINEL))
- 工具基础用法
- 要写什么
	- “GalaxFV需要以下输入(需求)来执行形式验证” ([pdf](zotero://open-pdf/library/items/LKMYVWQI?page=24&annotation=QYGYBWYV))
	- “以下是一个可用于FPV的Tcl脚本文件示例” ([pdf](zotero://open-pdf/library/items/LKMYVWQI?page=35&annotation=URS8RVUL))
- [[验证形式化]]
# 在验证IFU中的使用

# Code
- tcl脚本
![[Pasted image 20250605145940.png]]
## SVA怎么写
```
property p_f1_fire_after_reset;
  // This is the clocking block
  @(posedge clk) 
  // Disable the property while rst_n is low, and restart it when rst_n goes high
  disable iff (!rst_n) 
  (f1_valid && f1_ready) |-> ##1 f1_fire;
endproperty

// Assert this property in your module
assert property (p_f1_fire_after_reset) else $error("F1 fire condition violated!");
```