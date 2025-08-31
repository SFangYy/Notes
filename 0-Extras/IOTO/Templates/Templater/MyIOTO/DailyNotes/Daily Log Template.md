---
tags:
  - daily-log
  - <%moment(tp.file.title).format("gggg-[W]ww")%>
date: <%moment(tp.file.title).format("YYYY-MM-DD")%>
week: <%moment(tp.file.title).format("gggg-[W]ww") %>
read: 
write: 
log: 
workout: 
cssclasses:
  - hideProperties
---
## Links
- [[2-Areas/009-daily/5.Yearly Log/<%moment(tp.file.title).format("YYYY")%>|Yearly Log]]
- [[2-Areas/009-daily/<%tp.date.now("YYYY-MM-DD", -1, tp.file.title, "YYYY-MM-DD")%>|<%tp.date.now("MM-DD", -1, tp.file.title, "YYYY-MM-DD")%>]]<--<%moment(tp.file.title).format("MM-DD")%>-->[[2-Areas/009-daily/<%tp.date.now("YYYY-MM-DD", 1, tp.file.title, "YYYY-MM-DD")%>|<%tp.date.now("MM-DD", 1, tp.file.title, "YYYY-MM-DD")%>]]
- [[2-Areas/009-daily/5.Yearly Log/<%moment(tp.file.title).format("YYYY")%>|<%moment(tp.file.title).format("YYYY")%>]]/[[2-Areas/009-daily/3.Monthly Log/<%moment(tp.file.title).format("gggg-MM")%>|<%moment(tp.file.title).format("MM")%>]], [[2-Areas/009-daily/2.Weekly Log/<%moment(tp.file.title).format("gggg-[W]ww") %>|W<%moment(tp.file.title).format("ww") %>]]
- [[4.Future log/FutureLog|Future Log]]

## 1. Major Work TODOs
- `input an Task`
- [ ] 

## 2. Events/Deadlines/Commitments
- `input an Event` 
- [ ] 
<%*
const weekdayStr = tp.date.now("dddd", 0, tp.file.title, "YYYY-MM-DD");
if (weekdayStr === "Sunday" || weekdayStr === "星期日") {
	tR += "- [ ] record my weight"
}
%>
<%*
const dateString = tp.file.title; // Assuming the file title is in "YYYY-MM-DD" format
const dateParts = dateString.split("-");
const year = parseInt(dateParts[0], 10);
const month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed
const day = parseInt(dateParts[2], 10);
const date = new Date(year, month, day);
const lastDayOfMonth = new Date(year, month + 1, 0).getDate(); // Get the last day of the month

if (day === lastDayOfMonth) {
	tR += "- [ ] Review the month";
}
%>

## 3. Time Blocks
### 3.1 Today Cost
- [ ] today cost is recorded

### 3.2 Habit Tracker
- [ ] Manage Work
- [ ] Exercise
- [ ] Read

## 4. Notes & ideas


**Bullet Formats**
- Basic bullets
	- [/] incomplete (half completed) (- [/])
	- [x] done (- [x])
	- [-] canceled (- [-])
	 - [I] idea (- [I])
	 - [*] Events (- [\*])
- Migration bullets
	 - [>] forward (to Future Log) (- [>])
	 - [<] re-scheduling (reschedule to the next day's Daily Log) (- [<])
- Extended bullets
	- [i] important (- [i])
	- [u] up (- [u])
	- [d] down (- [d])
	- ["] quote (- ["])
	- [l] location (- [l])



