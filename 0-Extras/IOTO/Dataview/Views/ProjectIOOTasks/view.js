const { project, startDate, endDate, search, tasksFolder, tags, IOOHeading, sortOrder, includesAllTags, excludesProjects, taskStatus } = input;

if (!project || !project.length) {
    dv.paragraph("Please Choose a Porject");
    return;
}


const pages = dv.pages(tasksFolder).file.where(f => {
    return (!project || f.folder.includes(project)) && 
           f.cday >= startDate && f.cday <= endDate;
}).sort(f => f.cday, "Desc" == sortOrder ? "desc" : "asc");

const groupedPages = dv.array(pages.groupBy(p => p.folder));

let totalTasks = 0;

groupedPages.rows.forEach(group => {
    const filteredTasks = group.tasks.filter(t => {
        if (!(t.header && t.header.subpath && t.header.subpath.includes(IOOHeading) && t.text)) return false;
        if (search && !(t.text.includes(search) || t.path.includes(search))) return false;
        if ((taskStatus === "Finished" && !t.completed) || (taskStatus === "Ongoing" && t.completed)) return false;
        
        if (tags && tags.length) {
            const hasAllTags = tags.every(tag => t.tags.includes("#" + tag));
            if ((includesAllTags && !hasAllTags) || (!includesAllTags && !tags.some(tag => t.tags.includes("#" + tag)))) return false;
        }
        
        if (excludesProjects && excludesProjects.length && !excludesProjects.every(p => !t.path.includes(p))) return false;
        
        return true;
    });

    console.dir(filteredTasks.length);

    totalTasks += filteredTasks.length;


    dv.taskList(filteredTasks.sort((a, b) => {
        if (sortOrder === "Desc") {
            return ((b.path ?? '') > (a.path ?? '')) ? 1 : -1;
        } else {
            return ((a.path ?? '') > (b.path ?? '')) ? 1 : -1;
        }
    }), true);
});

if (totalTasks === 0) {
    if (taskStatus === "Ongoing") {
        dv.paragraph(`Under the currently specified conditions, the number of unfinished tasks is 0.`);
    } else if (taskStatus === "Finished") {
        dv.paragraph(`Under the currently specified conditions, the number of finished tasks is 0.`);
    } else {
        dv.paragraph(`Under the currently specified conditions，tasks is 0.`);
    }
}