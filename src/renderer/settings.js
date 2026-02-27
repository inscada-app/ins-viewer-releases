document.addEventListener('DOMContentLoaded', async () => {
  const urlInput = document.getElementById('url');
  const autoStart = document.getElementById('autoStart');
  const minimizeToTray = document.getElementById('minimizeToTray');
  const startMinimized = document.getElementById('startMinimized');
  const btnSave = document.getElementById('btn-save');
  const btnCancel = document.getElementById('btn-cancel');
  const versionEl = document.getElementById('version');

  // Load current settings
  const settings = await window.settingsApi.getSettings();
  urlInput.value = settings.url || '';
  autoStart.checked = !!settings.autoStart;
  minimizeToTray.checked = !!settings.minimizeToTray;
  startMinimized.checked = !!settings.startMinimized;

  // Load version
  const ver = await window.settingsApi.getVersion();
  versionEl.textContent = `v${ver}`;

  btnSave.addEventListener('click', async () => {
    const newSettings = {
      url: urlInput.value.trim() || 'http://localhost:8081',
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
