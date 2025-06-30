const {tags, source, headings, groupList} = input;

const mtimes = tags;

const tasks = dv.pages(`"${source}"`).file.tasks
.where(t => !t.completed && t.text)
.where(t => {
    return mtimes.every(mtag => {
        const tagContent = "#".concat(mtag); 
        return !t.text.includes(tagContent)
    });
})
.map(t => {
    t.visual = t.text + " " + "[[" + t.link.obsidianLink() + "|🔗]]" ;
    return t;
});

if(headings.length) {
    headings.forEach( type => {
        let subTasks = tasks.filter( task => task.section.subpath.includes(type));
    
        if(subTasks.length) {
            dv.header(3, type);
            dv.taskList(subTasks, groupList);
        }
    });
} else {
    dv.taskList(tasks, groupList);
}



