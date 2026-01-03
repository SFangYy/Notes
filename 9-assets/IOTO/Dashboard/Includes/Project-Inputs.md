```dataviewjs

const {inputFolder, IOTOFrameworkPath} = app.plugins.plugins["ioto-settings"].settings;
const overviewPage = `${IOTOFrameworkPath}/Dashboard/Project-IOO-Overview.md`;

const args = {
	project: dv.page(overviewPage)?.project,
	startDate: dv.page(overviewPage)?.startDate,
	endDate: dv.page(overviewPage)?.endDate,
	search: dv.page(overviewPage)?.search,
	tags: dv.page(overviewPage)?.tags,
	includesAllTags: dv.page(overviewPage)?.includesAllTags,
	source: `"${inputFolder}"`,
	sortOrder: dv.page(overviewPage)?.sort?.first()
}


dv.view(`${IOTOFrameworkPath}/Dataview/Views/ProjectIOONotes`, args);

```