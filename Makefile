# --- Makefile for Git Push with Submodules ---

# 定义一个变量来接收 commit message。
# 使用 'make push m="你的提交信息"' 来调用。
# 如果没有提供 m 参数，则使用默认值 "Update"。
m ?= "Update"

# 将 m 变量导出为环境变量，这样 git submodule foreach 中的 shell 脚本才能访问到它。
export m

# .PHONY 告诉 make，'push' 不是一个文件名，而是一个需要执行的命令。
.PHONY: push info

config: 
	@echo "\n==> 2. 正在提交并推送主仓库..."
	cd .obsidian 
	# 添加所有改动（包括更新后的子模块引用）
	@cd .obsidian && git add .
	# 提交config仓库
	@@cd .obsidian && git commit -m "$(m)"
	# 推送config仓库
	@@cd .obsidian && git push
	@echo "\n==> config操作完成！"

# 'push' 是我们的主要任务
push:
	@echo "==> 1. 正在检查并推送所有子模块..."
	# 使用 git submodule foreach 在每个子模块中执行一段 shell 脚本。
	# '$$' 是为了在 makefile 中转义 '$'，以便 shell 能正确解析。
	# 该脚本会跳过路径为 '.obsidian' 或 'obconfig' 的子模块。
	@git submodule foreach ' \
		if [ "$$path" = ".obsidian" ] || [ "$$path" = "obconfig" ]; then \
			echo "    -> 跳过子模块 [$$path] (根据规则)。"; \
		else \
			if [ -n "$$(git status --porcelain)" ]; then \
				echo "    -> 在子模块 [$$path] 中发现改动。"; \
				echo "       提交信息: \"$$m\""; \
				git add .; \
				git commit -m "$$m"; \
				git push; \
				echo "    -> 子模块 [$$path] 推送完成。"; \
			else \
				echo "    -> 子模块 [$$path] 无改动，已跳过。"; \
			fi; \
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

init:
	git submodule update  --init

info: 
	@echo "commit content is $(m)"
