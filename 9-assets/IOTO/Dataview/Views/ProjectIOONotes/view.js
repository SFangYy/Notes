const {
  project,
  startDate,
  endDate,
  search,
  tags,
  source,
  sortOrder,
  includesAllTags,
  excludesProjects,
  area,
} = input;

if (!project || !project.length) {
  dv.paragraph("Please Choose A Project");
  return;
}

const pages = dv.pages(source).file.where((f) => {

  const inPath = !project || f.inlinks.some((lf) => lf.path.includes(project));

  const inDateRange = moment(f.cday.toISO()).isBetween(
    moment(startDate.toISO()),
    moment(endDate.toISO()),
    undefined,
    "[]"
  );

  const matchesSearch = !search || f.path.includes(search);

  const matchesTags =
    !tags ||
    !tags.length ||
    (includesAllTags
      ? tags.every((t) => f.tags.includes("#" + t))
      : tags.some((t) => f.tags.includes("#" + t)));


  const notExcluded =
    !excludesProjects ||
    !excludesProjects.length ||
    excludesProjects.every((p) => !f.path.includes(p));

  const inArea =
    !area || !area.length || area.some((a) => f.frontmatter?.Area?.includes(a));

  return (
    inPath &&
    inDateRange &&
    matchesSearch &&
    matchesTags &&
    notExcluded &&
    inArea
  );
});

const groupedPages = dv.array(
  pages
    .sort((p) => p.cday, "Desc" == sortOrder ? "desc" : "asc")
    .groupBy((p) => p.folder)
);

dv.paragraph(`Notes in ${source}：${pages.length}`);

const fragment = document.createDocumentFragment();

groupedPages.forEach((group) => {
  const strong = document.createElement("strong");
  strong.textContent = `${group.key} （${group.rows.length}）`;
  fragment.appendChild(strong);
  const ul = document.createElement("ul");
  group.rows.forEach((row) => {
    const li = document.createElement("li");
    li.appendChild(
      dv.el("a", row.name, {
        href: row.path,
        cls: "internal-link",
        attr: { target: "_blank", rel: "noopener nofollow" },
      })
    );
    ul.appendChild(li);
  });
  fragment.appendChild(ul);
});

dv.container.appendChild(fragment);