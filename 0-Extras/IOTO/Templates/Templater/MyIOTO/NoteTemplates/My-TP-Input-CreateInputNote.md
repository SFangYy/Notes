<%*
let prefix = tp.file.folder(true).split("/").last();
_%>

<%*
if (prefix.includes("Resources")) { _%>
<%- tp.file.include("[[My-TP-Input-Resources]]") -%>
<%* } _%>

<%*
if (prefix.includes("QuickNotes")) { _%>
<%- tp.file.include("[[My-TP-Input-FragsNote]]") -%>
<%* } _%>