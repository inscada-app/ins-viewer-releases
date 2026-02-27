const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('settingsApi', {
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
  getVersion: () => ipcRenderer.invoke('app-version'),
  getLocaleStrings: () => ipcRenderer.invoke('get-locale-strings'),
});
