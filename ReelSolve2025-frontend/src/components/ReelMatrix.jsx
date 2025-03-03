import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  Grid2,
  IconButton,
  MenuItem,
  Paper,
  Popover,
  Select,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  FormControl,
  InputLabel,
  InputAdornment
} from '@mui/material';
import {
  Add as PlusIcon,
  Remove as MinusIcon,
  ContentCopy as CopyIcon,
  Save as SaveIcon,
  Upload as UploadIcon,
  HelpOutline as HelpIcon
} from '@mui/icons-material';
import './ReelMatrix.css';

// Sample symbol data - in a real app, this would come from your database or state
const SAMPLE_SYMBOLS = [
  { id: 'wild', name: 'Wild', color: '#FFD700', special: true },
  { id: 'scatter', name: 'Scatter', color: '#FF5733', special: true },
  { id: 'high1', name: 'High 1', color: '#C70039' },
  { id: 'high2', name: 'High 2', color: '#900C3F' },
  { id: 'high3', name: 'High 3', color: '#581845' },
  { id: 'low1', name: 'Low 1', color: '#2471A3' },
  { id: 'low2', name: 'Low 2', color: '#2E86C1' },
  { id: 'low3', name: 'Low 3', color: '#3498DB' },
  { id: 'low4', name: 'Low 4', color: '#AED6F1' },
];

// TabPanel component for tab content
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

