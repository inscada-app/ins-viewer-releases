const { Menu, shell, app, BrowserWindow } = require('electron');
const path = require('path');

function create({ onNewWindow, onSettings, onAbout }) {
  const template = [
    {
      label: 'Dosya',
      submenu: [
        {
          label: 'Yeni Pencere',
          accelerator: 'CmdOrCtrl+N',
          click: () => onNewWindow(),
        },
        { type: 'separator' },
        {
          label: 'Ayarlar',
          accelerator: 'CmdOrCtrl+,',
          click: () => onSettings(),
        },
        { type: 'separator' },
        {
          label: 'Çıkış',
          accelerator: 'CmdOrCtrl+Q',
          click: () => app.quit(),
        },
      ],
    },
    {
      label: 'Görünüm',
      submenu: [
        { role: 'reload', label: 'Yenile' },
        { role: 'forceReload', label: 'Zorla Yenile' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Varsayılan Yakınlaştırma' },
        { role: 'zoomIn', label: 'Yakınlaştır' },
        { role: 'zoomOut', label: 'Uzaklaştır' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Tam Ekran' },
      ],
    },
    {
      label: 'Yardım',
      submenu: [
        {
          label: 'Hakkında',
          click: () => onAbout(),
        },
        { type: 'separator' },
        {
          label: 'inSCADA Web Sitesi',
          click: () => shell.openExternal('https://www.inscada.com'),
        },
        {
          label: 'Dokümantasyon',
          click: () => shell.openExternal('https://inscada.gitbook.io'),
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  return menu;
}

module.exports = { create };
