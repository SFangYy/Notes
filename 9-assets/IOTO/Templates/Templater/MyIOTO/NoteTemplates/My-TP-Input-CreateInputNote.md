<%*
let prefix = tp.file.folder(true).split("/").last();
_%>

<%*
if (prefix.includes("browser")) { _%>
<%- tp.file.include("[[My-TP-Input-Browser]]") -%>
<%* } _%>

<%*
if (prefix.includes("QuickNotes")) { _%>
<%- tp.file.include("[[My-TP-Input-FragsNote]]") -%>
<%* } _%>