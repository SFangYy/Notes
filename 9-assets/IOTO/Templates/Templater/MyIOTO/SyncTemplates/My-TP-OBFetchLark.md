<%*
const {larkAppIDForFetch, larkAppSecretForFetch, larkBaseIDForFetch, larkTableIDForFetch} = app.plugins.plugins["ioto-settings"].settings;

const lark = {
	appID: `${larkAppIDForFetch}`,
	appSecret: `${larkAppSecretForFetch}`,
	defaultAppToken: `${larkBaseIDForFetch}`,
	defaultTableID: `${larkTableIDForFetch}`,
	tables: [
		{
			sourceName: "Demo1",
			targetFolderPath: "larkDemo1",
			appToken: "",
			tableID: "xxxxtableIDxxxx",
			viewID: "xxxxviewIDxxxx",
		}
	]
}

await tp.user.ObSyncLark(tp, this.app, lark, {
fetchOnly: true
});
_%>