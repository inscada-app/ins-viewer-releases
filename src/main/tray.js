const { Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const { t } = require('./locale');

let tray = null;

function create(mainWindow, { onSettings, onQuit }) {
  // Destroy previous tray if rebuilding
  if (tray) {
    tray.destroy();
    tray = null;
  }

  const iconPath = path.join(__dirname, '../../assets/tray-icon.png');
  let icon;
  try {
    icon = nativeImage.createFromPath(iconPath);
    if (icon.isEmpty()) throw new Error('empty');
  } catch {
    // Fallback: create a simple 16x16 icon
    icon = nativeImage.createEmpty();
  }

  tray = new Tray(icon);
  tray.setToolTip('inSCADA Viewer');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: t('tray.open'),
      click: () => {
        mainWindow.show();
        mainWindow.focus();
      },
    },
    {
      label: t('tray.settings'),
      click: () => onSettings(),
    },
    { type: 'separator' },
    {
      label: t('tray.quit'),
      click: () => onQuit(),
    },
  ]);

  tray.setContextMenu(contextMenu);
  tray.on('double-click', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  return tray;
}

function destroy() {
  if (tray) {
    tray.destroy();
    tray = null;
  }
}

module.exports = { create, destroy };
