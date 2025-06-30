# Things to do Today

```dataviewjs
const {taskFolder, IOTOFrameworkPath, IOTOMovieTimeTags} = app.plugins.plugins["ioto-settings"].settings;
const args = {
	tags: IOTOMovieTimeTags.split(","),
	source: taskFolder,
	length: 2,
	groupList: false,
}

dv.view(`${IOTOFrameworkPath}/Dataview/Views/MovieTimes`, args);

```

# Unassigned Tasks

```dataviewjs
const {taskFolder, IOTOFrameworkPath, IOTOMovieTimeTags} = app.plugins.plugins["ioto-settings"].settings;
const args = {
	tags: IOTOMovieTimeTags.split(","),
	source: taskFolder,
	headings: [],
	groupList: false,
}

dv.view(`${IOTOFrameworkPath}/Dataview/Views/TasksList`, args);

```

# Today's TDLs

```dataviewjs
const {taskFolder} = app.plugins.plugins["ioto-settings"].settings;
const pages = dv.pages(`"${taskFolder}"`).file
	.where( f => {
	return moment(f.cday.toLocaleString()).isBetween(moment().add(-1, "days"), moment(), undefined, "[]" );
})
	.sort(f => f.mtime, "desc")
	
	dv.list(pages.link);

```

# TDLs with unfinished tasks

```dataviewjs
const {taskFolder} = app.plugins.plugins["ioto-settings"].settings;
const pages = dv.pages(`"${taskFolder}"`).file
	.where( f => {
	return f.tasks.some(t => !t.fullyCompleted && t.text) && !f.name.includes("Dashboard");
})
	.sort(f => f.mtime, "desc")
	
	dv.list(pages.link);

```

# Task Calendar

```dataview
calendar file.cday
from "3-Tasks"
where file.name != "Dashboard"
```