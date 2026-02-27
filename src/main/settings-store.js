const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const DEFAULTS = {
  url: 'http://localhost:8081',
  autoStart: false,
  minimizeToTray: true,
  startMinimized: false,
  language: 'tr',
};

let filePath;

function getFilePath() {
  if (!filePath) {
    filePath = path.join(app.getPath('userData'), 'settings.json');
  }
  return filePath;
}

function load() {
  try {
    const data = fs.readFileSync(getFilePath(), 'utf-8');
    return { ...DEFAULTS, ...JSON.parse(data) };
  } catch {
    return { ...DEFAULTS };
  }
}

function save(settings) {
  const merged = { ...DEFAULTS, ...settings };
  fs.writeFileSync(getFilePath(), JSON.stringify(merged, null, 2), 'utf-8');
  return merged;
}

module.exports = { load, save, DEFAULTS };
