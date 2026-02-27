const { Menu } = require('electron');
const { t } = require('./locale');

function register(window) {
  window.webContents.on('context-menu', () => {
    const isFullScreen = window.isFullScreen();

    const template = [
      {
        label: isFullScreen ? t('context.exitFullscreen') : t('context.fullscreen'),
        click: () => window.setFullScreen(!isFullScreen),
      },
      { type: 'separator' },
      {
        label: t('context.zoomIn'),
        click: () => {
          const level = window.webContents.getZoomLevel();
          window.webContents.setZoomLevel(level + 0.5);
        },
      },
      {
        label: t('context.zoomOut'),
        click: () => {
          const level = window.webContents.getZoomLevel();
          window.webContents.setZoomLevel(level - 0.5);
        },
      },
      {
        label: t('context.resetZoom'),
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
