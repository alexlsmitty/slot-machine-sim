import React, { useState, useEffect } from 'react';
import {
  Box, Button, ButtonGroup, Card, CardContent, CardHeader, 
  Dialog, Grid2, IconButton, MenuItem, Paper, Popover, 
  Select, Snackbar, Tab, Tabs, TextField, Tooltip, 
  Typography, FormControl, InputLabel, InputAdornment, Alert
} from '@mui/material';
import {
  Add as PlusIcon,
  Remove as MinusIcon,
  ContentCopy as CopyIcon,
  Save as SaveIcon,
  Upload as UploadIcon,
  HelpOutline as HelpIcon
} from '@mui/icons-material';
import { useSymbolLibrary, useReelMatrix } from '@contexts/GameContexts';
import ErrorBoundary from '../Shared/errorBoundary';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ReelMatrix = ({ onSave }) => {
  const [errorMessage, setErrorMessage] = useState(null);
  
  try {
    // Use the shared symbol library from context
    const { symbols } = useSymbolLibrary();
    
    // Use the shared reel matrix context instead of local state
    const { reelConfig, setReelConfig } = useReelMatrix();
    
    const [activeTab, setActiveTab] = useState(0);
    const [draggingSymbol, setDraggingSymbol] = useState(null);
    const [snackbar, setSnackbar] = useState({
      open: false,
      message: '',
      severity: 'success'
    });
    
    const addReel = () => {
      try {
        const newReel = {
          id: reelConfig.reels.length + 1,
          height: 3,
          visibleHeight: 3,
          symbols: []
        };
        
        setReelConfig({
          ...reelConfig,
          reels: [...reelConfig.reels, newReel]
        });
      } catch (error) {
        console.error("Error adding reel:", error);
        setErrorMessage(`Failed to add reel: ${error.message}`);
      }
    };

    const removeReel = () => {
      try {
        if (reelConfig.reels.length <= 1) {
          setSnackbar({
            open: true,
            message: 'Cannot remove the last reel',
            severity: 'error'
          });
          return;
        }
        
        const updatedReels = [...reelConfig.reels];
        updatedReels.pop();
        
        setReelConfig({
          ...reelConfig,
          reels: updatedReels
        });
      } catch (error) {
        console.error("Error removing reel:", error);
        setErrorMessage(`Failed to remove reel: ${error.message}`);
      }
    };

    // The rest of the functions remain largely the same, but with error handling added
    // Let's modify the save function to work with the context

    const saveConfiguration = () => {
      try {
        // The context is already updated as changes are made
        // We only need to trigger the API call and notify the user
        
        // Call the onSave prop if provided (for backward compatibility)
        if (onSave) {
          onSave(reelConfig);
        }
        
        // API saving is now handled by the context's useEffect
        // We just show a success notification to the user
        setSnackbar({
          open: true,
          message: 'Reel configuration saved successfully',
          severity: 'success'
        });
      } catch (error) {
        console.error("Error saving configuration:", error);
        setErrorMessage(`Failed to save configuration: ${error.message}`);
        
        setSnackbar({
          open: true,
          message: `Failed to save configuration: ${error.message}`,
          severity: 'error'
        });
      }
    };

    const handleCloseSnackbar = () => {
      setSnackbar({ ...snackbar, open: false });
    };

    return (
      <ErrorBoundary>
        <Card>
          <CardHeader 
            title="Reel Matrix Configuration" 
            action={
              <Tooltip title="Save current configuration">
                <Button 
                  variant="contained" 
                  startIcon={<SaveIcon />} 
                  onClick={saveConfiguration}
                >
                  Save Configuration
                </Button>
              </Tooltip>
            }
          />
          <CardContent>
            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMessage(null)}>
                {errorMessage}
              </Alert>
            )}
            
            <Tabs 
              value={activeTab} 
              onChange={(event, newValue) => setActiveTab(newValue)}
              sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
            >
              <Tab label="Edit Reels" id="tab-0" aria-controls="tabpanel-0" />
              <Tab label="Visualization" id="tab-1" aria-controls="tabpanel-1" />
            </Tabs>
            
            {/* The rest of your component remains the same */}
            {/* TabPanels with all the reel editing functionality */}
            
          </CardContent>
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            message={snackbar.message}
          />
        </Card>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error("Critical error in ReelMatrix:", error);
    return (
      <Card>
        <CardContent>
          <Alert severity="error">
            Failed to initialize Reel Matrix: {error.message}
          </Alert>
        </CardContent>
      </Card>
    );
  }
};

export default ReelMatrix;
