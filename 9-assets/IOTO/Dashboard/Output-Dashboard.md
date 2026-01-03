# Notes Modified In Last 24 Hours

```dataviewjs
const {outputFolder, IOTOFrameworkPath} = app.plugins.plugins["ioto-settings"].settings;

const args = {
	source: outputFolder,
	numberOfDays: 2
}

dv.view(`${IOTOFrameworkPath}/Dataview/Views/NotesModified`, args);
```