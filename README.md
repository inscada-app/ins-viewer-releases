# inSCADA Viewer

A lightweight Electron desktop application that wraps web-based SCADA/HMI panels into a native Windows experience. It loads a configurable server URL while adding native OS integration — system tray, auto-start, window state persistence, connection monitoring, and bilingual UI.

<!-- TODO: Add screenshot of main window -->
<!-- ![Main Window](docs/screenshots/main.png) -->

<!-- TODO: Add screenshot of settings window -->
<!-- ![Settings](docs/screenshots/settings.png) -->

## Features

- **Connection Auto-Retry** — Monitors server availability every 3 seconds; automatically reconnects when the server comes back online
- **System Tray Integration** — Minimize to tray instead of closing; double-click tray icon to restore
- **Multi-Window Support** — Open additional windows with `Ctrl+N`
- **Internationalization (i18n)** — Full Turkish and English UI with 9 browser language options
- **Auto-Start** — Optionally launch on Windows login
- **Window State Persistence** — Remembers position, size, and maximized state across sessions
- **Splash Screen** — Branded loading screen on startup
- **Settings UI** — Built-in settings dialog for all configuration options
- **Single Instance Lock** — Prevents multiple instances from running simultaneously
- **Context Isolation** — Secure architecture with preload scripts and CSP headers

## Installation

Download the latest installer from the [Releases](https://github.com/inscada-app/ins-viewer-releases/tags) page:

1. Download `inSCADA-Viewer-Setup-x.x.x.exe`
2. Run the installer and follow the prompts
3. Launch **inSCADA Viewer** from the Start Menu or Desktop shortcut

## Development

**Prerequisites:** Node.js (v18+)

```bash
# Install dependencies
npm install

# Start in development mode
npm run dev

# Build Windows installer
npm run build
```

The build output (NSIS installer) is generated in the `dist/` directory.

## Configuration

All settings are accessible via **File → Settings** (`Ctrl+,`) and persisted to `%AppData%/inscada-viewer/settings.json`.

| Setting | Default | Description |
|---------|---------|-------------|
| Server URL | `http://localhost:8081` | The web SCADA/HMI URL to display |
| App Language | `tr` | UI language — Turkish or English |
| Browser Language | `tr` | Chromium `Accept-Language` header (TR, EN, DE, FR, ES, RU, AR, ZH, JA) |
| Auto-Start | `false` | Launch application on Windows login |
| Minimize to Tray | `true` | Minimize to system tray on close |
| Start Minimized | `false` | Start the application hidden |

## Project Structure

```
electron-inscada-viewer/
├── src/
│   ├── main/
│   │   ├── main.js                # Application entry point & window management
│   │   ├── settings-store.js      # Settings persistence (JSON)
│   │   ├── locale.js              # i18n translation system
│   │   ├── menu.js                # Application menu bar
│   │   ├── tray.js                # System tray icon & context menu
│   │   ├── ipc-handlers.js        # IPC communication handlers
│   │   ├── connection-checker.js  # Server availability polling
│   │   └── window-state.js        # Window position/size persistence
│   ├── preload/
│   │   ├── preload.js             # Main window preload
│   │   ├── preload-settings.js    # Settings window preload
│   │   └── preload-about.js       # About window preload
│   └── renderer/
│       ├── settings.html/js/css   # Settings page
│       ├── connecting.html/js/css # Connection waiting page
│       ├── splash.html/css        # Splash screen
│       └── about.html             # About dialog
├── assets/
│   ├── icon.ico                   # Windows application icon
│   ├── icon.png                   # Application icon (PNG)
│   └── tray-icon.png              # System tray icon
├── electron-builder.yml           # Build configuration
└── package.json
```

## Localization

The application supports two layers of language settings:

- **App Language** — Controls the UI text (menus, settings dialog, tray, about window). Supports Turkish (`tr`) and English (`en`).
- **Browser Language** — Sets the `Accept-Language` header sent to the SCADA server. Supports 9 languages.

Translation keys are defined in `src/main/locale.js`. To add a new UI language, add a new locale object following the existing `tr`/`en` pattern.

## Tech Stack

- **Electron** 35 — Desktop application framework
- **electron-builder** — Windows NSIS installer packaging
- **Zero runtime dependencies** — Only Electron and build tooling

## License

MIT — © 2025 inSCADA. All rights reserved.

---

## Türkçe

**inSCADA Viewer**, web tabanlı SCADA/HMI panellerini yerel bir Windows masaüstü uygulaması olarak çalıştıran hafif bir Electron uygulamasıdır.

### Temel Özellikler

- Sunucu bağlantısı kesildiğinde otomatik yeniden bağlanma
- Sistem tepsisine küçültme ve arka planda çalışma
- Windows oturum açılışında otomatik başlatma
- Türkçe ve İngilizce arayüz desteği
- Pencere konumu ve boyutunu hatırlama
- `Ctrl+N` ile çoklu pencere açma

### Kurulum

[Releases](https://github.com/inscada-app/ins-viewer-releases/tags) sayfasından en güncel kurulum dosyasını indirin ve çalıştırın.

### Ayarlar

**Dosya → Ayarlar** (`Ctrl+,`) menüsünden sunucu adresi, dil, otomatik başlatma ve tepsi davranışı gibi seçenekleri yapılandırabilirsiniz. Ayarlar `%AppData%/inscada-viewer/settings.json` dosyasında saklanır.
