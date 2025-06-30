```dataviewjs

const {taskFolder, IOTOFrameworkPath, LTDListOutcomeSectionHeading} = app.plugins.plugins["ioto-settings"].settings;
const overviewPage = `${IOTOFrameworkPath}/Dashboard/Project-Tasks-Overview.md`;

const args = {
	project: dv.page(overviewPage)?.project,
	startDate: dv.page(overviewPage)?.startDate,
	endDate: dv.page(overviewPage)?.endDate,
	search: dv.page(overviewPage)?.search,
	tags: dv.page(overviewPage)?.tags,
	includesAllTags: dv.page(overviewPage)?.includesAllTags,
	tasksFolder: `"${taskFolder}"`,
	IOOHeading: LTDListOutcomeSectionHeading,
	sortOrder: dv.page(overviewPage)?.sort?.first(),
	taskStatus: dv.page(overviewPage)?.taskStatus?.first(),
}


dv.view(`${IOTOFrameworkPath}/Dataview/Views/ProjectIOOTasks`, args);


```
