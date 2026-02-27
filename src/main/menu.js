const { Menu, shell, app, nativeImage } = require('electron');
const path = require('path');
const { t } = require('./locale');

const iconsDir = path.join(__dirname, '../../assets/icons');

function icon(name) {
  return nativeImage.createFromPath(path.join(iconsDir, `${name}.png`)).resize({ width: 16, height: 16 });
}

function create({ onNewWindow, onSettings, onAbout }) {
  const template = [
    {
      label: t('menu.file'),
      submenu: [
        {
          label: t('menu.newWindow'),
          icon: icon('open_in_new'),
          accelerator: 'CmdOrCtrl+N',
          click: () => onNewWindow(),
        },
        { type: 'separator' },
        {
          label: t('menu.settings'),
          icon: icon('settings'),
          accelerator: 'CmdOrCtrl+,',
          click: () => onSettings(),
        },
        { type: 'separator' },
        {
          label: t('menu.quit'),
          icon: icon('power_settings_new'),
          accelerator: 'CmdOrCtrl+Q',
          click: () => app.quit(),
        },
      ],
    },
    {
      label: t('menu.view'),
      submenu: [
        { role: 'reload', label: t('menu.reload'), icon: icon('refresh') },
        { role: 'forceReload', label: t('menu.forceReload'), icon: icon('refresh') },
        { type: 'separator' },
        { role: 'resetZoom', label: t('menu.resetZoom'), icon: icon('zoom_out_map') },
        { role: 'zoomIn', label: t('menu.zoomIn'), icon: icon('zoom_in') },
        { role: 'zoomOut', label: t('menu.zoomOut'), icon: icon('zoom_out') },
        { type: 'separator' },
        { role: 'togglefullscreen', label: t('menu.fullscreen'), icon: icon('fullscreen') },
      ],
    },
    {
      label: t('menu.help'),
      submenu: [
        {
          label: t('menu.about'),
          icon: icon('info'),
          click: () => onAbout(),
        },
        { type: 'separator' },
        {
          label: t('menu.website'),
          icon: icon('public'),
          click: () => shell.openExternal('https://www.inscada.com'),
        },
        {
          label: t('menu.docs'),
          icon: icon('menu_book'),
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
