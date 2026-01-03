```dataviewjs

const {outcomeFolder, IOTOFrameworkPath} = app.plugins.plugins["ioto-settings"].settings;
const overviewPage = `${IOTOFrameworkPath}/Dashboard/Project-IOO-Overview.md`;

const args = {
	project: dv.page(overviewPage)?.project,
	startDate: dv.page(overviewPage)?.startDate,
	endDate: dv.page(overviewPage)?.endDate,
	search: dv.page(overviewPage)?.search,
	tags: dv.page(overviewPage)?.tags,
	source: `"${outcomeFolder}"`,
	includesAllTags: dv.page(overviewPage)?.includesAllTags,
	sortOrder: dv.page(overviewPage)?.sort?.first()
}


dv.view(`${IOTOFrameworkPath}/Dataview/Views/ProjectIOONotes`, args);

```
