const { Menu, shell, app } = require('electron');
const { t } = require('./locale');

function create({ onNewWindow, onSettings, onAbout }) {
  const template = [
    {
      label: t('menu.file'),
      submenu: [
        {
          label: t('menu.newWindow'),
          accelerator: 'CmdOrCtrl+N',
          click: () => onNewWindow(),
        },
        { type: 'separator' },
        {
          label: t('menu.settings'),
          accelerator: 'CmdOrCtrl+,',
          click: () => onSettings(),
        },
        { type: 'separator' },
        {
          label: t('menu.quit'),
          accelerator: 'CmdOrCtrl+Q',
          click: () => app.quit(),
        },
      ],
    },
    {
      label: t('menu.view'),
      submenu: [
        { role: 'reload', label: t('menu.reload') },
        { role: 'forceReload', label: t('menu.forceReload') },
        { type: 'separator' },
        { role: 'resetZoom', label: t('menu.resetZoom') },
        { role: 'zoomIn', label: t('menu.zoomIn') },
        { role: 'zoomOut', label: t('menu.zoomOut') },
        { type: 'separator' },
        { role: 'togglefullscreen', label: t('menu.fullscreen') },
      ],
    },
    {
      label: t('menu.help'),
      submenu: [
        {
          label: t('menu.about'),
          click: () => onAbout(),
        },
        { type: 'separator' },
        {
          label: t('menu.website'),
          click: () => shell.openExternal('https://www.inscada.com'),
        },
        {
          label: t('menu.docs'),
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
