<%*

const {dingAppIDForFetch, dingAppSecretForFetch, dingBaseIDForFetch, dingTableIDForFetch} = app.plugins.plugins["ioto-settings"].settings;

const ding = {
	appID: `${dingAppIDForFetch}`,
	appSecret: `${dingAppSecretForFetch}`,
	defaultBaseID: `${dingBaseIDForFetch}`,
	defaultSheetID: `${dingTableIDForFetch}`,
	tables: [
		{
			sourceName: "Demo1",
			targetFolderPath: "DingDemo1",
			baseID: "xxxxbaseIDxxxx",
			sheetID: "",
			viewID: "xxxxviewIDxxxx",
		}
	]
}

await tp.user.ObSyncDing(tp, this.app, ding, {
fetchOnly: true
});
_%>