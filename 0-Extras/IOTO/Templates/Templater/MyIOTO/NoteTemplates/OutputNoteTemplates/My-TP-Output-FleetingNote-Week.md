<%*
const today = tp.date.now("YYYY-MM-DD");
const monday = tp.date.weekday("YYYY-MM-DD", 0);
const tuesday = tp.date.weekday("YYYY-MM-DD", 1);
const wednesday = tp.date.weekday("YYYY-MM-DD", 2);
const thursday = tp.date.weekday("YYYY-MM-DD", 3);
const friday = tp.date.weekday("YYYY-MM-DD", 4);
const saturday = tp.date.weekday("YYYY-MM-DD", 5);
const sunday = tp.date.weekday("YYYY-MM-DD", 6);
-%>
# Fleeting Notes In a Week

## Monday <% monday %>
<%* if(today === monday) { _%>
- 
<%* } _%>

## Tuesday <% tuesday %>
<%* if(today === tuesday) { _%>
- 
<%* } _%>

## Wednesday <% wednesday %>
<%* if(today === wednesday) { _%>
- 
<%* } _%>

## Thursday <% thursday %>
<%* if(today === thursday) { _%>
- 
<%* } _%>

## Friday <% friday %>
<%* if(today === friday) { _%>
- 
<%* } _%>

## Saturday <% saturday %>
<%* if(today === saturday) { _%>
- 
<%* } _%>

## Sunday <% sunday %>
<%* if(today === sunday) { _%>
- 
<%* } _%>