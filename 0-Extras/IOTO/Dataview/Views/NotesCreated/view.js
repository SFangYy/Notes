const {source, numberOfDays} = input;

const pages = dv.pages(`"${source}"`).file
	.where( f => {
	return moment(f.ctime.toISO()).isBetween(moment().subtract(numberOfDays, "days"), moment(), undefined, "[]" );})
	.where( f => !f.name.includes("Dashboard"))
	.sort(f => f.ctime, "desc")
	.groupBy( f => f.folder);
	
pages.forEach(group => {
	dv.el("strong", `${group.key}`);
	dv.list(group.rows.link);
})