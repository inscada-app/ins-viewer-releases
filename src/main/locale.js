const translations = {
  tr: {
    // Menu
    'menu.file': 'Dosya',
    'menu.newWindow': 'Yeni Pencere',
    'menu.settings': 'Ayarlar',
    'menu.quit': 'Çıkış',
    'menu.view': 'Görünüm',
    'menu.reload': 'Yenile',
    'menu.forceReload': 'Zorla Yenile',
    'menu.resetZoom': 'Varsayılan Yakınlaştırma',
    'menu.zoomIn': 'Yakınlaştır',
    'menu.zoomOut': 'Uzaklaştır',
    'menu.fullscreen': 'Tam Ekran',
    'menu.help': 'Yardım',
    'menu.about': 'Hakkında',
    'menu.website': 'inSCADA Web Sitesi',
    'menu.docs': 'Dokümantasyon',

    // Context menu
    'context.fullscreen': 'Tam Ekran',
    'context.exitFullscreen': 'Tam Ekrandan Çık',
    'context.zoomIn': 'Yakınlaştır',
    'context.zoomOut': 'Uzaklaştır',
    'context.resetZoom': 'Varsayılan Yakınlaştırma',

    // Tray
    'tray.open': 'Aç',
    'tray.settings': 'Ayarlar',
    'tray.quit': 'Çıkış',

    // Window titles
    'title.settings': 'Ayarlar',
    'title.about': 'Hakkında',

    // Settings page
    'settings.title': 'Ayarlar',
    'settings.serverUrl': 'Sunucu URL',
    'settings.appLanguage': 'Uygulama Dili',
    'settings.browserLanguage': 'Tarayıcı Dili',
    'settings.autoStart': 'Windows başlangıcında otomatik aç',
    'settings.minimizeToTray': 'Kapatınca sistem tepsisine küçült',
    'settings.startMinimized': 'Küçültülmüş olarak başlat',
    'settings.cancel': 'İptal',
    'settings.save': 'Kaydet',

    // Connecting page
    'connecting.title': 'Bağlanıyor...',
    'connecting.info': 'Sunucu erişilebilir olduğunda otomatik bağlanılacak.',

    // Splash page
    'splash.loading': 'Yükleniyor...',

    // About page
    'about.description': 'Web tabanlı SCADA/HMI panellerinizi<br>masaüstü uygulaması olarak görüntüleyin.',
    'about.docs': 'Dokümantasyon',
    'about.copyright': '© 2025 inSCADA. Tüm hakları saklıdır.',
  },

  en: {
    // Menu
    'menu.file': 'File',
    'menu.newWindow': 'New Window',
    'menu.settings': 'Settings',
    'menu.quit': 'Quit',
    'menu.view': 'View',
    'menu.reload': 'Reload',
    'menu.forceReload': 'Force Reload',
    'menu.resetZoom': 'Reset Zoom',
    'menu.zoomIn': 'Zoom In',
    'menu.zoomOut': 'Zoom Out',
    'menu.fullscreen': 'Fullscreen',
    'menu.help': 'Help',
    'menu.about': 'About',
    'menu.website': 'inSCADA Website',
    'menu.docs': 'Documentation',

    // Context menu
    'context.fullscreen': 'Fullscreen',
    'context.exitFullscreen': 'Exit Fullscreen',
    'context.zoomIn': 'Zoom In',
    'context.zoomOut': 'Zoom Out',
    'context.resetZoom': 'Reset Zoom',

    // Tray
    'tray.open': 'Open',
    'tray.settings': 'Settings',
    'tray.quit': 'Quit',

    // Window titles
    'title.settings': 'Settings',
    'title.about': 'About',

    // Settings page
    'settings.title': 'Settings',
    'settings.serverUrl': 'Server URL',
    'settings.appLanguage': 'Application Language',
    'settings.browserLanguage': 'Browser Language',
    'settings.autoStart': 'Open automatically at Windows startup',
    'settings.minimizeToTray': 'Minimize to system tray on close',
    'settings.startMinimized': 'Start minimized',
    'settings.cancel': 'Cancel',
    'settings.save': 'Save',

    // Connecting page
    'connecting.title': 'Connecting...',
    'connecting.info': 'Will automatically connect when the server is available.',

    // Splash page
    'splash.loading': 'Loading...',

    // About page
    'about.description': 'View your web-based SCADA/HMI panels<br>as a desktop application.',
    'about.docs': 'Documentation',
    'about.copyright': '© 2025 inSCADA. All rights reserved.',
  },
};

let currentLocale = 'tr';

function setLocale(lang) {
  if (translations[lang]) {
    currentLocale = lang;
  }
}

function getLocale() {
  return currentLocale;
}

function t(key) {
  const dict = translations[currentLocale] || translations.tr;
  return dict[key] || key;
}

function getStrings() {
  return { ...(translations[currentLocale] || translations.tr) };
}

module.exports = { setLocale, getLocale, t, getStrings };
