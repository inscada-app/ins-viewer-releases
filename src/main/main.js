const { app, BrowserWindow, shell, session } = require('electron');
const path = require('path');
const settingsStore = require('./settings-store');
const windowState = require('./window-state');
const ConnectionChecker = require('./connection-checker');
const tray = require('./tray');
const ipcHandlers = require('./ipc-handlers');
const menu = require('./menu');
const contextMenu = require('./context-menu');
const locale = require('./locale');

// Set Chromium locale before app is ready
const earlySettings = settingsStore.load();
app.commandLine.appendSwitch('lang', earlySettings.language || 'tr');
locale.setLocale(earlySettings.appLanguage || 'tr');

// Single instance lock
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
}

let mainWindow = null;
let splashWindow = null;
let settingsWindow = null;
let aboutWindow = null;
let isQuitting = false;
let connectionChecker = null;

// Store menu/tray callbacks so we can rebuild them
let menuCallbacks = null;
let trayCallbacks = null;

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    resizable: false,
    center: true,
    transparent: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  const lang = locale.getLocale();
  splashWindow.loadFile(path.join(__dirname, '../renderer/splash.html'), {
    query: { lang },
  });
  return splashWindow;
}

function createMainWindow() {
  const savedState = windowState.load();
  const opts = {
    width: (savedState && savedState.width) || 1280,
    height: (savedState && savedState.height) || 800,
    show: false,
    title: 'inSCADA Viewer',
    icon: path.join(__dirname, '../../assets/icon.png'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, '../preload/preload.js'),
    },
  };

  if (savedState && savedState.x !== undefined) {
    opts.x = savedState.x;
    opts.y = savedState.y;
  }

  mainWindow = new BrowserWindow(opts);

  if (savedState && savedState.isMaximized) {
    mainWindow.maximize();
  }

  windowState.track(mainWindow);

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  contextMenu.register(mainWindow);

  mainWindow.on('close', (e) => {
    if (!isQuitting) {
      const settings = settingsStore.load();
      if (settings.minimizeToTray) {
        e.preventDefault();
        mainWindow.hide();
        return;
      }
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  return mainWindow;
}

function createSettingsWindow() {
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.focus();
    return settingsWindow;
  }

  settingsWindow = new BrowserWindow({
    width: 480,
    height: 540,
    resizable: false,
    parent: mainWindow,
    modal: true,
    show: false,
    title: locale.t('title.settings'),
    icon: path.join(__dirname, '../../assets/icon.png'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, '../preload/preload-settings.js'),
    },
  });

  settingsWindow.setMenuBarVisibility(false);
  settingsWindow.loadFile(path.join(__dirname, '../renderer/settings.html'));

  settingsWindow.once('ready-to-show', () => {
    settingsWindow.show();
  });

  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });

  return settingsWindow;
}

function createAboutWindow() {
  if (aboutWindow && !aboutWindow.isDestroyed()) {
    aboutWindow.focus();
    return aboutWindow;
  }

  aboutWindow = new BrowserWindow({
    width: 380,
    height: 340,
    resizable: false,
    parent: mainWindow,
    modal: true,
    show: false,
    title: locale.t('title.about'),
    icon: path.join(__dirname, '../../assets/icon.png'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, '../preload/preload-about.js'),
    },
  });

  aboutWindow.setMenuBarVisibility(false);
  aboutWindow.loadFile(path.join(__dirname, '../renderer/about.html'));

  aboutWindow.once('ready-to-show', () => {
    aboutWindow.show();
  });

  aboutWindow.on('closed', () => {
    aboutWindow = null;
  });

  return aboutWindow;
}

function createNewWindow() {
  const settings = settingsStore.load();

  const newWin = new BrowserWindow({
    width: 1280,
    height: 800,
    title: 'inSCADA Viewer',
    icon: path.join(__dirname, '../../assets/icon.png'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, '../preload/preload.js'),
    },
  });

  // Open external links in default browser
  newWin.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  contextMenu.register(newWin);

  if (connectionChecker && connectionChecker.online) {
    newWin.loadURL(settings.url);
  } else {
    newWin.loadFile(path.join(__dirname, '../renderer/connecting.html'));
  }

  return newWin;
}

function applyLanguage(lang) {
  const browserLocale = lang || 'tr';
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['Accept-Language'] = `${browserLocale},en;q=0.9`;
    callback({ requestHeaders: details.requestHeaders });
  });
}

function rebuildMenu() {
  if (menuCallbacks) {
    menu.create(menuCallbacks);
  }
}

function rebuildTray() {
  if (mainWindow && trayCallbacks) {
    tray.create(mainWindow, trayCallbacks);
  }
}

function showConnecting() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  mainWindow.loadFile(path.join(__dirname, '../renderer/connecting.html'));
}

function loadApp(url) {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  const currentUrl = mainWindow.webContents.getURL();
  // Don't reload if we're already on the target URL
  if (currentUrl.startsWith(url)) return;
  mainWindow.loadURL(url);
}

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  }
});

app.whenReady().then(() => {
  const settings = settingsStore.load();

  // Apply browser language
  applyLanguage(settings.language);

  // Register autostart
  app.setLoginItemSettings({ openAtLogin: settings.autoStart });

  // Create splash
  createSplashWindow();

  // Create main window (hidden)
  createMainWindow();

  // Setup connection checker
  connectionChecker = new ConnectionChecker(settings.url, {
    onStatusChange: (online) => {
      if (online) {
        loadApp(connectionChecker.url);
      } else {
        showConnecting();
      }
    },
  });

  // Register IPC handlers
  ipcHandlers.register({
    connectionChecker,
    onSettingsSaved: (newSettings) => {
      connectionChecker.setUrl(newSettings.url);
      app.setLoginItemSettings({ openAtLogin: newSettings.autoStart });
      applyLanguage(newSettings.language);

      // Handle app language change
      const newAppLang = newSettings.appLanguage || 'tr';
      if (newAppLang !== locale.getLocale()) {
        locale.setLocale(newAppLang);
        rebuildMenu();
        rebuildTray();
      }

      // Trigger a re-check with new URL
      connectionChecker.check();
    },
  });

  // Setup application menu
  menuCallbacks = {
    onNewWindow: () => createNewWindow(),
    onSettings: () => createSettingsWindow(),
    onAbout: () => createAboutWindow(),
  };
  menu.create(menuCallbacks);

  // Setup tray
  trayCallbacks = {
    onSettings: () => createSettingsWindow(),
    onQuit: () => {
      isQuitting = true;
      tray.destroy();
      connectionChecker.stop();
      app.quit();
    },
  };
  tray.create(mainWindow, trayCallbacks);

  // Start connection check
  connectionChecker.check().then((online) => {
    if (online) {
      loadApp(settings.url);
    } else {
      showConnecting();
    }

    // Show main window, close splash
    const showMain = !settings.startMinimized;
    if (showMain) {
      mainWindow.show();
    }
    if (splashWindow && !splashWindow.isDestroyed()) {
      splashWindow.close();
      splashWindow = null;
    }

    // Start periodic checking
    connectionChecker.start();
  });
});

app.on('before-quit', () => {
  isQuitting = true;
});

app.on('window-all-closed', () => {
  // On macOS keep app in dock; on Windows/Linux quit if not minimized to tray
  if (process.platform !== 'darwin' && isQuitting) {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow) {
    mainWindow.show();
  }
});
