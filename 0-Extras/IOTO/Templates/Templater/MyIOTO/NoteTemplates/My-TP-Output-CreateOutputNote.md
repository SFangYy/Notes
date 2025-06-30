<%*
let prefix = tp.file.folder(true).split("/").last(); _%>

<%*
if (prefix.includes("FleetingNotes")) { _%>
<%- tp.file.include("[[My-TP-Output-FleetingNote]]") -%>
<%* } _%>

<%*
if (prefix.includes("CardNotes")) { _%>
<%- tp.file.include("[[My-TP-Output-CardNote]]") -%>
<%* } _%> 