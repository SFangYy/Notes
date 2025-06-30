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
  fetchOnly = false,
  updateNotesInOB = true
) {
  tp.IOTOConfigText = tp.user.IOTOConfigText();
  const MyObSyncer = tp.user.IOTOObSyncer(tp);
  const MyNocoDB = tp.user.IOTOVikaDB(tp);
  const MyNocoDBSyncer = tp.user.IOTOVikaSyncer(tp);
  const myNocoDB = new MyNocoDB(nocoDBSettings);
  const myNocoDBSyncer = new MyNocoDBSyncer(myNocoDB, tp, app, updateNotesInOB);
  const myObSyncer = new MyObSyncer(tp, app, myNocoDBSyncer);
  return await myObSyncer.syncWithNocoDB(fetchOnly);
}

module.exports = obSyncVika;
