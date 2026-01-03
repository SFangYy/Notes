/*
 ** Script Name: IOTO Get File or Link From Folder
 ** Author: Johnny
 ** Bilibili: https://space.bilibili.com/432408734
 ** Version: 1.7.0
 */
async function IOTOGetFileOrLinkFromFolder(tp, path, link = false) {
  const files = app.vault
    .getMarkdownFiles()
    .filter((t) => t.parent.path === path || t.parent.name === path);

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

module.exports = IOTOGetFileOrLinkFromFolder;
