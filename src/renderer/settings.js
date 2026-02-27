document.addEventListener('DOMContentLoaded', async () => {
  const urlInput = document.getElementById('url');
  const appLanguage = document.getElementById('appLanguage');
  const language = document.getElementById('language');
  const autoStart = document.getElementById('autoStart');
  const minimizeToTray = document.getElementById('minimizeToTray');
  const startMinimized = document.getElementById('startMinimized');
  const btnSave = document.getElementById('btn-save');
  const btnCancel = document.getElementById('btn-cancel');
  const versionEl = document.getElementById('version');

  // Load current settings
  const settings = await window.settingsApi.getSettings();
  urlInput.value = settings.url || '';
  appLanguage.value = settings.appLanguage || 'tr';
  language.value = settings.language || 'tr';
  autoStart.checked = !!settings.autoStart;
  minimizeToTray.checked = !!settings.minimizeToTray;
  startMinimized.checked = !!settings.startMinimized;

  // Apply locale strings to the UI
  async function applyLocaleStrings() {
    const strings = await window.settingsApi.getLocaleStrings();
    document.getElementById('settings-title').textContent = strings['settings.title'];
    document.getElementById('label-url').textContent = strings['settings.serverUrl'];
    document.getElementById('label-appLanguage').textContent = strings['settings.appLanguage'];
    document.getElementById('label-language').textContent = strings['settings.browserLanguage'];
    document.getElementById('label-autoStart').textContent = strings['settings.autoStart'];
    document.getElementById('label-minimizeToTray').textContent = strings['settings.minimizeToTray'];
    document.getElementById('label-startMinimized').textContent = strings['settings.startMinimized'];
    btnCancel.textContent = strings['settings.cancel'];
    btnSave.textContent = strings['settings.save'];
  }

  await applyLocaleStrings();

  // Load version
  const ver = await window.settingsApi.getVersion();
  versionEl.textContent = `v${ver}`;

  btnSave.addEventListener('click', async () => {
    const newSettings = {
      url: urlInput.value.trim() || 'http://localhost:8081',
      appLanguage: appLanguage.value,
      language: language.value,
      autoStart: autoStart.checked,
      minimizeToTray: minimizeToTray.checked,
      startMinimized: startMinimized.checked,
    };
    await window.settingsApi.saveSettings(newSettings);
    window.close();
  });

  btnCancel.addEventListener('click', () => {
    window.close();
  });
});
