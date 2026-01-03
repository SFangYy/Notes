const {source, numberOfDays} = input;

const pages = dv.pages(`"${source}"`).file
	.where( f => {
		return moment(f.mtime.toISO()).isBetween(moment().local().subtract(numberOfDays, "days"), moment().local(), undefined, "[]" );
	})
	.where (f => !f.name.includes("Dashboard"))
	.sort(f => f.mtime, "desc")
	.groupBy( f => f.folder);

pages.forEach(group => {
		dv.el("strong", `${group.key}`);
		dv.list(group.rows.link);
})