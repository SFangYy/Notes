<%*
let content = tp.file.content;
content = content.replace(/[\*\=_]/g, "");
await app.vault.modify(tp.config.active_file, content);
_%>