async function IOTOGetFileOrLinkFromFolderAndSubFolders(
  tp,
  path,
  link = false
) {
  const files = app.vault
    .getMarkdownFiles()
    .filter((t) => t.parent.path.startsWith(path));

  let choices = [];
  let options = [];

  files.forEach((t, index) => {
    const option = index + 1;
    const choice = `${option}. ${t.basename}`;
    choices.push(choice);
    options.push(index);
  });

  const templateIndex = await tp.system.suggester(choices, options);

  if (templateIndex === null) {
    return null;
  }

  return link
    ? `[[${app.metadataCache.fileToLinktext(
        files[templateIndex],
        app.vault.getName()
      )}]]`
    : files[templateIndex];
}

module.exports = IOTOGetFileOrLinkFromFolderAndSubFolders;
