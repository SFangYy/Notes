---
Project:
  - UVM
description:
tags:
  - UVM
created: 2025-09-08 | 23:05
parent: Resource
---
# 002-Browser

- The UVM testbench is activated when the run_test() methiosd called in an initial block of the HVL top level module. 
- This UVM static method takes a string argument that defines the test to be run by name and constructs it via the UVM factory. 
- The UVM infrastructure then starts the build phase by calling the build method of the test class. During the execution of the test's build phase, 
- major function 
	- the various testbench component configuration objects are prepared 
	- the virtual interfaces in these configuration objects are assigned to the associated testbench interfacees. 
	- Th configuration objects are then put into the UVM configuration database for this test. Subsequently, the next level of hierarchy is built.” ([pdf](zotero://open-pdf/library/items/HS9VQHBB?page=42&annotation=N97HSG4A))