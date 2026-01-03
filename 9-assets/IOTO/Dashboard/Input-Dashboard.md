# Notes Modified In Last 3 Days

```dataviewjs
const {inputFolder, IOTOFrameworkPath} = app.plugins.plugins["ioto-settings"].settings;

const args = {
	source: inputFolder,
	numberOfDays: 3
}

dv.view(`${IOTOFrameworkPath}/Dataview/Views/NotesModified`, args);
```


# Notes Created In Last 3 Days

```dataviewjs
const {inputFolder, IOTOFrameworkPath} = app.plugins.plugins["ioto-settings"].settings;

const args = {
	source: inputFolder,
	numberOfDays: 3
}

dv.view(`${IOTOFrameworkPath}/Dataview/Views/NotesCreated`, args);
```
