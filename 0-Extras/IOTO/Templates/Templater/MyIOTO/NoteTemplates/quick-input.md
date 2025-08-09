<%*
// 1. 定义选项
const options = [
    { label: "1. add list after task", value: "list" },
    { label: "2. 笔记", value: "note" },
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
        content = `# 笔记\n主题: \n来源: `;
        break;
    case "task":
        content = `# 任务\n- [ ] 待办事项\n截止日期: `;
        break;
    default:
        content = "# 默认内容";
}
tR += content;
_%>