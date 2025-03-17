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
import { useSymbolLibrary } from '@contexts/GameContexts'; // Fix path and file name

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
      // Reel 1
      { 
        id: 1, 
        height: 3, 
        visibleHeight: 3, 
        symbols: [
          { id: 1, percentage: 5 },   // Diamond (rare)
          { id: 2, percentage: 8 },   // Seven
          { id: 3, percentage: 10 },  // Triple Bar
          { id: 4, percentage: 12 },  // Bell
          { id: 5, percentage: 14 },  // Watermelon
          { id: 6, percentage: 15 },  // Grapes
          { id: 7, percentage: 16 },  // Orange
          { id: 8, percentage: 18 },  // Cherry
          { id: 9, percentage: 18 },  // Lemon
          { id: 10, percentage: 2 },  // Wild (very rare)
          { id: 11, percentage: 2 }   // Scatter (very rare)
        ]
      },
      // Reel 2
      { 
        id: 2, 
        height: 3, 
        visibleHeight: 3,
        symbols: [
          { id: 1, percentage: 4 },   // Diamond (rarer on middle reels)
          { id: 2, percentage: 6 },   // Seven
          { id: 3, percentage: 10 },  // Triple Bar
          { id: 4, percentage: 13 },  // Bell
          { id: 5, percentage: 15 },  // Watermelon
          { id: 6, percentage: 16 },  // Grapes
          { id: 7, percentage: 17 },  // Orange
          { id: 8, percentage: 19 },  // Cherry
          { id: 9, percentage: 19 },  // Lemon
          { id: 10, percentage: 1 },  // Wild (very rare)
          { id: 11, percentage: 2 }   // Scatter
        ]
      },
      // Reel 3
      { 
        id: 3, 
        height: 3, 
        visibleHeight: 3,
        symbols: [
          { id: 1, percentage: 4 },   // Diamond
          { id: 2, percentage: 5 },   // Seven
          { id: 3, percentage: 8 },   // Triple Bar
          { id: 4, percentage: 10 },  // Bell
          { id: 5, percentage: 15 },  // Watermelon
          { id: 6, percentage: 16 },  // Grapes
          { id: 7, percentage: 17 },  // Orange
          { id: 8, percentage: 19 },  // Cherry
          { id: 9, percentage: 20 },  // Lemon
          { id: 10, percentage: 1 },  // Wild
          { id: 11, percentage: 3 }   // Scatter (more common on middle reel)
        ]
      },
      // Reel 4
      { 
        id: 4, 
        height: 3, 
        visibleHeight: 3,
        symbols: [
          { id: 1, percentage: 3 },   // Diamond
          { id: 2, percentage: 5 },   // Seven
          { id: 3, percentage: 8 },   // Triple Bar
          { id: 4, percentage: 10 },  // Bell
          { id: 5, percentage: 15 },  // Watermelon
          { id: 6, percentage: 16 },  // Grapes
          { id: 7, percentage: 18 },  // Orange
          { id: 8, percentage: 19 },  // Cherry
          { id: 9, percentage: 20 },  // Lemon
          { id: 10, percentage: 1 },  // Wild
          { id: 11, percentage: 2 }   // Scatter
        ] 
      },
      // Reel 5
      { 
        id: 5, 
        height: 3, 
        visibleHeight: 3,
        symbols: [
          { id: 1, percentage: 2 },   // Diamond (even rarer on last reel)
          { id: 2, percentage: 3 },   // Seven
          { id: 3, percentage: 6 },   // Triple Bar
          { id: 4, percentage: 8 },   // Bell
          { id: 5, percentage: 14 },  // Watermelon
          { id: 6, percentage: 15 },  // Grapes
          { id: 7, percentage: 17 },  // Orange
          { id: 8, percentage: 21 },  // Cherry
          { id: 9, percentage: 22 },  // Lemon
          { id: 10, percentage: 1 },  // Wild
          { id: 11, percentage: 2 }   // Scatter
        ]
      }
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
      height: 3, // total height for percentage
      visibleHeight: 3, // visible window height
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

  const switchToFixedConfig = () => {
    const fixedConfig = {
      selectionMethod: 'fixed',
      reels: [
        // Reel 1 - Fixed positions
        {
          id: 1,
          height: 20,
          visibleHeight: 3,
          symbols: [
            8, 5, 7, 9, 6, 4, 8, 7, 9, 3, 
            8, 10, 7, 6, 5, 9, 2, 8, 9, 1
          ]
        },
        // Reel 2
        {
          id: 2,
          height: 20,
          visibleHeight: 3,
          symbols: [
            9, 6, 8, 7, 5, 9, 4, 8, 6, 11, 
            7, 9, 8, 3, 7, 6, 9, 2, 8, 5
          ]
        },
        // Reel 3
        {
          id: 3,
          height: 20,
          visibleHeight: 3,
          symbols: [
            8, 7, 9, 6, 11, 8, 5, 7, 9, 4, 
            8, 6, 9, 3, 7, 10, 8, 5, 9, 2
          ]
        },
        // Reel 4
        {
          id: 4,
          height: 20,
          visibleHeight: 3,
          symbols: [
            9, 8, 7, 6, 9, 5, 8, 7, 6, 9, 
            4, 8, 7, 3, 9, 6, 8, 2, 7, 9
          ]
        },
        // Reel 5
        {
          id: 5,
          height: 20,
          visibleHeight: 3,
          symbols: [
            9, 8, 7, 9, 6, 8, 7, 9, 5, 8, 
            7, 6, 9, 4, 8, 3, 9, 7, 2, 11
          ]
        }
      ]
    };
    
    setReelConfig(fixedConfig);
  };

  const handleMethodChange = (event) => {
    const method = event.target.value;
    
    if (method === 'fixed') {
      switchToFixedConfig();
    } else {
      // Load the default percentage-based configuration
      setReelConfig({
        selectionMethod: 'percentage',
        reels: initialConfig?.reels || [
          // Reel 1
          { 
            id: 1, 
            height: 3, 
            visibleHeight: 3, 
            symbols: [
              { id: 1, percentage: 5 },   // Diamond (rare)
              { id: 2, percentage: 8 },   // Seven
              { id: 3, percentage: 10 },  // Triple Bar
              { id: 4, percentage: 12 },  // Bell
              { id: 5, percentage: 14 },  // Watermelon
              { id: 6, percentage: 15 },  // Grapes
              { id: 7, percentage: 16 },  // Orange
              { id: 8, percentage: 18 },  // Cherry
              { id: 9, percentage: 18 },  // Lemon
              { id: 10, percentage: 2 },  // Wild (very rare)
              { id: 11, percentage: 2 }   // Scatter (very rare)
            ]
          },
          // Reel 2
          { 
            id: 2, 
            height: 3, 
            visibleHeight: 3,
            symbols: [
              { id: 1, percentage: 4 },   // Diamond (rarer on middle reels)
              { id: 2, percentage: 6 },   // Seven
              { id: 3, percentage: 10 },  // Triple Bar
              { id: 4, percentage: 13 },  // Bell
              { id: 5, percentage: 15 },  // Watermelon
              { id: 6, percentage: 16 },  // Grapes
              { id: 7, percentage: 17 },  // Orange
              { id: 8, percentage: 19 },  // Cherry
              { id: 9, percentage: 19 },  // Lemon
              { id: 10, percentage: 1 },  // Wild (very rare)
              { id: 11, percentage: 2 }   // Scatter
            ]
          },
          // Reel 3
          { 
            id: 3, 
            height: 3, 
            visibleHeight: 3,
            symbols: [
              { id: 1, percentage: 4 },   // Diamond
              { id: 2, percentage: 5 },   // Seven
              { id: 3, percentage: 8 },   // Triple Bar
              { id: 4, percentage: 10 },  // Bell
              { id: 5, percentage: 15 },  // Watermelon
              { id: 6, percentage: 16 },  // Grapes
              { id: 7, percentage: 17 },  // Orange
              { id: 8, percentage: 19 },  // Cherry
              { id: 9, percentage: 20 },  // Lemon
              { id: 10, percentage: 1 },  // Wild
              { id: 11, percentage: 3 }   // Scatter (more common on middle reel)
            ]
          },
          // Reel 4
          { 
            id: 4, 
            height: 3, 
            visibleHeight: 3,
            symbols: [
              { id: 1, percentage: 3 },   // Diamond
              { id: 2, percentage: 5 },   // Seven
              { id: 3, percentage: 8 },   // Triple Bar
              { id: 4, percentage: 10 },  // Bell
              { id: 5, percentage: 15 },  // Watermelon
              { id: 6, percentage: 16 },  // Grapes
              { id: 7, percentage: 18 },  // Orange
              { id: 8, percentage: 19 },  // Cherry
              { id: 9, percentage: 20 },  // Lemon
              { id: 10, percentage: 1 },  // Wild
              { id: 11, percentage: 2 }   // Scatter
            ] 
          },
          // Reel 5
          { 
            id: 5, 
            height: 3, 
            visibleHeight: 3,
            symbols: [
              { id: 1, percentage: 2 },   // Diamond (even rarer on last reel)
              { id: 2, percentage: 3 },   // Seven
              { id: 3, percentage: 6 },   // Triple Bar
              { id: 4, percentage: 8 },   // Bell
              { id: 5, percentage: 14 },  // Watermelon
              { id: 6, percentage: 15 },  // Grapes
              { id: 7, percentage: 17 },  // Orange
              { id: 8, percentage: 21 },  // Cherry
              { id: 9, percentage: 22 },  // Lemon
              { id: 10, percentage: 1 },  // Wild
              { id: 11, percentage: 2 }   // Scatter
            ]
          }
        ]
      });
    }
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

  // Add a function to update the visible height
  const updateVisibleHeight = (reelIndex, newHeight) => {
    const updatedReels = [...reelConfig.reels];
    newHeight = Math.max(1, newHeight);
    
    updatedReels[reelIndex] = {
      ...updatedReels[reelIndex],
      visibleHeight: newHeight
    };
    
    setReelConfig({
      ...reelConfig,
      reels: updatedReels
    });
  };

  // Add a function to add a new position to a fixed reel
  const addFixedPosition = (reelIndex) => {
    if (reelConfig.selectionMethod !== 'fixed') return;
    
    const updatedReels = [...reelConfig.reels];
    const currentSymbols = updatedReels[reelIndex].symbols || [];
    
    updatedReels[reelIndex] = {
      ...updatedReels[reelIndex],
      symbols: [...currentSymbols, null],
      height: (updatedReels[reelIndex].height || 0) + 1
    };
    
    setReelConfig({
      ...reelConfig,
      reels: updatedReels
    });
  };

  // Add a function to remove a position
  const removeFixedPosition = (reelIndex, posIndex) => {
    if (reelConfig.selectionMethod !== 'fixed') return;
    
    const updatedReels = [...reelConfig.reels];
    const currentSymbols = [...updatedReels[reelIndex].symbols];
    
    if (currentSymbols.length <= updatedReels[reelIndex].visibleHeight) {
      setSnackbar({
        open: true,
        message: 'Cannot remove more positions than visible height',
        severity: 'error'
      });
      return;
    }
    
    currentSymbols.splice(posIndex, 1);
    
    updatedReels[reelIndex] = {
      ...updatedReels[reelIndex],
      symbols: currentSymbols,
      height: Math.max(updatedReels[reelIndex].visibleHeight, currentSymbols.length)
    };
    
    setReelConfig({
      ...reelConfig,
      reels: updatedReels
    });
  };

  // Add this function to the ReelMatrix component

  const simulateSpin = () => {
    // For visualization purposes only
    const updatedReels = [...reelConfig.reels];
    
    updatedReels.forEach((reel, reelIndex) => {
      if (reelConfig.selectionMethod === 'fixed') {
        // For fixed reels, just rotate the positions randomly
        const offset = Math.floor(Math.random() * reel.symbols.length);
        const rotatedSymbols = [
          ...reel.symbols.slice(offset), 
          ...reel.symbols.slice(0, offset)
        ];
        
        updatedReels[reelIndex] = {
          ...reel,
          visibleSymbols: rotatedSymbols.slice(0, reel.visibleHeight)
        };
      } else {
        // For percentage-based, use weighted random selection
        const visibleSymbols = [];
        for (let i = 0; i < reel.visibleHeight; i++) {
          const totalWeight = reel.symbols.reduce((sum, s) => sum + (s.percentage || 0), 0);
          let randomValue = Math.random() * totalWeight;
          let selectedSymbol = null;
          
          for (const symbol of reel.symbols) {
            randomValue -= (symbol.percentage || 0);
            if (randomValue <= 0) {
              selectedSymbol = symbol.id;
              break;
            }
          }
          
          // If somehow we didn't select anything, pick the first symbol
          visibleSymbols.push(selectedSymbol || (reel.symbols[0]?.id || null));
        }
        
        updatedReels[reelIndex] = {
          ...reel,
          visibleSymbols
        };
      }
    });
    
    // Add a "Spin" button in the visualization tab that calls this function
    // This is just for visual demonstration and doesn't affect the actual configuration
  }

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
                        }}
                      >
                        <Typography>Reel {reel.id}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Tooltip title="Visible window height">
                            <TextField
                              type="number"
                              inputProps={{ min: 1, max: 10 }}
                              value={reel.visibleHeight}
                              onChange={(e) => updateVisibleHeight(reelIndex, parseInt(e.target.value))}
                              size="small"
                              sx={{ width: 70 }}
                              label="View"
                            />
                          </Tooltip>
                        </Box>
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
                          {(reel.symbols || []).map((symbolId, posIndex) => {
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
                                  alignItems: 'center',
                                  position: 'relative',
                                  // Highlight positions within the visible window
                                  backgroundColor: posIndex < reel.visibleHeight ? 'rgba(124, 77, 255, 0.05)' : 'transparent',
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
                                
                                {/* Position indicator and remove button */}
                                <Box 
                                  sx={{ 
                                    position: 'absolute',
                                    top: 2,
                                    left: 2,
                                    fontSize: '0.7rem',
                                    color: 'text.disabled'
                                  }}
                                >
                                  {posIndex + 1}
                                </Box>
                                
                                <IconButton 
                                  sx={{ 
                                    position: 'absolute',
                                    top: -8,
                                    right: -8,
                                    fontSize: '0.7rem',
                                    color: 'error.main',
                                    p: 0.5,
                                    bgcolor: 'background.paper',
                                    '&:hover': {
                                      bgcolor: 'error.light',
                                      color: 'white'
                                    }
                                  }}
                                  onClick={() => removeFixedPosition(reelIndex, posIndex)}
                                >
                                  <MinusIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            );
                          })}
                          
                          {/* Add position button */}
                          <Button 
                            variant="outlined" 
                            size="small"
                            startIcon={<PlusIcon />}
                            onClick={() => addFixedPosition(reelIndex)}
                            sx={{ mt: 1 }}
                          >
                            Add Position
                          </Button>
                          
                          {/* Visual indicator for visible window */}
                          <Box sx={{ 
                            mt: 2, 
                            p: 1, 
                            borderRadius: 1, 
                            bgcolor: 'background.paper',
                            border: '1px dashed',
                            borderColor: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}>
                            <Typography variant="caption">
                              Visible window: {reel.visibleHeight} positions
                            </Typography>
                            <Tooltip title="Positions highlighted in purple will be visible in the game window">
                              <HelpIcon fontSize="small" color="primary" />
                            </Tooltip>
                          </Box>
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
                  {/* Show only visibleHeight positions */}
                  {Array(reel.visibleHeight).fill(null).map((_, posIndex) => {
                    let displaySymbol;
                    
                    if (reelConfig.selectionMethod === 'fixed') {
                      // For fixed, pick from the symbols array, potentially wrapping if needed
                      const symbolId = reel.symbols[posIndex % Math.max(1, reel.symbols.length)];
                      displaySymbol = symbols.find(s => s.id === symbolId);
                    } else {
                      // For percentage, use weighted random selection
                      const totalWeight = reel.symbols.reduce((sum, s) => sum + (s.percentage || 0), 0);
                      let randomValue = Math.random() * totalWeight;
                      
                      for (const symbol of reel.symbols) {
                        randomValue -= (symbol.percentage || 0);
                        if (randomValue <= 0) {
                          displaySymbol = symbols.find(s => s.id === symbol.id);
                          break;
                        }
                      }
                      
                      // Fallback
                      if (!displaySymbol && symbols.length > 0) {
                        displaySymbol = symbols[0];
                      }
                    }
                    
                    return (
                      <Box 
                        key={posIndex}
                        className="vis-position"
                        sx={{
                          width: 80,
                          height: 60,
                          backgroundColor: displaySymbol ? displaySymbol.color : '#1A1A1A',
                          color: '#fff',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 1,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.3) inset'
                        }}
                      >
                        {displaySymbol ? displaySymbol.name : 'Empty'}
                      </Box>
                    );
                  })}
                </Box>
              ))}
            </Paper>
            <Box className="visualization-controls" sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => window.location.reload()} // Simple way to "spin" - just refresh the visualization
              >
                Spin
              </Button>
              <Button variant="outlined" onClick={() => setActiveTab(0)}>
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
