<%*

const {wpsAppIDForFetch, wpsAppSecretForFetch, wpsBaseIDForFetch, wpsTableIDForFetch, wpsUserTokenForFetch} = app.plugins.plugins["ioto-settings"].settings;

const wps = {
	accessToken: `${wpsUserTokenForFetch}`,
	appID: `${wpsAppIDForFetch}`,
	appKey: `${wpsAppSecretForFetch}`,
	defaultFileID: `${wpsBaseIDForFetch}`,
	defaultSheetID: `${wpsTableIDForFetch}`,
	tables: [
		{
			sourceName: "Demo1",
			targetFolderPath: "wpsDemo1",
			fileID: "",
			sheetID: "",
			viewID: "xxxxviewIDxxxx",
		}
	]
}

await tp.user.ObSyncWps(tp, this.app, wps, {
fetchOnly: true
});
_%>