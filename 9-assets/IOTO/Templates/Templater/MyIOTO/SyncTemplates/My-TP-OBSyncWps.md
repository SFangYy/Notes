<%*
const {wpsAppIDForSync, wpsAppSecretForSync, wpsBaseIDForSync, wpsTableIDForSync, wpsUserTokenForSync} = app.plugins.plugins["ioto-settings"].settings;

const wps = {
	accessToken: `${wpsUserTokenForSync}`,
    appID: `${wpsAppIDForSync}`,
    appKey: `${wpsAppSecretForSync}`,
    defaultFileID: `${wpsBaseIDForSync}`,
    defaultSheetID: `${wpsTableIDForSync}`
}

await tp.user.ObSyncWps(tp, this.app, wps);
_%>