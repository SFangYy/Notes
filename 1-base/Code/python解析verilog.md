---
Project: ["Unitychip"]
description:
tags:
parent: Resource
---
# browser
```
import pyslang

  

file_path = "/home/sfangyy/work/02bak/UCAgent/Adder_checker.sv"

  

tree = pyslang.SyntaxTree.fromFile(file_path)

  

property_names = []

  

# 遍历语法树查找 property 定义

def find_properties(node):

if hasattr(node, 'kind'):

# 查找 property 声明

if node.kind == pyslang.SyntaxKind.PropertyDeclaration:

if hasattr(node, 'name') and hasattr(node.name, 'value'):

property_names.append(node.name.value)

print(f"找到 property: {node.name.value}")

  

# 递归遍历子节点

if hasattr(node, 'members'):

for member in node.members:

find_properties(member)

  

# 从根节点开始遍历

find_properties(tree.root)

  

print(f"\n总共找到 {len(property_names)} 个 property:")

print("=" * 50)

for i, name in enumerate(property_names, 1):

print(f"{i}. {name}")

  

# 保存到列表

print(f"\nProperty 列表: {property_names}")
```


```
import pyslang

  

verilog_code = """

module my_module (

input clk,

input logic rst_n,

input [3:0] data_in,

output logic [3:0] data_out

);

endmodule

"""

  

tree = pyslang.SyntaxTree.fromText(verilog_code)

  

# tree.root 本身就是 ModuleDeclarationSyntax，不需要遍历 members

module = tree.root

  

if module.header.ports.kind == pyslang.SyntaxKind.AnsiPortList:

for port in module.header.ports.ports:

if port.kind == pyslang.SyntaxKind.ImplicitAnsiPort:

print(f"Port Name: {port.declarator.name.value}")
```