const ReelMatrix = ({ onSave, initialConfig = null }) => {
  // State for reel configuration
  const [reelConfig, setReelConfig] = useState({
    selectionMethod: 'percentage', // 'percentage' or 'fixed'
    reels: initialConfig?.reels || [
      { id: 1, height: 3, symbols: [] },
      { id: 2, height: 3, symbols: [] },
      { id: 3, height: 3, symbols: [] },
      { id: 4, height: 3, symbols: [] },
      { id: 5, height: 3, symbols: [] },
    ]
  });
  
  const [activeTab, setActiveTab] = useState(0);
  const [draggingSymbol, setDraggingSymbol] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Load initial configuration if provided
  useEffect(() => {
    if (initialConfig) {
      setReelConfig(initialConfig);
    }
  }, [initialConfig]);

  // Add a new reel
  const addReel = () => {
    const newReel = {
      id: reelConfig.reels.length + 1,
      height: 3,
      symbols: []
    };
    
    setReelConfig({
      ...reelConfig,
      reels: [...reelConfig.reels, newReel]
    });
  };

  // Remove the last reel
  const removeReel = () => {
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
  };

  // Update the height of a specific reel
  const updateReelHeight = (reelIndex, newHeight) => {
    const updatedReels = [...reelConfig.reels];
    
    // Ensure height is at least 1
    newHeight = Math.max(1, newHeight);
    
    // Update the reel height
    updatedReels[reelIndex] = {
      ...updatedReels[reelIndex],
      height: newHeight
    };
    
    // Adjust symbols array length to match new height
    if (reelConfig.selectionMethod === 'fixed') {
      const currentSymbols = updatedReels[reelIndex].symbols || [];
      if (newHeight > currentSymbols.length) {
        // Add empty slots if height increased
        const additionalSlots = Array(newHeight - currentSymbols.length).fill(null);
        updatedReels[reelIndex].symbols = [...currentSymbols, ...additionalSlots];
      } else {
        // Truncate if height decreased
        updatedReels[reelIndex].symbols = currentSymbols.slice(0, newHeight);
      }
    }
    
    setReelConfig({
      ...reelConfig,
      reels: updatedReels
    });
  };

  // Change selection method (percentage vs fixed)
  const handleMethodChange = (event) => {
    const method = event.target.value;
    
    // Reset symbols configuration when switching methods
    const updatedReels = reelConfig.reels.map(reel => {
      return {
        ...reel,
        symbols: method === 'fixed' 
          ? Array(reel.height).fill(null) // For fixed, create array with null slots
          : [] // For percentage, start with empty array
      };
    });
    
    setReelConfig({
      ...reelConfig,
      selectionMethod: method,
      reels: updatedReels
    });
  };

  // Handle symbol drag start
  const handleDragStart = (symbol) => {
    setDraggingSymbol(symbol);
  };

  // Handle dropping symbol into a reel position (for fixed placement)
  const handleDropOnPosition = (reelIndex, positionIndex) => {
    if (!draggingSymbol || reelConfig.selectionMethod !== 'fixed') return;
    
    const updatedReels = [...reelConfig.reels];
    const updatedSymbols = [...updatedReels[reelIndex].symbols];
    updatedSymbols[positionIndex] = draggingSymbol.id;
    
    updatedReels[reelIndex] = {
      ...updatedReels[reelIndex],
      symbols: updatedSymbols
    };
    
    setReelConfig({
      ...reelConfig,
      reels: updatedReels
    });
    
    setDraggingSymbol(null);
  };

  // Update symbol percentages (for percentage-based selection)
  const updateSymbolPercentage = (reelIndex, symbolId, percentage) => {
    if (reelConfig.selectionMethod !== 'percentage') return;
    
    const updatedReels = [...reelConfig.reels];
    const currentSymbols = updatedReels[reelIndex].symbols || [];
    
    // Find if symbol already exists in the reel
    const symbolIndex = currentSymbols.findIndex(s => s.id === symbolId);
    
    if (symbolIndex >= 0) {
      // Update existing symbol
      const updatedSymbols = [...currentSymbols];
      updatedSymbols[symbolIndex] = {
        ...updatedSymbols[symbolIndex],
        percentage
      };
      updatedReels[reelIndex].symbols = updatedSymbols;
    } else {
      // Add new symbol
      updatedReels[reelIndex].symbols = [
        ...currentSymbols,
        { id: symbolId, percentage }
      ];
    }
    
    setReelConfig({
      ...reelConfig,
      reels: updatedReels
    });
  };

  // Save the current configuration
  const saveConfiguration = () => {
    if (onSave) {
      onSave(reelConfig);
      setSnackbar({
        open: true,
        message: 'Reel configuration saved successfully',
        severity: 'success'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
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
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
        >
          <Tab label="Edit Reels" id="tab-0" aria-controls="tabpanel-0" />
          <Tab label="Visualization" id="tab-1" aria-controls="tabpanel-1" />
        </Tabs>
        
        <TabPanel value={activeTab} index={0}>
          <Grid2 container spacing={2}>
            <Grid2 item xs={12}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Reel Setup</Typography>
                <Grid2 container spacing={2} alignItems="center">
                  <Grid2 item xs={12} md={8}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography sx={{ mr: 1 }}>Selection Method:</Typography>
                      <Tooltip title="Choose how symbols are placed on reels: by percentages or fixed positions">
                        <HelpIcon fontSize="small" />
                      </Tooltip>
                    </Box>
                    <FormControl fullWidth>
                      <Select
                        value={reelConfig.selectionMethod}
                        onChange={handleMethodChange}
                        displayEmpty
                      >
                        <MenuItem value="percentage">Percentage Based</MenuItem>
                        <MenuItem value="fixed">Fixed Positions</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid2>
                  <Grid2 item xs={12} md={4}>
                    <Typography sx={{ mb: 1 }}>Total Reels: {reelConfig.reels.length}</Typography>
                    <ButtonGroup variant="contained">
                      <Button
                        startIcon={<PlusIcon />}
                        onClick={addReel}
                        disabled={reelConfig.reels.length >= 10}
                      >
                        Add Reel
                      </Button>
                      <Button
                        startIcon={<MinusIcon />}
                        onClick={removeReel}
                        disabled={reelConfig.reels.length <= 1}
                      >
                        Remove Reel
                      </Button>
                    </ButtonGroup>
                  </Grid2>
                </Grid2>
              </Paper>
            </Grid2>

            <Grid2 item xs={12} md={6} lg={4}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Symbol Library</Typography>
                <Box className="symbol-library" sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {SAMPLE_SYMBOLS.map(symbol => (
                    <Box
                      key={symbol.id}
                      className="symbol-item"
                      sx={{
                        backgroundColor: symbol.color,
                        color: '#fff',
                        p: 1,
                        borderRadius: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                        width: 80,
                        height: 60,
                        cursor: 'grab'
                      }}
                      draggable={reelConfig.selectionMethod === 'fixed'}
                      onDragStart={() => handleDragStart(symbol)}
                    >
                      {symbol.name}
                      {symbol.special && (
                        <Typography 
                          component="span" 
                          sx={{ 
                            position: 'absolute', 
                            top: 2, 
                            right: 5,
                            fontSize: '1.2rem'
                          }}
                        >
                          ★
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid2>

            <Grid2 item xs={12} md={6} lg={8}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Reel Layout</Typography>
                <Box 
                  className="reel-container" 
                  sx={{ 
                    display: 'flex', 
                    overflow: 'auto',
                    gap: 2
                  }}
                >
                  {reelConfig.reels.map((reel, reelIndex) => (
                    <Box 
                      key={reel.id} 
                      className="reel-column"
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 120,
                        border: '1px solid #e0e0e0',
                        borderRadius: 1
                      }}
                    >
                      <Box 
                        className="reel-header"
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: 1,
                          borderBottom: '1px solid #e0e0e0',
                          bgcolor: '#f5f5f5'
                        }}
                      >
                        <Typography>Reel {reel.id}</Typography>
                        <TextField
                          type="number"
                          inputProps={{ min: 1, max: 10 }}
                          value={reel.height}
                          onChange={(e) => updateReelHeight(reelIndex, parseInt(e.target.value))}
                          size="small"
                          sx={{ width: 70 }}
                        />
                      </Box>
                      
                      {reelConfig.selectionMethod === 'fixed' ? (
                        // Fixed position mode
                        <Box 
                          className="reel-positions"
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            p: 1,
                            gap: 1
                          }}
                        >
                          {Array(reel.height).fill(null).map((_, posIndex) => {
                            const symbolId = reel.symbols[posIndex];
                            const symbol = SAMPLE_SYMBOLS.find(s => s.id === symbolId);
                            
                            return (
                              <Box 
                                key={posIndex}
                                className="reel-position"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={() => handleDropOnPosition(reelIndex, posIndex)}
                                sx={{
                                  height: 60,
                                  border: '1px dashed #ccc',
                                  borderRadius: 1,
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center'
                                }}
                              >
                                {symbol ? (
                                  <Box 
                                    className="symbol-item"
                                    sx={{
                                      width: '100%',
                                      height: '100%',
                                      backgroundColor: symbol.color,
                                      color: '#fff',
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      position: 'relative',
                                      borderRadius: 1
                                    }}
                                  >
                                    {symbol.name}
                                    {symbol.special && (
                                      <Typography 
                                        component="span" 
                                        sx={{ 
                                          position: 'absolute', 
                                          top: 2, 
                                          right: 5,
                                          fontSize: '1.2rem'
                                        }}
                                      >
                                        ★
                                      </Typography>
                                    )}
                                  </Box>
                                ) : (
                                  <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                    sx={{ fontSize: '0.8rem' }}
                                  >
                                    Drag symbol here
                                  </Typography>
                                )}
                              </Box>
                            );
                          })}
                        </Box>
                      ) : (
                        // Percentage-based mode
                        <Box 
                          className="percentage-config"
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            p: 1,
                            gap: 1,
                            maxHeight: 400,
                            overflow: 'auto'
                          }}
                        >
                          {SAMPLE_SYMBOLS.map(symbol => {
                            const symbolConfig = reel.symbols.find(s => s.id === symbol.id);
                            const percentage = symbolConfig ? symbolConfig.percentage : 0;
                            
                            return (
                              <Box 
                                key={symbol.id} 
                                className="symbol-percentage"
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1
                                }}
                              >
                                <Box 
                                  className="symbol-mini"
                                  sx={{
                                    width: 30,
                                    height: 30,
                                    backgroundColor: symbol.color,
                                    color: '#fff',
                                    borderRadius: 1,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontSize: '0.8rem'
                                  }}
                                >
                                  {symbol.name.substring(0, 1)}
                                </Box>
                                <TextField
                                  type="number"
                                  inputProps={{ min: 0, max: 100 }}
                                  value={percentage}
                                  onChange={(e) => updateSymbolPercentage(reelIndex, symbol.id, parseInt(e.target.value))}
                                  size="small"
                                  InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                  }}
                                  sx={{ width: 100 }}
                                />
                              </Box>
                            );
                          })}
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid2>
          </Grid2>
        </TabPanel>
        
        <TabPanel value={activeTab} index={1}>
          <Box 
            className="reel-visualization"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Paper 
              elevation={3}
              className="visible-window"
              sx={{
                display: 'flex',
                gap: 2,
                p: 3,
                minWidth: 400
              }}
            >
              {reelConfig.reels.map((reel, reelIndex) => (
                <Box 
                  key={reel.id} 
                  className="vis-reel"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                  }}
                >
                  {Array(reel.height).fill(null).map((_, posIndex) => {
                    let displaySymbol;
                    
                    if (reelConfig.selectionMethod === 'fixed') {
                      const symbolId = reel.symbols[posIndex];
                      displaySymbol = SAMPLE_SYMBOLS.find(s => s.id === symbolId);
                    } else {
                      // For percentage mode, just show a randomly selected symbol for visualization
                      const randomIndex = Math.floor(Math.random() * SAMPLE_SYMBOLS.length);
                      displaySymbol = SAMPLE_SYMBOLS[randomIndex];
                    }
                    
                    return (
                      <Box 
                        key={posIndex}
                        className="vis-position"
                        sx={{
                          width: 80,
                          height: 60,
                          backgroundColor: displaySymbol ? displaySymbol.color : '#f0f0f0',
                          color: '#fff',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 1
                        }}
                      >
                        {displaySymbol ? displaySymbol.name : 'Empty'}
                      </Box>
                    );
                  })}
                </Box>
              ))}
            </Paper>
            <Box className="visualization-controls">
              <Button 
                variant="contained" 
                onClick={() => setActiveTab(0)}
              >
                Back to Editor
              </Button>
            </Box>
          </Box>
        </TabPanel>
      </CardContent>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
      />
    </Card>
  );
};

export default ReelMatrix;