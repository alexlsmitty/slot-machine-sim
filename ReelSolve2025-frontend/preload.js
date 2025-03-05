// preload.js
const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
const { app, dialog } = require('@electron/remote');

// Add these memory cache variables
let symbolConfigMemory = null;
let reelConfigMemory = null;
let paylineConfigMemory = null;
let rulesetConfigMemory = null;
let bonusConfigMemory = null;

contextBridge.exposeInMainWorld('api', {
  saveReelConfig: (config) => ipcRenderer.invoke('db-save-reel-config', config),
  getReelConfig: () => ipcRenderer.invoke('db-get-reel-config'),
  saveSymbolConfig: (config) => ipcRenderer.invoke('db-save-symbol-config', config),
  getSymbolConfig: () => ipcRenderer.invoke('db-get-symbol-config'),
  savePaylineConfig: (config) => ipcRenderer.invoke('db-save-payline-config', config),
  getPaylineConfig: () => ipcRenderer.invoke('db-get-payline-config'),
  saveRulesConfig: (config) => ipcRenderer.invoke('db-save-rules-config', config),
  getRulesConfig: () => ipcRenderer.invoke('db-get-rules-config'),

  // These were missing but referenced in your configuration functions
  saveRulesetConfig: (config) => ipcRenderer.invoke('db-save-ruleset-config', config),
  getRulesetConfig: () => ipcRenderer.invoke('db-get-ruleset-config'),
  saveBonusConfig: (config) => ipcRenderer.invoke('db-save-bonus-config', config),
  getBonusConfig: () => ipcRenderer.invoke('db-get-bonus-config'),

  // New functions for global configuration management
  quickSaveConfiguration: async () => {
    // Save all current configurations without a specific name
    // This saves the "working copy"
    try {
      // Get each configuration type and save it
      const symbolConfig = await window.api.getSymbolConfig();
      const reelConfig = await window.api.getReelConfig();
      const paylineConfig = await window.api.getPaylineConfig();
      const rulesetConfig = await window.api.getRulesetConfig();
      const bonusConfig = await window.api.getBonusConfig();
      
      // Save each configuration
      await window.api.saveSymbolConfig(symbolConfig);
      await window.api.saveReelConfig(reelConfig);
      await window.api.savePaylineConfig(paylineConfig);
      await window.api.saveRulesetConfig(rulesetConfig);
      await window.api.saveBonusConfig(bonusConfig);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  saveAllConfigurations: async (configName) => {
    // Save the current state to a named configuration
    try {
      // Get current configurations
      const symbolConfig = await window.api.getSymbolConfig();
      const reelConfig = await window.api.getReelConfig();
      const paylineConfig = await window.api.getPaylineConfig();
      const rulesetConfig = await window.api.getRulesetConfig();
      const bonusConfig = await window.api.getBonusConfig();
      
      // Package all configurations
      const fullConfig = {
        name: configName,
        timestamp: Date.now(),
        symbols: symbolConfig,
        reels: reelConfig,
        paylines: paylineConfig,
        ruleset: rulesetConfig,
        bonus: bonusConfig
      };
      
      // Save to a file in the configurations directory
      const configsPath = path.join(app.getPath('userData'), 'configurations');
      if (!fs.existsSync(configsPath)) {
        fs.mkdirSync(configsPath, { recursive: true });
      }
      
      const configFilePath = path.join(configsPath, `${configName}.json`);
      fs.writeFileSync(configFilePath, JSON.stringify(fullConfig, null, 2));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  getSavedConfigurations: async () => {
    // Get list of saved configurations
    try {
      const configsPath = path.join(app.getPath('userData'), 'configurations');
      if (!fs.existsSync(configsPath)) {
        return [];
      }
      
      const files = fs.readdirSync(configsPath);
      return files
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''));
    } catch (error) {
      return [];
    }
  },
  
  loadConfiguration: async (configName) => {
    // Load a named configuration
    try {
      const configsPath = path.join(app.getPath('userData'), 'configurations');
      const configFilePath = path.join(configsPath, `${configName}.json`);
      
      if (!fs.existsSync(configFilePath)) {
        throw new Error(`Configuration "${configName}" not found`);
      }
      
      const configData = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
      
      // Save each config type to its respective storage
      if (configData.symbols) await window.api.saveSymbolConfig(configData.symbols);
      if (configData.reels) await window.api.saveReelConfig(configData.reels);
      if (configData.paylines) await window.api.savePaylineConfig(configData.paylines);
      if (configData.ruleset) await window.api.saveRulesetConfig(configData.ruleset);
      if (configData.bonus) await window.api.saveBonusConfig(configData.bonus);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  exportConfigurations: async () => {
    // Export all configurations to a file
    try {
      const { filePath } = await dialog.showSaveDialog({
        title: 'Export Configurations',
        defaultPath: path.join(app.getPath('documents'), 'ReelSolve-Config-Export.json'),
        filters: [{ name: 'JSON Files', extensions: ['json'] }]
      });
      
      if (!filePath) {
        return { success: false, cancelled: true };
      }
      
      // Get all saved configurations
      const configsPath = path.join(app.getPath('userData'), 'configurations');
      const workingConfig = path.join(app.getPath('userData'), 'config');
      
      let exportData = {
        timestamp: Date.now(),
        configurations: {},
        workingCopy: {}
      };
      
      // Add saved configurations
      if (fs.existsSync(configsPath)) {
        const files = fs.readdirSync(configsPath);
        for (const file of files) {
          if (file.endsWith('.json')) {
            const configName = file.replace('.json', '');
            const configData = JSON.parse(fs.readFileSync(path.join(configsPath, file), 'utf8'));
            exportData.configurations[configName] = configData;
          }
        }
      }
      
      // Add working copy
      if (fs.existsSync(workingConfig)) {
        const workingFiles = ['symbols.json', 'reels.json', 'paylines.json', 'ruleset.json', 'bonus.json'];
        for (const file of workingFiles) {
          const filePath = path.join(workingConfig, file);
          if (fs.existsSync(filePath)) {
            const configType = file.replace('.json', '');
            exportData.workingCopy[configType] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          }
        }
      }
      
      fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2));
      
      return { success: true, path: filePath };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  importConfigurations: async () => {
    // Import configurations from a file
    try {
      const { filePaths } = await dialog.showOpenDialog({
        title: 'Import Configurations',
        filters: [{ name: 'JSON Files', extensions: ['json'] }],
        properties: ['openFile']
      });
      
      if (!filePaths || filePaths.length === 0) {
        return { success: false, cancelled: true };
      }
      
      const importData = JSON.parse(fs.readFileSync(filePaths[0], 'utf8'));
      
      // Save configurations
      if (importData.configurations) {
        const configsPath = path.join(app.getPath('userData'), 'configurations');
        if (!fs.existsSync(configsPath)) {
          fs.mkdirSync(configsPath, { recursive: true });
        }
        
        for (const [configName, configData] of Object.entries(importData.configurations)) {
          const configFilePath = path.join(configsPath, `${configName}.json`);
          fs.writeFileSync(configFilePath, JSON.stringify(configData, null, 2));
        }
      }
      
      // Save working copy
      if (importData.workingCopy) {
        const workingConfig = path.join(app.getPath('userData'), 'config');
        if (!fs.existsSync(workingConfig)) {
          fs.mkdirSync(workingConfig, { recursive: true });
        }
        
        if (importData.workingCopy.symbols) {
          fs.writeFileSync(
            path.join(workingConfig, 'symbols.json'), 
            JSON.stringify(importData.workingCopy.symbols, null, 2)
          );
        }
        
        if (importData.workingCopy.reels) {
          fs.writeFileSync(
            path.join(workingConfig, 'reels.json'), 
            JSON.stringify(importData.workingCopy.reels, null, 2)
          );
        }
        
        if (importData.workingCopy.paylines) {
          fs.writeFileSync(
            path.join(workingConfig, 'paylines.json'), 
            JSON.stringify(importData.workingCopy.paylines, null, 2)
          );
        }
        
        if (importData.workingCopy.ruleset) {
          fs.writeFileSync(
            path.join(workingConfig, 'ruleset.json'), 
            JSON.stringify(importData.workingCopy.ruleset, null, 2)
          );
        }
        
        if (importData.workingCopy.bonus) {
          fs.writeFileSync(
            path.join(workingConfig, 'bonus.json'), 
            JSON.stringify(importData.workingCopy.bonus, null, 2)
          );
        }
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  deleteConfiguration: async (configName) => {
    // Delete a saved configuration
    try {
      const configsPath = path.join(app.getPath('userData'), 'configurations');
      const configFilePath = path.join(configsPath, `${configName}.json`);
      if (fs.existsSync(configFilePath)) {
        fs.unlinkSync(configFilePath);
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Auto-save function for component switching
  autoSaveState: async () => {
    try {
      // Get current data from memory
      const symbolConfig = await ipcRenderer.invoke('db-get-symbol-config-memory');
      const reelConfig = await ipcRenderer.invoke('db-get-reel-config-memory');
      const paylineConfig = await ipcRenderer.invoke('db-get-payline-config-memory');
      const rulesetConfig = await ipcRenderer.invoke('db-get-ruleset-config-memory');
      const bonusConfig = await ipcRenderer.invoke('db-get-bonus-config-memory');
      
      // Save to persistent storage
      if (symbolConfig) await ipcRenderer.invoke('db-save-symbol-config', symbolConfig);
      if (reelConfig) await ipcRenderer.invoke('db-save-reel-config', reelConfig);
      if (paylineConfig) await ipcRenderer.invoke('db-save-payline-config', paylineConfig);
      if (rulesetConfig) await ipcRenderer.invoke('db-save-ruleset-config', rulesetConfig);
      if (bonusConfig) await ipcRenderer.invoke('db-save-bonus-config', bonusConfig);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
});

// Add these IPC handlers to your existing ones
ipcMain.handle('db-get-symbol-config-memory', async () => {
  return symbolConfigMemory;
});

ipcMain.handle('db-get-reel-config-memory', async () => {
  return reelConfigMemory;
});

ipcMain.handle('db-get-payline-config-memory', async () => {
  return paylineConfigMemory;
});

ipcMain.handle('db-get-ruleset-config-memory', async () => {
  return rulesetConfigMemory;
});

ipcMain.handle('db-get-bonus-config-memory', async () => {
  return bonusConfigMemory;
});

// Update your save handlers to store in memory too
ipcMain.handle('db-save-symbol-config', async (event, config) => {
  try {
    // Save to memory
    symbolConfigMemory = config;
    
    // Also save to disk
    // ... your existing code ...
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Add similar memory caching for all other save handlers
