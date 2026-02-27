const { ipcMain, app, shell } = require('electron');
const settingsStore = require('./settings-store');

function register(deps) {
  const { connectionChecker, onSettingsSaved } = deps;

  ipcMain.handle('get-settings', () => {
    return settingsStore.load();
  });

  ipcMain.handle('save-settings', (_event, settings) => {
    const saved = settingsStore.save(settings);
    if (onSettingsSaved) onSettingsSaved(saved);
    return saved;
  });

  ipcMain.handle('get-connection-status', () => {
    return { online: connectionChecker.online, url: connectionChecker.url };
  });

  ipcMain.handle('app-version', () => {
    return app.getVersion();
  });

  ipcMain.handle('open-external', (_event, url) => {
    const allowed = ['https://www.inscada.com', 'https://inscada.gitbook.io'];
    if (allowed.some((prefix) => url.startsWith(prefix))) {
      shell.openExternal(url);
    }
  });
}

module.exports = { register };
