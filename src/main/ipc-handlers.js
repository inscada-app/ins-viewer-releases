const { ipcMain, app, shell } = require('electron');
const settingsStore = require('./settings-store');
const locale = require('./locale');

function register(deps) {
  const { connectionChecker, onSettingsSaved } = deps;

  ipcMain.handle('get-settings', () => {
    return settingsStore.load();
  });

  ipcMain.handle('save-settings', (_event, settings) => {
    if (typeof settings !== 'object' || settings === null || Array.isArray(settings)) {
      throw new Error('Invalid settings');
    }

    const schema = {
      url: 'string',
      autoStart: 'boolean',
      minimizeToTray: 'boolean',
      startMinimized: 'boolean',
      language: 'string',
      appLanguage: 'string',
    };

    const sanitized = {};
    for (const [key, type] of Object.entries(schema)) {
      if (key in settings) {
        if (typeof settings[key] !== type) {
          throw new Error(`Invalid type for ${key}`);
        }
        sanitized[key] = settings[key];
      }
    }

    // Validate URL protocol
    if (sanitized.url !== undefined) {
      try {
        const parsed = new URL(sanitized.url);
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          throw new Error('Only http and https URLs are allowed');
        }
      } catch (e) {
        if (e.message === 'Only http and https URLs are allowed') throw e;
        throw new Error('Invalid URL format');
      }
    }

    const saved = settingsStore.save(sanitized);
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
    try {
      const parsed = new URL(url);
      const allowedHosts = ['www.inscada.com', 'inscada.gitbook.io'];
      if ((parsed.protocol === 'https:' || parsed.protocol === 'http:') && allowedHosts.includes(parsed.hostname)) {
        shell.openExternal(url);
      }
    } catch {
      // Invalid URL — ignore
    }
  });

  ipcMain.handle('get-locale-strings', () => {
    return locale.getStrings();
  });
}

module.exports = { register };
