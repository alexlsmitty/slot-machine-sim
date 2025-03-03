// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  saveReelConfig: (config) => ipcRenderer.invoke('db-save-reel-config', config),
  getReelConfig: () => ipcRenderer.invoke('db-get-reel-config'),
  saveSymbolConfig: (config) => ipcRenderer.invoke('db-save-symbol-config', config),
  getSymbolConfig: () => ipcRenderer.invoke('db-get-symbol-config'),
  savePaylineConfig: (config) => ipcRenderer.invoke('db-save-payline-config', config),
  getPaylineConfig: () => ipcRenderer.invoke('db-get-payline-config'),
  saveRulesConfig: (config) => ipcRenderer.invoke('db-save-rules-config', config),
  getRulesConfig: () => ipcRenderer.invoke('db-get-rules-config'),
});
