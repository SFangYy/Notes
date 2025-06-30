async function IOTOLoadTemplate(tp, tR, app, defaultTemplate, include = true) {
  const { useUserTemplate, userTemplatePrefix } =
    app.plugins.plugins["ioto-settings"].settings;
  const templatePrefix = userTemplatePrefix || "My";
  // 这段代码使用三元运算符来决定使用哪个模板
  // 如果 useUserTemplate 为 true，则进行以下检查:
  //   1. 首先检查是否存在 `${templatePrefix}-${defaultTemplate}` 模板
  //   2. 如果不存在，则检查是否存在 `My-${defaultTemplate}` 模板
  //   3. 如果两者都不存在，则使用 defaultTemplate
  // 如果 useUserTemplate 为 false，直接使用 defaultTemplate

  const templateToUse = useUserTemplate
    ? tp.file.find_tfile(`${templatePrefix}-${defaultTemplate}`)
      ? `${templatePrefix}-${defaultTemplate}`
      : tp.file.find_tfile(`My-${defaultTemplate}`)
      ? `My-${defaultTemplate}`
      : defaultTemplate
    : defaultTemplate;

  if (include) {
    const file = tp.file.find_tfile(templateToUse);
    tR += await tp.file.include(file);
    return tR;
  } else {
    return templateToUse;
  }
}

module.exports = IOTOLoadTemplate;
