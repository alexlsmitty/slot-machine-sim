// db.js
const Database = require('better-sqlite3');
const path = require('path');

// Define the path to the database file
const dbPath = path.join(__dirname, 'data.db');
const db = new Database(dbPath);

// Create tables for each configuration type if they do not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS reel_config (
    id INTEGER PRIMARY KEY,
    config TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS symbol_config (
    id INTEGER PRIMARY KEY,
    config TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS payline_config (
    id INTEGER PRIMARY KEY,
    config TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS rules_config (
    id INTEGER PRIMARY KEY,
    config TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Generic function to save a configuration as JSON
function saveConfig(table, config) {
  const jsonConfig = JSON.stringify(config);
  // Using REPLACE INTO ensures that the row with id 1 is updated (or inserted)
  const stmt = db.prepare(`REPLACE INTO ${table} (id, config, updated_at) VALUES (1, ?, CURRENT_TIMESTAMP)`);
  return stmt.run(jsonConfig);
}

// Generic function to load a configuration and parse it from JSON
function getConfig(table) {
  const stmt = db.prepare(`SELECT config FROM ${table} WHERE id = 1`);
  const row = stmt.get();
  return row ? JSON.parse(row.config) : null;
}

// Export functions for each configuration type
module.exports = {
  saveReelConfig: (config) => saveConfig('reel_config', config),
  getReelConfig: () => getConfig('reel_config'),
  saveSymbolConfig: (config) => saveConfig('symbol_config', config),
  getSymbolConfig: () => getConfig('symbol_config'),
  savePaylineConfig: (config) => saveConfig('payline_config', config),
  getPaylineConfig: () => getConfig('payline_config'),
  saveRulesConfig: (config) => saveConfig('rules_config', config),
  getRulesConfig: () => getConfig('rules_config'),
};
