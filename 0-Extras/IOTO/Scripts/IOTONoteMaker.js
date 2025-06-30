/*
** Script Name: IOTO Note Maker
** Author: Johnny
** Bilibili: https://space.bilibili.com/432408734
** Version: 1.4.9
*/


class IOTOYAMLCooker {

	constructor(tp) {
		this.tp = tp;
		this.forceQuotesProperties = ["defaultTemplate"];
	}

	parseFmDict(fm) {
		
		let fmDict = {};
		if(!fm) {
			return fmDict;
		}
		let pureFm = Object.entries(fm).filter(([key, value]) => !["position", "Tags", "tag", "Aliases", "Alias", "alias"].includes(key));
		

		for(let [key, value] of pureFm) {
			if (value instanceof Array) {
				let arrayData = this.tp.obsidian.parseFrontMatterStringArray(fm, key) || "";
				fmDict[key] = arrayData;
			} else {
				if(this.forceQuotesProperties.includes(key)){
					fmDict[key] = `"${this.tp.obsidian.parseFrontMatterEntry(fm, key)}"` || "";
				} else if ( 0 === this.tp.obsidian.parseFrontMatterEntry(fm, key)) {
					fmDict[key] = this.tp.obsidian.parseFrontMatterEntry(fm, key);
				} else {
					fmDict[key] = this.tp.obsidian.parseFrontMatterEntry(fm, key) || "";
				}
			}
		}

		return fmDict;
	}

	addQuotationInFrontMatter(frontmatter){
        for(let [key, value] of Object.entries(frontmatter)){
            if(value instanceof Array){
                frontmatter[key] = value.map((item) => item !== ""?`"${item}"`:item);
            }
            else {
                frontmatter[key] = value !== ""? `"${value}"`:value;
            }
        }
    }

	dumpsFm(fmDict, sort = false) {
		let sortedFmDict = sort ? this.sortFmDict(fmDict) : fmDict;
		let fmText = Object.entries(sortedFmDict).map(([key, value]) => {
				let dumpValue = this.makeFmValue(value);
				if(this.forceQuotesProperties.includes(key) && "string" === typeof dumpValue && !dumpValue.startsWith('"')) {
					return `${key}: "${dumpValue}"`;
				} else {
					return `${key}: ${dumpValue}`;
				}
			}).join("\n");
		fmText = fmText ? "---\n" + fmText + "\n---\n" : "";
		return fmText;
	}

	sortFmDict(fmDict) {
		const sortedDict = Object.keys(fmDict)
			.sort()
			.reduce((accumulator, key) => {
				accumulator[key] = fmDict[key];
				return accumulator;
			}, {})
		return sortedDict;
	}

	makeFmValue(value) {
		
		if (value instanceof Array) {
			return "\n" + value.map(item => "- " + this.addQuotesForOBLink(item)).join("\n");
		} else if(typeof value === "string") {
			return this.addQuotesForOBLink(value);
		} else if(typeof value !== "undefined") {
			return value;
		} else {
			return "";
		}

	}

	addQuotesForOBLink(text) {
		if(text.includes("[[") && text.includes("]]")) {
			return text.replace("[[",'"[[').replace("]]",']]"');
		} else {
			return text;
		}
	}
}

class IOTONote {
    constructor (tp, file) {
        this.tp = tp;
        this.file = file;
        this.frontmatter = app.metadataCache.getFileCache(file)?.frontmatter;
        this.yamlCooker = new IOTOYAMLCooker(tp);
        this.fmDict = this.yamlCooker.parseFmDict(this.frontmatter);
    }

    async prepareNoteFm(fmDict, sort = false) {
		this.fm = this.yamlCooker.dumpsFm(fmDict, sort);
	}

    async prepareNoteContent() {
		let noteContent = await app.vault.read(this.file)
		this.fullContent = noteContent;
		this.content = this.removeFrontMatterFromContent(this.fullContent);
	}

    removeFrontMatterFromContent(content) {
        let docArray = content.split("\n");
		let startLine = 0;

		if (this.frontmatter) {
			
			for(let [index, line] of docArray.entries()) {
				if(0 !== index && "---" == line){
					startLine = index + 1;
					break;
				}
			}
		}
		
        return docArray.slice(startLine).join("\n").trim();
    }
}

function IOTONoteMaker(tp, file) {
	return new IOTONote(tp, file);
}

module.exports = IOTONoteMaker;