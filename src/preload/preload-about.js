const { contextBridge, ipcRenderer, shell } = require('electron');

contextBridge.exposeInMainWorld('aboutAPI', {
  getVersion: () => ipcRenderer.invoke('app-version'),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
});
