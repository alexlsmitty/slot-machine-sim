// In your electron-main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./db'); // Our db.js file

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC handlers for reel configuration
ipcMain.handle('db-save-reel-config', (event, config) => {
  return db.saveReelConfig(config);
});
ipcMain.handle('db-get-reel-config', () => {
  return db.getReelConfig();
});

// Similarly, add handlers for symbols, paylines, and rules
ipcMain.handle('db-save-symbol-config', (event, config) => {
  return db.saveSymbolConfig(config);
});
ipcMain.handle('db-get-symbol-config', () => {
  return db.getSymbolConfig();
});

ipcMain.handle('db-save-payline-config', (event, config) => {
  return db.savePaylineConfig(config);
});
ipcMain.handle('db-get-payline-config', () => {
  return db.getPaylineConfig();
});

ipcMain.handle('db-save-rules-config', (event, config) => {
  return db.saveRulesConfig(config);
});
ipcMain.handle('db-get-rules-config', () => {
  return db.getRulesConfig();
});
