const { Menu, nativeImage } = require('electron');
const path = require('path');
const { t } = require('./locale');

const iconsDir = path.join(__dirname, '../../assets/icons');

function icon(name) {
  return nativeImage.createFromPath(path.join(iconsDir, `${name}.png`)).resize({ width: 16, height: 16 });
}

function register(window) {
  window.webContents.on('context-menu', () => {
    const isFullScreen = window.isFullScreen();

    const template = [
      {
        label: isFullScreen ? t('context.exitFullscreen') : t('context.fullscreen'),
        icon: icon(isFullScreen ? 'close_fullscreen' : 'fullscreen'),
        click: () => window.setFullScreen(!isFullScreen),
      },
      { type: 'separator' },
      {
        label: t('context.zoomIn'),
        icon: icon('zoom_in'),
        click: () => {
          const level = window.webContents.getZoomLevel();
          window.webContents.setZoomLevel(level + 0.5);
        },
      },
      {
        label: t('context.zoomOut'),
        icon: icon('zoom_out'),
        click: () => {
          const level = window.webContents.getZoomLevel();
          window.webContents.setZoomLevel(level - 0.5);
        },
      },
      {
        label: t('context.resetZoom'),
        icon: icon('zoom_out_map'),
        click: () => {
          window.webContents.setZoomLevel(0);
        },
      },
    ];

    const menu = Menu.buildFromTemplate(template);
    menu.popup({ window });
  });
}

module.exports = { register };
