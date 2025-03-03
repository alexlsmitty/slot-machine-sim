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
import { useSymbolLibrary } from './SymbolLibraryContext'; // Import your shared symbol library
import './ReelMatrix.css';

// Remove this hardcoded constant
// const SAMPLE_SYMBOLS = [ ... ];

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
  // Use the shared symbol library from context
  const { symbols } = useSymbolLibrary();

  const [reelConfig, setReelConfig] = useState({
    selectionMethod: 'percentage',
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
  
  useEffect(() => {
    if (!initialConfig && window.api && window.api.getReelConfig) {
      window.api.getReelConfig().then(config => {
        if (config) setReelConfig(config);
      });
    }
  }, [initialConfig]);

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

  const updateReelHeight = (reelIndex, newHeight) => {
    const updatedReels = [...reelConfig.reels];
    newHeight = Math.max(1, newHeight);
    updatedReels[reelIndex] = {
      ...updatedReels[reelIndex],
      height: newHeight
    };
    
    if (reelConfig.selectionMethod === 'fixed') {
      const currentSymbols = updatedReels[reelIndex].symbols || [];
      if (newHeight > currentSymbols.length) {
        const additionalSlots = Array(newHeight - currentSymbols.length).fill(null);
        updatedReels[reelIndex].symbols = [...currentSymbols, ...additionalSlots];
      } else {
        updatedReels[reelIndex].symbols = currentSymbols.slice(0, newHeight);
      }
    }
    
    setReelConfig({
      ...reelConfig,
      reels: updatedReels
    });
  };

  const handleMethodChange = (event) => {
    const method = event.target.value;
    const updatedReels = reelConfig.reels.map(reel => ({
      ...reel,
      symbols: method === 'fixed' ? Array(reel.height).fill(null) : []
    }));
    
    setReelConfig({
      ...reelConfig,
      selectionMethod: method,
      reels: updatedReels
    });
  };

  const handleDragStart = (symbol) => {
    setDraggingSymbol(symbol);
  };

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

  const updateSymbolPercentage = (reelIndex, symbolId, percentage) => {
    if (reelConfig.selectionMethod !== 'percentage') return;
    
    const updatedReels = [...reelConfig.reels];
    const currentSymbols = updatedReels[reelIndex].symbols || [];
    const symbolIndex = currentSymbols.findIndex(s => s.id === symbolId);
    
    if (symbolIndex >= 0) {
      const updatedSymbols = [...currentSymbols];
      updatedSymbols[symbolIndex] = {
        ...updatedSymbols[symbolIndex],
        percentage
      };
      updatedReels[reelIndex].symbols = updatedSymbols;
    } else {
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

  const saveConfiguration = () => {
    if (onSave) {
      onSave(reelConfig);
    }
    if (window.api && window.api.saveReelConfig) {
      window.api.saveReelConfig(reelConfig);
    }
    setSnackbar({
      open: true,
      message: 'Reel configuration saved successfully',
      severity: 'success'
    });
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
                  {symbols.map(symbol => (
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
                            const symbol = symbols.find(s => s.id === symbolId);
                            
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
                          {symbols.map(symbol => {
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
                      displaySymbol = symbols.find(s => s.id === symbolId);
                    } else {
                      const randomIndex = Math.floor(Math.random() * symbols.length);
                      displaySymbol = symbols[randomIndex];
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
              <Button variant="contained" onClick={() => setActiveTab(0)}>
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
