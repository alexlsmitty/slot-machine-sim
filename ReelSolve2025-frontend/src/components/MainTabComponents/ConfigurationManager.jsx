import React, { useState, useEffect } from 'react';
import { 
  Button, ButtonGroup, Dialog, DialogActions, DialogContent, 
  DialogTitle, TextField, List, ListItem, ListItemText, 
  IconButton, Stack, Snackbar, Alert, Box, Tooltip
} from '@mui/material';
import { 
  Save as SaveIcon, 
  Upload as LoadIcon, 
  Download as ExportIcon,
  Delete as DeleteIcon, 
  Check as CheckIcon,
  Backup as BackupIcon,
  SaveAs as SaveAsIcon
} from '@mui/icons-material';

const ConfigurationManager = () => {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [configName, setConfigName] = useState('');
  const [savedConfigs, setSavedConfigs] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [loading, setLoading] = useState(false);

  // Load saved configurations list
  const loadSavedConfigList = async () => {
    if (!window.api) return;
    try {
      const configs = await window.api.getSavedConfigurations();
      setSavedConfigs(configs);
    } catch (error) {
      console.error("Failed to load configuration list:", error);
    }
  };

  useEffect(() => {
    loadSavedConfigList();
  }, []);

  // Quick save (working copy)
  const handleQuickSave = async () => {
    if (!window.api) return;
    setLoading(true);
    try {
      const result = await window.api.autoSaveState();
      setSnackbar({
        open: true,
        message: result.success ? 'Configuration saved' : `Save failed: ${result.error}`,
        severity: result.success ? 'success' : 'error'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Save failed: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Save As (named configuration)
  const handleSaveAs = () => {
    setSaveDialogOpen(true);
  };

  // Save dialog confirm
  const handleSaveConfirm = async () => {
    if (!configName.trim()) {
      setSnackbar({
        open: true,
        message: 'Please enter a configuration name',
        severity: 'warning'
      });
      return;
    }

    setLoading(true);
    try {
      const result = await window.api.saveAllConfigurations(configName);
      setSaveDialogOpen(false);
      setConfigName('');
      
      if (result.success) {
        setSnackbar({
          open: true,
          message: `Configuration "${configName}" saved successfully`,
          severity: 'success'
        });
        loadSavedConfigList();
      } else {
        setSnackbar({
          open: true,
          message: `Failed to save: ${result.error}`,
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Save failed: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Load configuration
  const handleLoad = () => {
    loadSavedConfigList();
    setLoadDialogOpen(true);
  };

  // Load specific configuration
  const handleLoadConfig = async (configName) => {
    setLoading(true);
    try {
      const result = await window.api.loadConfiguration(configName);
      setLoadDialogOpen(false);
      
      if (result.success) {
        setSnackbar({
          open: true,
          message: `Configuration "${configName}" loaded successfully`,
          severity: 'success'
        });
        // Reload the page to ensure all components use the new data
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setSnackbar({
          open: true,
          message: `Failed to load: ${result.error}`,
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Load failed: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete configuration
  const handleDeleteConfig = async (configName, event) => {
    event.stopPropagation();
    
    if (window.confirm(`Are you sure you want to delete "${configName}"?`)) {
      try {
        const result = await window.api.deleteConfiguration(configName);
        
        if (result.success) {
          setSnackbar({
            open: true,
            message: `Configuration "${configName}" deleted`,
            severity: 'success'
          });
          loadSavedConfigList();
        } else {
          setSnackbar({
            open: true,
            message: `Failed to delete: ${result.error}`,
            severity: 'error'
          });
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: `Delete failed: ${error.message}`,
          severity: 'error'
        });
      }
    }
  };

  // Handle Export
  const handleExport = async () => {
    setLoading(true);
    try {
      const result = await window.api.exportConfigurations();
      
      if (result.success) {
        setSnackbar({
          open: true,
          message: `Configurations exported to ${result.path}`,
          severity: 'success'
        });
      } else if (result.cancelled) {
        // User cancelled, do nothing
      } else {
        setSnackbar({
          open: true,
          message: `Export failed: ${result.error}`,
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Export failed: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Import
  const handleImport = async () => {
    setLoading(true);
    try {
      const result = await window.api.importConfigurations();
      
      if (result.success) {
        setSnackbar({
          open: true,
          message: 'Configurations imported successfully',
          severity: 'success'
        });
        loadSavedConfigList();
        // Reload to show imported data
        setTimeout(() => window.location.reload(), 1000);
      } else if (result.cancelled) {
        // User cancelled, do nothing
      } else {
        setSnackbar({
          open: true,
          message: `Import failed: ${result.error}`,
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Import failed: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Configuration management buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Tooltip title="Quick Save">
          <Button
            variant="outlined"
            color="primary"
            onClick={handleQuickSave}
            disabled={loading}
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        </Tooltip>
        
        <ButtonGroup variant="outlined" color="primary" disabled={loading}>
          <Tooltip title="Save As...">
            <Button onClick={handleSaveAs} startIcon={<SaveAsIcon />}>
              Save As
            </Button>
          </Tooltip>
          <Tooltip title="Load Configuration">
            <Button onClick={handleLoad} startIcon={<LoadIcon />}>
              Load
            </Button>
          </Tooltip>
          <Tooltip title="Export All Configurations">
            <Button onClick={handleExport} startIcon={<ExportIcon />}>
              Export
            </Button>
          </Tooltip>
          <Tooltip title="Import Configurations">
            <Button onClick={handleImport} startIcon={<BackupIcon />}>
              Import
            </Button>
          </Tooltip>
        </ButtonGroup>
      </Box>

      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Save Configuration</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Configuration Name"
            fullWidth
            value={configName}
            onChange={(e) => setConfigName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveConfirm} color="primary" startIcon={<SaveIcon />}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Load Dialog */}
      <Dialog 
        open={loadDialogOpen} 
        onClose={() => setLoadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Load Configuration</DialogTitle>
        <DialogContent>
          {savedConfigs.length === 0 ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              No saved configurations found
            </Box>
          ) : (
            <List>
              {savedConfigs.map(config => (
                <ListItem 
                  key={config}
                  button
                  onClick={() => handleLoadConfig(config)}
                  secondaryAction={
                    <IconButton 
                      edge="end" 
                      onClick={(e) => handleDeleteConfig(config, e)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText primary={config} />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLoadDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ConfigurationManager;