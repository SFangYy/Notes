function IOTOMultiLangs() {
  return class IOTOMultiLangs {
    static instance = null;

    static getInstance() {
      if (!IOTOMultiLangs.instance) {
        IOTOMultiLangs.instance = new IOTOMultiLangs();
      }
      return IOTOMultiLangs.instance;
    }

    constructor() {
      if (IOTOMultiLangs.instance) {
        return IOTOMultiLangs.instance;
      }
      this._dict = {
        en: this.enDict(),
        "zh-cn": this.zhcnDict(),
        "zh-tw": this.zhtwDict(),
      };
      this._local = moment.locale();
      IOTOMultiLangs.instance = this;
    }

    enDict() {
      return {
        IOTO: "IOTO",
        DefaultTDLTemplate: "TP-任务-创建任务列表",
        Hello: "Hello %friend%",
        "1. Search and Replace in Active File":
          "1. Search and Replace in Active File",
        "2. Search and Replace in All Files in Current Folder":
          "2. Search and Replace in All Files in Current Folder",
        "3. Search and Replace in All Files in Current Folder and Sub Folders":
          "3. Search and Replace in All Files in Current Folder and Sub Folders",
        "4. Search and Replace in Selection":
          "4. Search and Replace in Selection",
        "Please select text first.": "Please select text first.",
        "Your search and replace rules do not match.":
          "Your search and replace rules do not match.",
        "You must open a note first.": "You must open a note first.",
        "Please select the size of the image you want to insert":
          "Please select the size of the image you want to insert",
        "No mask": "No mask",
        "Round mask": "Round mask",
        "Circle mask": "Circle mask",
        "Please select the mask type you want to use":
          "Please select the mask type you want to use",
        "Please input the keywords of the image you want to find (English)":
          "Please input the keywords of the image you want to find (English)",
        FleetingNote: "FleetingNote",
        FolderPathNotExist:
          "The folder path you provided does not exist: %folderPath%",
        TemplateNotExist:
          "The template you provided does not exist: %template%",
        ExcalidrawPluginNotInstalled:
          "Excalidraw plugin is not installed or enabled",
        InsertLinkAfterCreate: "Insert link after create",
        OpenNoteAfterCreate: "Open note after create",
        InsertLinkAndOpenNoteAfterCreate:
          "Insert link and open note after create",
        DoNotInsertLinkAndDoNotOpenNoteAfterCreate:
          "Do not insert link and do not open note after create",
        PleaseInputNoteName:
          "Please input the name of the %noteType% you want to create",
        DefaultExcalidrawTemplateNotExist:
          "The default Excalidraw template you provided does not exist: %defaultExcalidrawTemplate%",
        "You have not specified a project for this note. Please select a project for this note.":
          "You have not specified a project for this note. Please select a project for this note.",
        "Return selected text": "Return selected text",
        "Insert link": "Insert link",
        "Embed TDL item": "Embed TDL item",
        RecordRetrieveError: "Record retrieve error",
        RecordCreateError: "Record create error",
        RecordUpdateError: "Record update error",
        RecordDeleteError: "Record delete error",
        RecordDeleteSuccess: "Record delete success",
        CreateTodayTasksList: "Create today's tasks list",
        CreateTomorrowTasksList: "Create tomorrow's tasks list",
        CreateAfterTomorrowTasksList: "Create after tomorrow's tasks list",
        CreateBigAfterTomorrowTasksList:
          "Create big after tomorrow's tasks list",
        PleaseSpecifyTDLTopic: "Please specify TDL topic",
        ExtractBoldContent: "Extract bold content",
        ExtractHighlightContent: "Extract highlight content",
        ExtractItalicContent: "Extract italic content",
        ExtractUnderlineContent: "Extract underline content",
        ExtractHeadings: "Extract headings",
        ExtractLinesContainingKeyword: "Extract lines containing keyword",
        PleaseInputKeyword: "Please input keyword",
        KeywordNotInput: "No keyword input, operation cancelled.",
        NoLinesContainingKeyword:
          "Can't find any lines containing the keyword.",
        NoMatchingContent: "No matching content found.",
        AddFMToCurrentNote: "Add frontmatter to current note",
        AddFMToAllNotesInCurrentFolder:
          "Add frontmatter to all notes in current folder",
        AddFMToAllNotesInCurrentFolderAndSubFolders:
          "Add frontmatter to all notes in current folder and sub folders",
        RemoveFMFromCurrentNote: "Remove frontmatter from current note",
        RemoveFMFromAllNotesInCurrentFolder:
          "Remove frontmatter from all notes in current folder",
        RemoveFMFromAllNotesInCurrentFolderAndSubFolders:
          "Remove frontmatter from all notes in current folder and sub folders",
        ClearFMFromCurrentNote: "Clear frontmatter from current note",
        ClearFMFromAllNotesInCurrentFolder:
          "Clear frontmatter from all notes in current folder",
        ClearFMFromAllNotesInCurrentFolderAndSubFolders:
          "Clear frontmatter from all notes in current folder and sub folders",
        IfFMExistsUseOriginalValue: "If FM exists, use original value",
        IfFMExistsUseTemplateValue: "If FM exists, use template value",
        YouMustOpenNoteFirst: "You must open a note first.",
        GettingRecords: "Getting records...",
        TotalRecordsToDeal: "Total %total% records to deal",
        FileWriteFailed: "File write failed",
        AllDone: "All done",
        TotalRecordsToCreate: "There are %total% records to create",
        TotalRecordsToUpdate: "There are %total% records to update",
        LeftRecordsToUpdate: "There are %total% records left to update",
        NoLinksInNote: "No links in note, no need to update from database",
        NoLinksInNoteToUpload:
          "No links in note, no need to upload to database",
        NoFilesHasTag: "Can't find files with specified tag",
        NoFilesHasSamePropertyAndValue:
          "Can't find files with same property and value",
        CanceledByUser: "Operation canceled by user",
        SyncingStart: "Syncing start, please wait...",
        NoFilesToSync: "No files to sync",
        ActiveNoteSyncingStart: "Current note syncing start, please wait...",
        NoteDonotSync: "Note %noteTitle% was set to not sync",
        NoteCreateSuccess: "Note %noteTitle% was created successfully",
        NoteCreateFailed: "Note %noteTitle% was created failed",
        NoteCreatedSuccess: "Note %noteTitle% was created successfully",
        NoteCreatedFailed: "Note %noteTitle% was created failed",
        NoteUpdateSuccess: "Note %noteTitle% was updated successfully",
        NoteUpdateFailed: "Note %noteTitle% was updated failed",
        SyncingNoteInFolder: "Syncing note in folder %folderName%",
        NotesCreatedReport: "Created %number% notes",
        NotesUpdatedReport: "Updated %number% notes",
        NotesLeftToDeal: "There are %number% notes left to deal",
        AllNotesProcessed: "All notes processed",
        RootFolderNotSupported:
          "This operation is not supported in root folder",
        PleaseInputSearchQuery: "Please input search query",
        PleaseChooseTagToSync: "Please choose tag to sync",
        PleaseChoosePropertyToSync: "Please choose property to sync",
        PleaseChoosePropertyValue: "Please choose property value",
        NoPropertyChoosed: "No property choosed",
        NoPropertyValueChoosed: "No property value choosed",
        PastHourNotes: "Notes updated in last hour",
        TodayNote: "Notes updated today",
        PastThreeDaysNotes: "Notes updated in last three days",
        PastWeekNotes: "Notes updated in last week",
        PastTwoWeeksNotes: "Notes updated in last two weeks",
        PastMonthNotes: "Notes updated in last month",
        AllNotes: "All notes",
        NotesUpdatedInSpecificTimeRange: "Notes updated in specific time range",
        Minutes: "Minutes",
        Hours: "Hours",
        Days: "Days",
        Weeks: "Weeks",
        Months: "Months",
        PleaseInputValue: "Please input value",
        PleaseInputValidValue: "Please input valid value",
        NoAvailableTables: "No available tables",
        GetFilesFromSourceToOB: "Get files from %sourceName% to OB",
        GetFilesFromSourceToOBError: "Get files from %sourceName% to OB error",
        UploadCurrentNoteToDB: "Upload current note to %dbName%",
        UploadLinksInCurrentNoteToDB:
          "Upload links in current note to %dbName%",
        UploadCurrentNoteAndLinksInCurrentNoteToDB:
          "Upload current note and links in current note to %dbName%",
        UploadFilesInCurrentFolderToDB:
          "Upload all notes in current folder to %dbName%",
        UploadFilesInCurrentFolderAndSubFoldersToDB:
          "Upload all notes in current folder and subfolders to %dbName%",
        UploadFilesHasSameTagToDB:
          "Upload all notes with specified tag to %dbName%",
        UploadFilesHasSamePropertyAndValueToDB:
          "Upload all notes with specified property value to %dbName%",
        UploadSearchResultsToDB: "Upload search results to %dbName%",
        UploadAllIOONotesToDB: "Upload all IOO notes to %dbName%",
        DownloadContentFromDBToCurrentNote:
          "Download content from %dbName% to current note",
        DownloadContentFromDBToCurrentNoteLinks:
          "Download content from %dbName% to outgoing links of current note",
        DownloadContentFromDBToCurrentNoteAndLinks:
          "Download content from %dbName% to current note and its outgoing links",
        DownloadContentFromDBToNotesInCurrentFolder:
          "Download content from %dbName% to all notes in current folder",
        DownloadContentFromDBToNotesInCurrentFolderAndSubFolder:
          "Download content from %dbName% to all notes in current folder and subfolders",
        DeleteCurrentNoteAndRecord:
          "Delete current note and its record in database",
        SyncFileError: "Syncing file error",
        SyncFileErrorNotice:
          "Error syncing file, please check console for details",
        InputSearchQuery: "Please input search query",
        NoMatchingNote: "No matching note found",
        PreparingToGetData:
          "Preparing to get data from database, please wait...",
        NoFolderPath: "You have not set the folder path!",
        FolderPathNotExist:
          "The folder path you provided does not exist: %folderPath%",
        OptionTemplateMustIncludeFolder:
          "Your option template must include {{folder}}!",
        CreateNoteInFolder: "Create note in {{folder}}",
        KeyPoints: "Key Points",
        CreateNewFile: "Create New File",
        OutputToCurrentFile: "Output to Current File",
        OutputToKeyPointsFile: "Output to Key Points File",
        IOTODefaultInputNoteTemplate: "TP-Input-CreateInputNote",
        IOTODefaultOutputNoteTemplate: "TP-Output-CreateOutputNote",
        IOTODefaultTaskNoteTemplate: "TP-Task-CreateTaskTDL",
        IOTODefaultOutcomeNoteTemplate: "TP-Outcome-CreateOutcomeNote",
        IOTODefaultInputSelector: "TP-Selector-CreateInput",
        IOTODefaultOutputSelector: "TP-Selector-CreateOutput",
        IOTODefaultTaskSelector: "TP-Selector-CreateTask",
        IOTODefaultOutcomeSelector: "TP-Selector-CreateOutcome",
        IOTOAuxiliaries: "Auxiliaries",
        NoteUpdatedSuccess: "Note %noteTitle% was updated successfully",
        NoteUpdatedFailed: "Note %noteTitle% was updated failed",
        InputDate: "Input date",
        SyncTitle: "Title",
        SyncContent: "Content",
        SyncExtraContent: "ExtraContent",
        SyncExtraFullContent: "ExtraFullContent",
        SyncTags: "Tags",
        SyncAliases: "Aliases",
        SyncCreatedTime: "CreatedTime",
        SyncUpdatedTime: "UpdatedTime",
        SyncPath: "Folder",
        SyncVault: "Vault",
        SyncFullContent: "FullContent",
        SyncOBURI: "OBURI",
        SyncExtension: "Extension",
        SyncSubFolder: "SubFolder",
        SyncMD: "MD",
      };
    }

    zhcnDict() {
      return {
        IOTO: "IOTO",
        DefaultTDLTemplate: "TP-任务-创建任务列表",
        Hello: "你好 %friend%",
        "1. Search and Replace in Active File": "1. 在当前笔记中执行查找替换",
        "2. Search and Replace in All Files in Current Folder":
          "2. 在当前文件夹下所有笔记中执行查找替换",
        "3. Search and Replace in All Files in Current Folder and Sub Folders":
          "3. 在当前文件夹及其子文件夹所有笔记中执行查找替换",
        "4. Search and Replace in Selection": "4. 在当前选择内容中执行查找替换",
        "Please select text first.": "请先选择文本内容。",
        "Your search and replace rules do not match.":
          "您的搜索和替换规则数量不匹配！",
        "You must open a note first.": "您必须先打开一个笔记。",
        "Please select the size of the image you want to insert":
          "请选择你要插入的图片的大小",
        "No mask": "无遮罩",
        "Round mask": "圆角遮罩",
        "Circle mask": "圆形遮罩",
        "Please select the mask type you want to use":
          "请选择你要使用的遮罩类型",
        "Please input the keywords of the image you want to find (English)":
          "请输入你要查找的图片的关键词（英文）",
        FleetingNote: "闪念",
        FolderPathNotExist: "你提供的文件夹路径不存在： %folderPath%",
        TemplateNotExist: "你提供的模板 %template% 不存在！",
        ExcalidrawPluginNotInstalled: "您没有安装或者没有启用Excalidraw插件",
        InsertLinkAfterCreate: "创建后插入链接",
        OpenNoteAfterCreate: "创建后打开笔记",
        InsertLinkAndOpenNoteAfterCreate: "创建后插入链接并打开笔记",
        DoNotInsertLinkAndDoNotOpenNoteAfterCreate:
          "创建后不插入链接也不打开笔记",
        PleaseInputNoteName: "请输入你要创建的 %noteType% 的名字",
        DefaultExcalidrawTemplateNotExist:
          "你提供的默认Excalidraw模板不存在： %defaultExcalidrawTemplate%",
        "You have not specified a project for this note. Please select a project for this note.":
          "您没有为此笔记指定项目，请为此笔记选择项目。",
        "Return selected text": "返回选中的文本",
        "Insert link": "插入链接",
        "Embed TDL item": "嵌入TDL条目",
        RecordRetrieveError: "获取记录出错",
        RecordCreateError: "创建记录出错",
        RecordUpdateError: "更新记录出错",
        RecordDeleteError: "删除记录出错",
        RecordDeleteSuccess: "删除记录成功",
        CreateTodayTasksList: "创建今天的任务列表",
        CreateTomorrowTasksList: "创建明天的任务列表",
        CreateAfterTomorrowTasksList: "创建后天的任务列表",
        CreateBigAfterTomorrowTasksList: "创建大后天的任务列表",
        PleaseSpecifyTDLTopic: "请为您的TDL指定主题",
        ExtractBoldContent: "提取加粗内容",
        ExtractHighlightContent: "提取高亮内容",
        ExtractItalicContent: "提取斜体内容",
        ExtractUnderlineContent: "提取下划线内容",
        ExtractHeadings: "提取标题",
        ExtractLinesContainingKeyword: "提取包含指定词语的行",
        PleaseInputKeyword: "请输入要搜索的关键词",
        KeywordNotInput: "未输入关键词，操作取消。",
        NoLinesContainingKeyword: "未找到包含指定词语的行。",
        NoMatchingContent: "未找到匹配内容。",
        AddFMToCurrentNote: "为当前笔记添加指定FM",
        AddFMToAllNotesInCurrentFolder: "为当前文件夹下所有笔记添加指定FM",
        AddFMToAllNotesInCurrentFolderAndSubFolders:
          "为当前文件夹及其子文件夹所有笔记添加指定FM",
        RemoveFMFromCurrentNote: "移除当前笔记的指定FM",
        RemoveFMFromAllNotesInCurrentFolder: "移除当前文件夹下所有笔记的指定FM",
        RemoveFMFromAllNotesInCurrentFolderAndSubFolders:
          "移除当前文件夹及其子文件夹所有笔记的指定FM",
        ClearFMFromCurrentNote: "清空当前笔记的FM",
        ClearFMFromAllNotesInCurrentFolder: "清空当前文件夹所有笔记的FM",
        ClearFMFromAllNotesInCurrentFolderAndSubFolders:
          "清空当前文件夹及其子文件夹所有笔记的FM",
        IfFMExistsUseOriginalValue: "如果FM属性已存在，使用原有值",
        IfFMExistsUseTemplateValue: "如果FM属性已存在，使用模板中的值",
        YouMustOpenNoteFirst: "您必須先開啟一個筆記。",
        GettingRecords: "正在获取记录...",
        TotalRecordsToDeal: "一共 %total% 条记录需要处理",
        FileWriteFailed: "文件写入失败",
        AllDone: "全部处理完成",
        TotalRecordsToCreate: "一共 %total% 条记录需要创建",
        TotalRecordsToUpdate: "一共 %total% 条记录需要更新",
        LeftRecordsToUpdate: "还有 %total% 条记录需要更新",
        NoLinksInNote: "当前笔记中没有出链，不需要从数据库进行更新",
        NoLinksInNoteToUpload: "当前笔记中没有出链，不需要上传到数据库",
        NoFilesHasTag: "没有找到包含指定标签的笔记",
        NoFilesHasSamePropertyAndValue: "没有找到包含指定属性值的笔记",
        CanceledByUser: "已取消操作",
        SyncingStart: "同步進行中，请稍候……",
        NoFilesToSync: "沒有需要同步的筆記",
        ActiveNoteSyncingStart: "当前笔记同步进行中，请稍候……",
        NoteDonotSync: "笔记 %noteTitle% 被设置为不同步",
        NoteCreateSuccess: "笔记 %noteTitle% 创建成功",
        NoteCreatedSuccess: "笔记 %noteTitle% 创建成功",
        NoteCreateFailed: "笔记 %noteTitle% 创建失败",
        NoteCreatedFailed: "笔记 %noteTitle% 创建失败",
        NoteUpdateSuccess: "笔记 %noteTitle% 更新成功",
        NoteUpdateFailed: "笔记 %noteTitle% 更新失败",
        SyncingNoteInFolder: "正在同步 %folderName% 中的笔记",
        NotesCreatedReport: "创建了 %number% 条笔记",
        NotesUpdatedReport: "更新了 %number% 条笔记",
        NotesLeftToDeal: "还有 %number% 条笔记未处理",
        AllNotesProcessed: "所有笔记处理完成",
        RootFolderNotSupported: "不支持在根目录下执行此操作",
        PleaseInputSearchQuery: "请输入搜索关键词",
        PleaseChooseTagToSync: "请选择要同步的标签",
        PleaseChoosePropertyToSync: "请选择要同步的属性",
        PleaseChoosePropertyValue: "请选择属性值",
        NoPropertyChoosed: "未选择属性",
        NoPropertyValueChoosed: "未选择属性值",
        PastHourNotes: "过去一个小时内更新的笔记",
        TodayNote: "今天更新的笔记",
        PastThreeDaysNotes: "过去三天内更新的笔记",
        PastWeekNotes: "过去一个星期内更新的笔记",
        PastTwoWeeksNotes: "过去两周内更新的笔记",
        PastMonthNotes: "过去一个月内更新的笔记",
        AllNotes: "全部笔记",
        NotesUpdatedInSpecificTimeRange: "指定时间范围内更新的笔记",
        Minutes: "分钟",
        Hours: "小时",
        Days: "天",
        Weeks: "周",
        Months: "月",
        PleaseInputValue: "请输入数值",
        PleaseInputValidValue: "请输入有效的数值",
        NoAvailableTables: "没有可用的数据表",
        GetFilesFromSourceToOB: "从 %sourceName% 获取文件到OB",
        GetFilesFromSourceToOBError: "从 %sourceName% 获取文件到OB出错",
        UploadCurrentNoteToDB: "上传当前笔记到%dbName%",
        UploadLinksInCurrentNoteToDB: "上传当前笔记中的出链到%dbName%",
        UploadCurrentNoteAndLinksInCurrentNoteToDB:
          "上传当前笔记及出链到%dbName%",
        UploadFilesInCurrentFolderToDB: "上传当前文件夹下所有笔记到%dbName%",
        UploadFilesInCurrentFolderAndSubFoldersToDB:
          "上传当前文件夹及其子文件夹下所有笔记到%dbName%",
        UploadFilesHasSameTagToDB: "上传包含指定标签的所有笔记到%dbName%",
        UploadFilesHasSamePropertyAndValueToDB:
          "上传包含指定属性值的所有笔记到%dbName%",
        UploadSearchResultsToDB: "上传搜索结果到%dbName%",
        UploadAllIOONotesToDB: "上传所有IOO笔记到%dbName%",
        DownloadContentFromDBToCurrentNote: "下载%dbName%中内容到当前笔记",
        DownloadContentFromDBToCurrentNoteLinks:
          "下载%dbName%中的内容到当前笔记的出链",
        DownloadContentFromDBToCurrentNoteAndLinks:
          "下载%dbName%中的内容当前笔记及其出链",
        DownloadContentFromDBToNotesInCurrentFolder:
          "下载%dbName%中的内容到当前文件夹下所有笔记",
        DownloadContentFromDBToNotesInCurrentFolderAndSubFolder:
          "下载%dbName%中的内容到当前文件夹及其子文件夹下所有笔记",
        DeleteCurrentNoteAndRecord: "删除当前笔记及其在数据库中的记录",
        SyncFileError: "同步文件时出错",
        SyncFileErrorNotice: "同步文件时出错，请查看控制台获取详细信息",
        InputSearchQuery: "请输入搜索关键词",
        NoMatchingNote: "未找到匹配的笔记",
        PreparingToGetData: "准备从数据库获取数据，请稍候……",
        NoFolderPath: "您没有设置文件夹路径！",
        FolderPathNotExist: "您提供的文件夹路径 %folderPath% 不存在！",
        OptionTemplateMustIncludeFolder: "您的选项模板中必须包含 {{folder}} !",
        CreateNoteInFolder: "在 {{folder}} 创建笔记",
        KeyPoints: "要点提取",
        CreateNewFile: "创建新文件",
        OutputToCurrentFile: "输出到当前文件",
        OutputToKeyPointsFile: "输出到要点文件",
        IOTODefaultInputNoteTemplate: "TP-输入-创建输入笔记",
        IOTODefaultOutputNoteTemplate: "TP-输出-创建输出笔记",
        IOTODefaultTaskNoteTemplate: "TP-任务-创建任务列表",
        IOTODefaultOutcomeNoteTemplate: "TP-成果-创建成果笔记",
        IOTODefaultInputSelector: "TP-选择器-创建输入",
        IOTODefaultOutputSelector: "TP-选择器-创建输出",
        IOTODefaultTaskSelector: "TP-选择器-创建任务",
        IOTODefaultOutcomeSelector: "TP-选择器-创建成果",
        IOTOAuxiliaries: "辅助工具",
        NoteUpdatedSuccess: "笔记 %noteTitle% 更新成功",
        NoteUpdatedFailed: "笔记 %noteTitle% 更新失败",
        InputDate: "输入日期",
        SyncTitle: "标题",
        SyncContent: "内容",
        SyncExtraContent: "额外内容",
        SyncExtraFullContent: "额外全文",
        SyncTags: "标签",
        SyncAliases: "别名",
        SyncCreatedTime: "创建时间",
        SyncUpdatedTime: "更新时间",
        SyncPath: "路径",
        SyncVault: "库",
        SyncFullContent: "全文",
        SyncOBURI: "OBURI",
        SyncExtension: "扩展名",
        SyncSubFolder: "子文件夹",
        SyncMD: "MD",
      };
    }

    zhtwDict() {
      return {
        IOTO: "IOTO",
        Hello: "您好 %friend%",
        DefaultTDLTemplate: "TP-任務-創建任務列表",
        "1. Search and Replace in Active File": "1. 在當前筆記中執行查找替換",
        "2. Search and Replace in All Files in Current Folder":
          "2. 在當前文件夾下所有筆記中執行查找替換",
        "3. Search and Replace in All Files in Current Folder and Sub Folders":
          "3. 在當前文件夾及其子文件夾所有筆記中執行查找替換",
        "4. Search and Replace in Selection": "4. 在當前選擇內容中執行查找替換",
        "Please select text first.": "請先選擇文本內容。",
        "Your search and replace rules do not match.":
          "您的搜索和替換規則數量不匹配！",
        "You must open a note first.": "您必須先開啟一個筆記。",
        "Please select the size of the image you want to insert":
          "請選擇你要插入的圖片的大小",
        "No mask": "無遮罩",
        "Round mask": "圓角遮罩",
        "Circle mask": "圓形遮罩",
        "Please select the mask type you want to use":
          "請選擇你要使用的遮罩類型",
        "Please input the keywords of the image you want to find (English)":
          "請輸入你要查找的圖片的關鍵詞（英文）",
        FleetingNote: "闪念",
        FolderPathNotExist: "你提供的文件夾路徑不存在： %folderPath%",
        TemplateNotExist: "你提供的模板 %template% 不存在！",
        ExcalidrawPluginNotInstalled: "您沒有安裝或者沒有啟用Excalidraw插件",
        InsertLinkAfterCreate: "創建後插入鏈接",
        OpenNoteAfterCreate: "創建後打開筆記",
        InsertLinkAndOpenNoteAfterCreate: "創建後插入鏈接並打開筆記",
        DoNotInsertLinkAndDoNotOpenNoteAfterCreate:
          "創建後不插入鏈接也不打開筆記",
        PleaseInputNoteName: "請輸入你要創建的 %noteType% 的名字",
        DefaultExcalidrawTemplateNotExist:
          "你提供的默認Excalidraw模板不存在： %defaultExcalidrawTemplate%",
        "You have not specified a project for this note. Please select a project for this note.":
          "您沒有為此筆記指定專案。請為此筆記選擇專案。",
        "Return selected text": "返回選中的文本",
        "Insert link": "插入鏈接",
        "Embed TDL item": "嵌入TDL項目",
        RecordRetrieveError: "獲取記錄出錯",
        RecordCreateError: "創建記錄出錯",
        RecordUpdateError: "更新記錄出錯",
        RecordDeleteError: "刪除記錄出錯",
        RecordDeleteSuccess: "刪除記錄成功",
        CreateTodayTasksList: "創建今天的任務列表",
        CreateTomorrowTasksList: "創建明天的任務列表",
        CreateAfterTomorrowTasksList: "創建后天的任務列表",
        CreateBigAfterTomorrowTasksList: "創建大后天的任務列表",
        PleaseSpecifyTDLTopic: "請為您的TDL指定主題",
        ExtractBoldContent: "提取加粗內容",
        ExtractHighlightContent: "提取高亮內容",
        ExtractItalicContent: "提取斜體內容",
        ExtractUnderlineContent: "提取下劃線內容",
        ExtractHeadings: "提取標題",
        ExtractLinesContainingKeyword: "提取包含指定詞語的行",
        PleaseInputKeyword: "請輸入要搜索的詞語",
        KeywordNotInput: "未輸入詞語，操作取消。",
        NoLinesContainingKeyword: "未找到包含指定詞語的行。",
        NoMatchingContent: "未找到匹配內容。",
        AddFMToCurrentNote: "為當前筆記添加指定FM",
        AddFMToAllNotesInCurrentFolder: "為當前文件夾下所有筆記添加指定FM",
        AddFMToAllNotesInCurrentFolderAndSubFolders:
          "為當前文件夾及其子文件夾所有筆記添加指定FM",
        RemoveFMFromCurrentNote: "移除當前筆記的指定FM",
        RemoveFMFromAllNotesInCurrentFolder: "移除當前文件夾下所有筆記的指定FM",
        RemoveFMFromAllNotesInCurrentFolderAndSubFolders:
          "移除當前文件夾及其子文件夾所有筆記的指定FM",
        ClearFMFromCurrentNote: "清空當前筆記的FM",
        ClearFMFromAllNotesInCurrentFolder: "清空當前文件夾所有筆記的FM",
        ClearFMFromAllNotesInCurrentFolderAndSubFolders:
          "清空當前文件夾及其子文件夾所有筆記的FM",
        IfFMExistsUseOriginalValue: "如果FM屬性已存在，使用原有值",
        IfFMExistsUseTemplateValue: "如果FM屬性已存在，使用範本中的值",
        YouMustOpenNoteFirst: "您必須先開啟一個筆記。",
        GettingRecords: "正在獲取記錄...",
        TotalRecordsToDeal: "一共 %total% 條記錄需要處理",
        FileWriteFailed: "文件寫入失敗",
        AllDone: "全部處理完成",
        TotalRecordsToCreate: "一共 %total% 條記錄需要創建",
        TotalRecordsToUpdate: "一共 %total% 條記錄需要更新",
        LeftRecordsToUpdate: "還有 %total% 條記錄需要更新",
        NoLinksInNote: "當前筆記中沒有出鏈，不需要從數據庫進行更新",
        NoLinksInNoteToUpload: "當前筆記中沒有出鏈，不需要上傳到數據庫",
        NoFilesHasTag: "沒有找到包含指定標籤的筆記",
        NoFilesHasSamePropertyAndValue: "沒有找到包含指定屬性值的筆記",
        CanceledByUser: "已取消操作",
        SyncingStart: "同步進行中，請稍候……",
        NoFilesToSync: "沒有需要同步的筆記",
        ActiveNoteSyncingStart: "當前筆記同步進行中，請稍候……",
        NoteDonotSync: "筆記 %noteTitle% 被設定為不同步",
        NoteCreateSuccess: "筆記 %noteTitle% 創建成功",
        NoteCreateFailed: "筆記 %noteTitle% 創建失敗",
        NoteCreatedSuccess: "筆記 %noteTitle% 創建成功",
        NoteCreatedFailed: "筆記 %noteTitle% 創建失敗",
        NoteUpdateSuccess: "筆記 %noteTitle% 更新成功",
        NoteUpdateFailed: "筆記 %noteTitle% 更新失敗",
        SyncingNoteInFolder: "正在同步 %folderName% 中的筆記",
        NotesCreatedReport: "創建了 %number% 條筆記",
        NotesUpdatedReport: "更新了 %number% 條筆記",
        NotesLeftToDeal: "還有 %number% 條筆記未處理",
        AllNotesProcessed: "所有筆記處理完成",
        RootFolderNotSupported: "不支持在根目錄下執行此操作",
        PleaseInputSearchQuery: "請輸入搜索關鍵詞",
        PleaseChooseTagToSync: "請選擇要同步的標籤",
        PleaseChoosePropertyToSync: "請選擇要同步的屬性",
        PleaseChoosePropertyValue: "請選擇屬性值",
        NoPropertyChoosed: "未選擇屬性",
        NoPropertyValueChoosed: "未選擇屬性值",
        PastHourNotes: "過去一小時內更新的筆記",
        TodayNote: "今天更新的筆記",
        PastThreeDaysNotes: "過去三天內更新的筆記",
        PastWeekNotes: "過去一週內更新的筆記",
        PastTwoWeeksNotes: "過去兩週內更新的筆記",
        PastMonthNotes: "過去一個月內更新的筆記",
        AllNotes: "全部筆記",
        NotesUpdatedInSpecificTimeRange: "指定時間範圍內更新的筆記",
        Minutes: "分鐘",
        Hours: "小時",
        Days: "天",
        Weeks: "週",
        Months: "月",
        PleaseInputValue: "請輸入值",
        PleaseInputValidValue: "請輸入有效的值",
        NoAvailableTables: "沒有可用的表格",
        GetFilesFromSourceToOB: "從 %sourceName% 獲取文件到OB",
        GetFilesFromSourceToOBError: "從 %sourceName% 獲取文件到OB錯誤",
        UploadCurrentNoteToDB: "上傳當前筆記到%dbName%",
        UploadLinksInCurrentNoteToDB: "上傳當前筆記中的出鏈到%dbName%",
        UploadCurrentNoteAndLinksInCurrentNoteToDB:
          "上傳當前筆記及出鏈到%dbName%",
        UploadFilesInCurrentFolderToDB: "上傳當前資料夾下所有筆記到%dbName%",
        UploadFilesInCurrentFolderAndSubFoldersToDB:
          "上傳當前資料夾及其子資料夾下所有筆記到%dbName%",
        UploadFilesHasSameTagToDB: "上傳包含指定標籤的所有筆記到%dbName%",
        UploadFilesHasSamePropertyAndValueToDB:
          "上傳包含指定屬性值的所有筆記到%dbName%",
        UploadSearchResultsToDB: "上傳搜索結果到%dbName%",
        UploadAllIOONotesToDB: "上傳所有IOO筆記到%dbName%",
        DownloadContentFromDBToCurrentNote: "下載%dbName%中內容到當前筆記",
        DownloadContentFromDBToCurrentNoteLinks:
          "下載%dbName%中的內容到當前筆記的出鏈",
        DownloadContentFromDBToCurrentNoteAndLinks:
          "下載%dbName%中的內容當前筆記及其出鏈",
        DownloadContentFromDBToNotesInCurrentFolder:
          "下載%dbName%中的內容到當前資料夾下所有筆記",
        DownloadContentFromDBToNotesInCurrentFolderAndSubFolder:
          "下載%dbName%中的內容到當前資料夾及其子資料夾下所有筆記",
        DeleteCurrentNoteAndRecord: "刪除當前筆記及其在資料庫中的記錄",
        SyncFileError: "同步檔案時出錯",
        SyncFileErrorNotice: "同步檔案時出錯，請查看控制台獲取詳細資訊",
        InputSearchQuery: "請輸入搜尋關鍵詞",
        NoMatchingNote: "未找到匹配的筆記",
        PreparingToGetData: "準備從資料庫獲取資料，請稍候……",
        NoFolderPath: "您沒有設置資料夾路徑！",
        FolderPathNotExist: "您提供的資料夾路徑 %folderPath% 不存在！",
        OptionTemplateMustIncludeFolder: "您的選項模板中必須包含 {{folder}} !",
        CreateNoteInFolder: "在 {{folder}} 創建筆記",
        KeyPoints: "要點提取",
        CreateNewFile: "創建新文件",
        OutputToCurrentFile: "輸出到當前文件",
        OutputToKeyPointsFile: "輸出到要點文件",
        IOTODefaultInputNoteTemplate: "TP-輸入-創建輸入筆記",
        IOTODefaultOutputNoteTemplate: "TP-輸出-創建輸出筆記",
        IOTODefaultTaskNoteTemplate: "TP-任務-創建任務列表",
        IOTODefaultOutcomeNoteTemplate: "TP-成果-創建成果筆記",
        IOTODefaultInputSelector: "TP-選擇器-創建輸入",
        IOTODefaultOutputSelector: "TP-選擇器-創建輸出",
        IOTODefaultTaskSelector: "TP-選擇器-創建任務",
        IOTODefaultOutcomeSelector: "TP-選擇器-創建成果",
        IOTOAuxiliaries: "輔助工具",
        NoteUpdatedSuccess: "筆記 %noteTitle% 更新成功",
        NoteUpdatedFailed: "筆記 %noteTitle% 更新失敗",
        InputDate: "輸入日期",
        SyncTitle: "標題",
        SyncContent: "內容",
        SyncExtraContent: "額外內容",
        SyncExtraFullContent: "額外全文",
        SyncTags: "標籤",
        SyncAliases: "別名",
        SyncCreatedTime: "創建時間",
        SyncUpdatedTime: "更新時間",
        SyncPath: "路徑",
        SyncVault: "庫",
        SyncFullContent: "全文",
        SyncOBURI: "OBURI",
        SyncExtension: "擴展名",
        SyncSubFolder: "子文件夾",
        SyncMD: "MD",
      };
    }

    // 使用变量替换字符串中的占位符
    t(key, variables = {}) {
      let text = this._dict[this._local][key] || this._dict.en[key];

      // 如果存在变量，进行替换
      if (text && Object.keys(variables).length > 0) {
        Object.entries(variables).forEach(([varKey, value]) => {
          // 支持两种占位符格式: {{varName}} 或 %varName%
          text = text.replace(
            new RegExp(`{{${varKey}}}|%${varKey}%`, "g"),
            value
          );
        });
      }

      return text;
    }
  };
}

module.exports = IOTOMultiLangs;
