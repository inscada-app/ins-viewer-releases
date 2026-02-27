const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('inscada', {
  getConnectionStatus: () => ipcRenderer.invoke('get-connection-status'),
  getVersion: () => ipcRenderer.invoke('app-version'),
});
