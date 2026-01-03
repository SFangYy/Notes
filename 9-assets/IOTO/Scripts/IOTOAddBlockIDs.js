async function IOTOAddBlockIDs(tp, tR, settings = {}) {
  const ml = new (tp.user.IOTOMultiLangs(tp))(tp);
  let { date, prefix, useSingleLineAsSeparator } = settings;

  const iotoSettings = app.plugins.plugins["ioto-settings"].settings;

  date =
    date ||
    (await tp.system.prompt(
      ml.t("InputDate"),
      tp.date.now(iotoSettings.iotoUtilsQuickBlockIdDateFormat)
    ));
  prefix =
    prefix ||
    (await tp.system.suggester(
      (item) => item,
      iotoSettings.iotoUtilsQuickBlockTypes.trim().split("\n")
    ));
  useSingleLineAsSeparator =
    useSingleLineAsSeparator ||
    iotoSettings.iotoUtilsQuickBlockIdUseSingleLineAsSeparator;

  if (!date) return "";

  const vault = app.vault;
  const file = app.workspace.getActiveFile();

  const fullContent = tp.file.content;
  const fm = app.metadataCache.getFileCache(file)?.frontmatter;
  const fmPosition = app.metadataCache.getFileCache(file)?.frontmatterPosition;
  const blockIDReg = /\s\^[^\s]+/g;
  const separator = useSingleLineAsSeparator ? "\n" : "\n\n";
  let docArray = fullContent.split("\n");

  let betaContentArray, fmArray;

  betaContentArray = fmPosition
    ? docArray.slice(fmPosition.end.line + 1)
    : docArray;
  fmArray = fmPosition ? docArray.slice(0, fmPosition.end.line + 1) : [];

  let contentArray = betaContentArray.join("\n");

  contentArray = contentArray.split(separator);

  let checkLine = (line) => {
    return (
      line.trim() !== "" &&
      !line.trim().startsWith("#") &&
      !line.trim().match(/^>\s*$/g)
    );
  };

  let orderedContentArray = contentArray.map((line, index) => {
    return checkLine(line) ? `${index}%${line}` : line;
  });

  let pureContentArray = orderedContentArray.filter((line) => {
    return checkLine(line);
  });

  let blockedContentArray = contentArray.map((line, index) => {
    if (!checkLine(line)) {
      return line;
    }

    const newline = line.replace(blockIDReg, "");
    const indexLine = `${index}%` + line;
    const blockId = `^${prefix}-${date}-${
      pureContentArray.indexOf(indexLine) + 1
    }`;

    return separator === "\n"
      ? `${newline} ${blockId}`
      : `${newline}\n${blockId}`;
  });
  const fmContent = fmArray.length ? fmArray.join("\n") + "\n" : "";

  await vault.modify(file, fmContent + blockedContentArray.join(separator));

  await new Promise((r) => setTimeout(r, 100)); //wait for metadata to update, steal from obsidian excalidraw
}

module.exports = IOTOAddBlockIDs;
