```dataviewjs

const {outputFolder, IOTOFrameworkPath} = app.plugins.plugins["ioto-settings"].settings;
const overviewPage = `${IOTOFrameworkPath}/Dashboard/Project-Outputs-Overview.md`;

const args = {
	project: dv.page(overviewPage)?.project,
	startDate: dv.page(overviewPage)?.startDate,
	endDate: dv.page(overviewPage)?.endDate,
	search: dv.page(overviewPage)?.search,
	tags: dv.page(overviewPage)?.tags,
	includesAllTags: dv.page(overviewPage)?.includesAllTags,
	source: `"${outputFolder}"`,
	sortOrder: dv.page(overviewPage)?.sort?.first()
}


dv.view(`${IOTOFrameworkPath}/Dataview/Views/ProjectIOONotes`, args);

```
