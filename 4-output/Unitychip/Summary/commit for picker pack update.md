---
Project: ["Unitychip"]
Status: Ongoing
---
## 新commit
### src
```
feat(pack): refactor pack structure and support DUT abstraction generation
     
- Update pack function structure for better maintainability:
	- Refactored `src/codegen/uvm.cpp` by modularizing directory setup and template rendering logic.

- Implement automated DUT abstraction generation:
    - Introduced `-d` flag to generate DUT abstraction classes.
	- Added support for parsing RTL module ports directly via `--from-rtl`.

- Revamp UVM and Python template architecture:
	- Introduced `dut.py`, `xagent.py` and `utils_pkg.sv` to decouple logic.
	- Standardized template output structure for easier integration.

- Reduced file duplication and cleaner project structure:
	- Removed legacy example files and unified generated output directories.
```

## 原始commit
feat(uvm): implement DUT Pack core functionality with package separation

Core Changes:
- Refactor UVM Pack templates with parameterized design and type annotations
- Add DUT class abstraction for pin-level interface and step-based simulation
- Implement package separation architecture (TransactionName_pkg)
- Optimize directory structure with _pkg for UVM components

Key Features:
- DUT class with step(n) method for simulation control
- Auto-sync Monitor data to Python DUT instance
- Simplified API: dut.a.value instead of transaction objects
- Source files stay in user directory (no copying)
- Automatic cleanup of build artifacts

Template Updates:
- xagent.sv: Enhanced for bidirectional data transfer
- xagent.py: Package import support and unified naming
- xdut.py: High-level DUT wrapper
- Makefile: Optimized VCS build process
---

feat(uvm): optimize code generation and serialization

Code Generation Enhancements:
- Support both single-transaction and multi-transaction modes
- Pre-compute byte offsets for all transaction fields
- Add struct format characters (B/H/I/Q) for standard-aligned fields
- Generate picker_uvm_utils_pkg.sv for shared SystemVerilog utilities
- Remove redundant metadata fields from templates

Serialization Optimizations:
- Use struct.pack for standard-aligned fields (1/2/4/8 bytes)
- Optimize from_msg/to_bytes with pre-computed offsets
- Add parameter validation and boundary checking
- Improve performance by reducing runtime overhead

Template Improvements:
- Add unified example files (example.py, example.sv, example_dut.sv)
- Simplify serialization logic using utility package
- Use factory override pattern instead of direct type configuration
- Remove deprecated example files and inconsistent naming
- Enhanced Makefile for better DUT Pack workflow support
---

feat(example): reorganize Pack examples with comprehensive demos

Reorganize and enhance example/Pack directory structure:

Transaction updates:
- Enhance adder_trans.sv to 128-bit adder with carry in/out signals
- Add comprehensive field documentation

Test infrastructure:
- Reorganize release-pack.sh with test_basic, test_send, test_recv, test_dut, test_multi, test_adder
- Update path references to new directory structure
- Add unified Makefile for all examples
- Add README.md with usage instructions

New example directories:
- 01_Py2UVM: Python to UVM communication examples
- 02_UVM2Py: UVM to Python communication examples
- 04_MultiTrans: Multi-transaction ALU examples
- 05_FullAdderDemo: Complete full adder demonstration
---
refactor(uvm): simplify naming and path handling

File Naming Simplification:
- Shorten generated filenames for better usability
  - adder_trans_xagent.py -> xagent.py
  - adder_trans_xagent.sv -> xagent.sv
  - picker_uvm_utils_pkg.sv -> utils_pkg.sv
- Update all template imports and includes accordingly

Path Handling Improvements:
- Use relative include paths instead of copying transaction files
- Add +incdir+.. to Makefile for parent directory access
- Update release-pack.sh to remove redundant file copies
- Reference DUT files via relative paths (e.g., ../../Adder/Adder.v)

Code Organization:
- Update pack function structure for better maintainability
- Initialize pack_opts struct members with defaults
- Update example files to use new Agent API
- Clean up obsolete template files

Benefits:
- Single source of truth for transaction definitions
- Reduced file duplication and cleaner project structure
- Improved code maintainability and consistency