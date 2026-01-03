# Ongoing Outcomes

```dataviewjs
const {outcomeFolder} = app.plugins.plugins["ioto-settings"].settings;
const pages = dv.pages(`"${outcomeFolder}"`).file
	.where( f => {
	return f.frontmatter.Status && f.frontmatter.Status == "Ongoing"}
	)
	.where( f => !f.name.includes("Dashboard"))
	.sort(f => f.mtime, "desc")
	.groupBy( f => f.folder);
	
pages.forEach(group => {
	dv.el("strong", `${group.key}`);
	dv.list(group.rows.link);
})
```

# Finished Outcomes


```dataviewjs
const {outcomeFolder} = app.plugins.plugins["ioto-settings"].settings;
const pages = dv.pages(`"${outcomeFolder}"`).file
	.where( f => { 
	return f.frontmatter.Status && f.frontmatter.Status == "Finished"}
	)
	.where( f => !f.name.includes("Dashboard"))
	.sort(f => f.mtime, "desc")
	.groupBy( f => f.folder);
	
pages.forEach(group => {
	dv.el("strong", `${group.key}`);
	dv.list(group.rows.link);
})
```