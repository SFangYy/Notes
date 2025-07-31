---
Project: ["LearnTools"]
Status: Ongoing
---
## 更新配置仓库
- `make config m="xxx"`
## 更新除配置仓库以外的所有仓库
- `make push m="xxx"`

```
# --- Makefile for Git Push with Submodules ---

# 定义一个变量来接收 commit message。
# 使用 'make push m="你的提交信息"' 来调用。
# 如果没有提供 m 参数，则使用默认值 "Update"。
m ?= "Update"

# 将 m 变量导出为环境变量，这样 git submodule foreach 中的 shell 脚本才能访问到它。
export m

# .PHONY 告诉 make，'push' 不是一个文件名，而是一个需要执行的命令。
.PHONY: push info

push:
	@echo "==> 1. 正在检查并推送所有子模块..."
	# 使用 git submodule foreach 在每个子模块中执行一段 shell 脚本。
	# '$$' 是为了在 makefile 中转义 '$'，以便 shell 能正确解析。
	# 该脚本会跳过路径为 '.obsidian' 或 'obconfig' 的子模块。
	@git submodule foreach ' \
		if [ "$$path" = ".obsidian" ] || [ "$$path" = "obconfig" ]; then \
		:
	@echo "==> 1. 正在检查并推送所有子模块..."
	# 使用 git submodule foreach 在每个子模块中执行一段 shell 脚本。
	# '$$' 是为了在 makefile 中转义 '$'，以便 shell 能正确解析。
	@git submodule foreach ' \
		if [ -n "$$(git status --porcelain)" ]; then \
			echo "    -> 在子模块 [$$PWD] 中发现改动。"; \
			echo "       提交信息: \"$$m\""; \
			git add .; \
			git commit -m "$$m"; \
			git push; \
			echo "    -> 子模块 [$$PWD] 推送完成。"; \
		else \
			echo "    -> 子模块 [$$PWD] 无改动，已跳过。"; \
		fi \
	'
	@echo "\n==> 2. 正在提交并推送主仓库..."
	# 添加所有改动（包括更新后的子模块引用）
	@git add .
	# 提交主仓库
	@git commit -m "$(m)"
	# 推送主仓库
	@git push
	@echo "\n==> 操作完成！"

info: 
	@echo "commit content is $(m)"

```
