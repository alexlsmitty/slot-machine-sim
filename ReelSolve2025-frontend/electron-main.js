// In your electron-main.js
const { app, BrowserWindow, ipcMain, net } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const db = require('./db'); // Our db.js file

// Flask server process reference
let flaskProcess = null;
const FLASK_PORT = 5000;

function startFlaskServer() {
  // Determine the path to Python executable and Flask app
  // Adjust paths based on your project structure and environment
  const pythonExecutable = process.platform === 'win32' ? 'python' : 'python3';
  const flaskAppPath = path.join(__dirname, 'server', 'app.py');
  
  console.log('Starting Flask server...');
  
  // Launch Flask app as a child process
  flaskProcess = spawn(pythonExecutable, [flaskAppPath]);
  
  // Log Flask server output for debugging
  flaskProcess.stdout.on('data', (data) => {
    console.log(`Flask: ${data.toString().trim()}`);
  });
  
  // Log any Flask server errors
  flaskProcess.stderr.on('data', (data) => {
    console.error(`Flask Error: ${data.toString().trim()}`);
  });
  
  // Handle Flask server process exit
  flaskProcess.on('close', (code) => {
    console.log(`Flask server exited with code ${code}`);
    flaskProcess = null;
  });

  // Simple health check to ensure Flask is running
  setTimeout(() => {
    const request = net.request({
      method: 'GET',
      protocol: 'http:',
      hostname: 'localhost',
      port: FLASK_PORT,
      path: '/health'
    });

    request.on('response', (response) => {
      if (response.statusCode === 200) {
        console.log('Flask server is running correctly');
      } else {
        console.warn('Flask server health check failed:', response.statusCode);
      }
    });

    request.on('error', (error) => {
      console.error('Flask server health check error:', error);
    });

    request.end();
  }, 2000); // Wait 2 seconds for Flask to start
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280, // Increased size for better user experience
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    // Open DevTools automatically in development
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  return mainWindow;
}

// Start the app and Flask server
app.whenReady().then(() => {
  startFlaskServer();
  const mainWindow = createWindow();
  
  // Set up Flask API proxy through IPC for secure communication
  setupFlaskApiHandlers();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Ensure Flask server is properly terminated when the app quits
app.on('quit', () => {
  if (flaskProcess) {
    console.log('Terminating Flask server...');
    if (process.platform === 'win32') {
      // On Windows, we need to use taskkill to kill the process tree
      spawn('taskkill', ['/pid', flaskProcess.pid, '/f', '/t']);
    } else {
      // On Unix, we can kill the process group
      process.kill(-flaskProcess.pid);
    }
    flaskProcess = null;
  }
});

// Set up secure IPC handlers to proxy requests to Flask API
function setupFlaskApiHandlers() {
  // General API request handler
  ipcMain.handle('flask-api-request', async (event, options) => {
    const { method = 'GET', endpoint, data } = options;
    
    try {
      return await makeFlaskRequest(method, endpoint, data);
    } catch (error) {
      console.error(`API request error: ${error.message}`);
      return { 
        error: true, 
        message: error.message 
      };
    }
  });
  
  // Test endpoint example
  ipcMain.handle('flask-api-test', async () => {
    try {
      return await makeFlaskRequest('GET', '/api/test');
    } catch (error) {
      console.error(`Test API error: ${error.message}`);
      return { 
        error: true, 
        message: error.message 
      };
    }
  });
}

// Helper function to make requests to Flask API
async function makeFlaskRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      method: method,
      protocol: 'http:',
      hostname: 'localhost',
      port: FLASK_PORT,
      path: endpoint
    };
    
    const request = net.request(options);
    
    request.on('response', (response) => {
      let responseData = '';
      
      response.on('data', (chunk) => {
        responseData += chunk.toString();
      });
      
      response.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve(parsedData);
        } catch (error) {
          resolve({ rawResponse: responseData });
        }
      });
    });
    
    request.on('error', (error) => {
      reject(error);
    });
    
    if (data && (method === 'POST' || method === 'PUT')) {
      request.write(JSON.stringify(data));
    }
    
    request.end();
  });
}

// Existing IPC handlers for database
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
