async function habittracker(tag) {
  const file = this.currentFile;
  if (!tag || tag === "" || typeof tag !== "string") {
    new obsidian.Notice(
      "section: tag is required and should be a string"
    );
    return "";
  }
  if (!file || file.extension !== "md") {
    return "";
  }

  const content = await app.vault.cachedRead(file, tag);
  const res = parseTaggedSection(content, tag);
  return res.join("\n\n");
}

function parseTaggedSection(text, tag) {
  const content = text.replace(/^---[\s\S]*?---\s?/, "");
  //const paragraph = content.replace(/\n(?=## )/, "- [ ] "); 
  // const paragraphs = content.split(/\n(?=### )/) || [];
  const paragraphs = content.split(/\n(?=^#+ )/m);
  
  const matchingParagraphs = paragraphs.filter((p) => p.includes(tag));
  const cleanedParagraphs = matchingParagraphs.map(p => 
  p.replace(tag, "").trim() // 使用 .replace() 移除标签，.trim() 去掉多余的空格
);
  
  return cleanedParagraphs;
}

exports.default = {
  name: "habittracker",
  description: `

- 使用方式

包含指定标签的段落

\`\`\`js
habittracker("#锻炼")
\`\`\`

包含指定文本的段落

\`\`\`js
habittracker("天气: 晴")
\`\`\`

  `,
  entry: habittracker,
};
