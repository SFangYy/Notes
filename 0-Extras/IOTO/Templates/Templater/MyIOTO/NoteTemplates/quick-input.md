<%*
// 1. 定义选项
const options = [
    { label: "1. add list after task", value: "list" },
    { label: "2. input url", value: "note" },
    { label: "3. 任务", value: "task" }
];

// 2. 显示选择菜单
const selected = await tp.system.suggester(
    options.map(o => o.label), // 显示的文字
    options.map(o => o.value)  // 实际返回的值
);

// 3. 根据选择生成内容
let content;
switch (selected) {
    case "list":
        content = `\n	-  `;
        break;
    case "note":
		 let name = await tp.system.prompt("链接名称为");
		 let url = await tp.system.prompt("链接为");
		 if (name != null && url != null) {
			 content = `\n- [` + name + `](` + url+ `)`;
		 } else {
			 content = "";
		 }
        
        break;
    case "task":
        content = `# 任务\n- [ ] 待办事项\n截止日期: `;
        break;
    default:
        content = "";
}
tR += content;
_%>