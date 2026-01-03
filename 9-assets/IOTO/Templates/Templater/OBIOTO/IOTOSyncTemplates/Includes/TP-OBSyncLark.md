<%*
const {larkAppIDForSync, larkAppSecretForSync, larkBaseIDForSync, larkTableIDForSync} = app.plugins.plugins["ioto-settings"].settings;

const lark = {
	appID: `${larkAppIDForSync}`,
	appSecret: `${larkAppSecretForSync}`,
	defaultAppToken: `${larkBaseIDForSync}`,
	defaultTableID: `${larkTableIDForSync}`,
}

await tp.user.ObSyncLark(tp, this.app, lark);
_%>