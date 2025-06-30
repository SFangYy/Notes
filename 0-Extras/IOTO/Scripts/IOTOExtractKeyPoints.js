async function IOTOExtractKeyPoints(content, tp, tR) {
  const ml = new (tp.user.IOTOMultiLangs())();
  const regexPatterns = {
    strong: /\*\*([^\*]+)\*\*/g,
    highlight: /\=\=([^\=]+)\=\=/g,
    italic: /(?<![*_])(?:\*([^*\n]+)\*|_([^_\n]+)_)(?![*_])/g,
    underline: /<u>(.*?)<\/u>/gs,
    heading: /(#{1,6}\s.+)/g,
    keyword: null,
  };

  const extractChoices = [
    ml.t("ExtractBoldContent"),
    ml.t("ExtractHighlightContent"),
    ml.t("ExtractItalicContent"),
    ml.t("ExtractUnderlineContent"),
    ml.t("ExtractHeadings"),
    ml.t("ExtractLinesContainingKeyword"),
  ];

  const extractOption = await tp.system.suggester(
    extractChoices.map((item, index) => `${index + 1}. ${item}`),
    Object.keys(regexPatterns)
  );
  if (!extractOption) return "";

  if (extractOption === "keyword") {
    const keyword = await tp.system.prompt(ml.t("PleaseInputKeyword"));
    if (!keyword) return ml.t("KeywordNotInput");

    const keywordRegex = new RegExp(`^.*${keyword}.*$`, "gm");
    const matches = content.match(keywordRegex) || [];
    return matches.length
      ? matches.join("\n\n")
      : ml.t("NoLinesContainingKeyword");
  }

  const selectedRegex = regexPatterns[extractOption];
  const matches = [];
  let match;

  while ((match = selectedRegex.exec(content)) !== null) {
    matches.push(match[1] || match[2] || match[0]);
  }

  if (!matches.length) return ml.t("NoMatchingContent");

  const result =
    extractOption === "heading"
      ? matches.join("\n")
      : matches.map((line) => "- " + line.trim()).join("\n");

  const choice = await tp.system.suggester(
    [ml.t("OutputToKeyPointsFile"), ml.t("OutputToCurrentFile")],
    ["new", "current"]
  );

  if (choice === "new") {
    const newNoteTitle = `${tp.file.title} - ${ml.t("KeyPoints")}`;
    const existingFile = app.vault.getAbstractFileByPath(
      `${tp.file.folder(true)}/${newNoteTitle}.md`
    );
    if (existingFile) {
      const existingContent = await app.vault.read(existingFile);
      await app.vault.modify(existingFile, existingContent + "\n\n" + result);
    } else {
      await tp.file.create_new(
        result,
        newNoteTitle,
        true,
        tp.file.folder(true)
      );
    }
    tR = "";
  } else if (choice === "current") {
    tR = result;
  }
  return tR;
}

module.exports = IOTOExtractKeyPoints;
