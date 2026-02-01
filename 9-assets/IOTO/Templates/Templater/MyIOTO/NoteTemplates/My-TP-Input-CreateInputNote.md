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

<%*
if (prefix.includes("AI")) { _%>
<%- tp.file.include("[[My-TP-Input-SystematicNote]]") -%>
<%* } _%>

<%*
if (prefix.includes("Code")) { _%>
<%- tp.file.include("[[My-TP-Input-Code]]") -%>
<%* } _%>