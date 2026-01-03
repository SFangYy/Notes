/*
 ** Script Name: OB Sync To Vika
 ** Author: Johnny
 ** Bilibili: https://space.bilibili.com/432408734
 ** Version: 1.9.0
 */

async function obSyncVika(
  tp,
  app,
  nocoDBSettings,
  syncConfig = {
    fetchOnly: false,
    updateNotesInOB: true,
    defaultSyncOption: 0,
  }
) {
  const IOTOUtility = new (tp.user.IOTOUtility(tp, app))(tp, app);
  if (!IOTOUtility.checkDBSettings(nocoDBSettings, "vika")) {
    return;
  }
  tp.IOTOConfigText = tp.user.IOTOConfigText();
  const MyObSyncer = tp.user.IOTOObSyncer(tp);
  const MyNocoDB = tp.user.IOTOVikaDB(tp);
  const MyNocoDBSyncer = tp.user.IOTOVikaSyncer(tp);
  const myNocoDB = new MyNocoDB(nocoDBSettings);
  const myNocoDBSyncer = new MyNocoDBSyncer(
    myNocoDB,
    tp,
    app,
    syncConfig.updateNotesInOB ?? true
  );
  const myObSyncer = new MyObSyncer(tp, app, myNocoDBSyncer);
  return await myObSyncer.syncWithNocoDB(
    syncConfig.fetchOnly ?? false,
    syncConfig.defaultSyncOption ?? 0
  );
}

module.exports = obSyncVika;
