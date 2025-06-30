const {tags, source, length, groupList} = input;

let dateString =(dv.current().useMtDate && dv.current().mtDate) ? moment(dv.current().mtDate.toLocaleString()).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");
// const newPath = `'"${path}"'`;
const mtimes = tags;
mtimes.forEach( mtag => {
    const tagContent = "#".concat(mtag); 
	const tasks = dv.pages(`"${source}"`).file.tasks
	.where(t => t.path.includes(dateString) && t.text.includes(tagContent))
	.map(t => {
		t.visual = t.text.replace(tagContent + " ","") + `${length ? " **" :""}` + t.section.subpath.substring(0,length) + `${length ? "** " :""}` + "[[" + t.link.obsidianLink() + "|🔗]]" ;
		return t;
	});

	
	if(tasks.length) {
		dv.header(3, mtag);
		dv.taskList(tasks, groupList);
	}
})