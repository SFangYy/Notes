```dataviewjs

const {outcomeFolder, IOTOFrameworkPath} = app.plugins.plugins["ioto-settings"].settings;
const overviewPage = `${IOTOFrameworkPath}/Dashboard/Project-Outcomes-Overview.md`;

const args = {
	project: dv.page(overviewPage)?.project,
	startDate: dv.page(overviewPage)?.startDate,
	endDate: dv.page(overviewPage)?.endDate,
	search: dv.page(overviewPage)?.search,
	tags: dv.page(overviewPage)?.tags,
	includesAllTags: dv.page(overviewPage)?.includesAllTags,
	source: `"${outcomeFolder}"`,
	sortOrder: dv.page(overviewPage)?.sort?.first(),
	// New Test
	area: dv.page(overviewPage)?.area
}


dv.view(`${IOTOFrameworkPath}/Dataview/Views/ProjectIOONotes`, args);

```
