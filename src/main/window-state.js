const fs = require('fs');
const path = require('path');
const { app, screen } = require('electron');

const STATE_FILE = 'window-state.json';
let debounceTimer = null;

function getFilePath() {
  return path.join(app.getPath('userData'), STATE_FILE);
}

function load() {
  try {
    const data = fs.readFileSync(getFilePath(), 'utf-8');
    const state = JSON.parse(data);
    // Validate that saved position is within a visible display
    const displays = screen.getAllDisplays();
    const visible = displays.some((d) => {
      const { x, y, width, height } = d.bounds;
      return (
        state.x >= x &&
        state.x < x + width &&
        state.y >= y &&
        state.y < y + height
      );
    });
    if (!visible) return null;
    return state;
  } catch {
    return null;
  }
}

function save(state) {
  fs.writeFileSync(getFilePath(), JSON.stringify(state, null, 2), 'utf-8');
}

function track(win) {
  const persist = () => {
    if (win.isDestroyed()) return;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (win.isDestroyed()) return;
      const bounds = win.getNormalBounds();
      save({
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
        isMaximized: win.isMaximized(),
      });
    }, 500);
  };

  win.on('resize', persist);
  win.on('move', persist);
}

module.exports = { load, track };
