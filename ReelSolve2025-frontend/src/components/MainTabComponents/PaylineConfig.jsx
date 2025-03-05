import React, { useState, useEffect } from 'react';
import { 
  Box, Button, TextField, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Typography, 
  Grid2, Dialog, DialogActions, DialogContent, DialogTitle,
  ToggleButton, ToggleButtonGroup, Tooltip, FormControlLabel,
  Switch, Divider, Card, CardContent, Alert
} from '@mui/material';
import { Delete, Edit, Add, ArrowForward, Info as InfoIcon } from '@mui/icons-material';
import SectionHeader from '../sectionHeader';
import { useSymbolLibrary } from './SymbolLibraryContext';

const initialPaylines = [
  { id: 1, name: "Horizontal Center", pattern: [1, 1, 1, 1, 1], active: true, multiplier: 1 },
  { id: 2, name: "Top Horizontal", pattern: [0, 0, 0, 0, 0], active: true, multiplier: 1 },
  { id: 3, name: "Bottom Horizontal", pattern: [2, 2, 2, 2, 2], active: true, multiplier: 1 },
  { id: 4, name: "V Shape", pattern: [0, 1, 2, 1, 0], active: true, multiplier: 1 },
  { id: 5, name: "Inverted V", pattern: [2, 1, 0, 1, 2], active: true, multiplier: 1 }
];

const PaylineConfiguration = () => {
  const { symbols, setSymbols } = useSymbolLibrary();
  const [paylines, setPaylines] = useState(initialPaylines);
  const [currentPayline, setCurrentPayline] = useState(null);
  const [open, setOpen] = useState(false);
  const [reelCount, setReelCount] = useState(5);
  const [rowCount, setRowCount] = useState(3);
  const [evaluationType, setEvaluationType] = useState('leftToRight');
  const [paylineType, setPaylineType] = useState('standard');
  const [symbolsUpdated, setSymbolsUpdated] = useState(false);
  const [minClusterSize, setMinClusterSize] = useState(6);
  const [maxClusterSize, setMaxClusterSize] = useState(10); // Add max cluster size

  // On mount, try to load saved payline configuration via IPC
  useEffect(() => {
    if (window.api && window.api.getPaylineConfig) {
      window.api.getPaylineConfig().then(savedConfig => {
        if (savedConfig) {
          if (savedConfig.paylines && savedConfig.paylines.length > 0) {
            setPaylines(savedConfig.paylines);
          }
          if (savedConfig.paylineType) {
            setPaylineType(savedConfig.paylineType);
          }
          if (savedConfig.evaluationType) {
            setEvaluationType(savedConfig.evaluationType);
          }
          if (savedConfig.reelCount) {
            setReelCount(savedConfig.reelCount);
          }
          if (savedConfig.rowCount) {
            setRowCount(savedConfig.rowCount);
          }
          if (savedConfig.minClusterSize) {
            setMinClusterSize(savedConfig.minClusterSize);
          }
          if (savedConfig.maxClusterSize) {
            setMaxClusterSize(savedConfig.maxClusterSize);
          }
        }
      });
    }
  }, []);

  // Save all payline configuration
  const saveConfiguration = (customConfig = null) => {
    const config = customConfig || {
      paylines,
      paylineType,
      evaluationType,
      reelCount,
      rowCount,
      minClusterSize,
      maxClusterSize
    };
    
    if (window.api && window.api.savePaylineConfig) {
      window.api.savePaylineConfig(config);
    }
  };

  const handleOpen = (payline = null) => {
    if (payline) {
      setCurrentPayline({...payline});
    } else {
      setCurrentPayline({
        id: paylines.length ? Math.max(...paylines.map(p => p.id)) + 1 : 1,
        name: `Payline ${paylines.length + 1}`,
        pattern: Array(reelCount).fill(0),
        active: true,
        multiplier: 1
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    let updatedPaylines;
    if (paylines.find(p => p.id === currentPayline.id)) {
      updatedPaylines = paylines.map(p => p.id === currentPayline.id ? currentPayline : p);
    } else {
      updatedPaylines = [...paylines, currentPayline];
    }
    setPaylines(updatedPaylines);
    saveConfiguration({
      paylines: updatedPaylines,
      paylineType,
      evaluationType,
      reelCount,
      rowCount,
      minClusterSize,
      maxClusterSize
    });
    handleClose();
  };

  const handleDelete = (id) => {
    const updated = paylines.filter(p => p.id !== id);
    setPaylines(updated);
    saveConfiguration({
      paylines: updated,
      paylineType,
      evaluationType,
      reelCount,
      rowCount,
      minClusterSize,
      maxClusterSize
    });
  };

  const handlePatternChange = (reelIndex, rowIndex) => {
    const newPattern = [...currentPayline.pattern];
    newPattern[reelIndex] = rowIndex;
    setCurrentPayline({ ...currentPayline, pattern: newPattern });
  };

  const handleToggleActive = (id) => {
    const updated = paylines.map(p => p.id === id ? { ...p, active: !p.active } : p);
    setPaylines(updated);
    saveConfiguration({
      paylines: updated,
      paylineType,
      evaluationType,
      reelCount,
      rowCount,
      minClusterSize,
      maxClusterSize
    });
  };

  const handlePaylineTypeChange = (event, newValue) => {
    if (!newValue) return;
    
    setPaylineType(newValue);
    
    if (newValue === 'clusters') {
      // Calculate minimum cluster size based on reels and rows
      // For most slot layouts, 6 is a good minimum (2x3 grid)
      const minSize = Math.min(6, Math.floor((reelCount * rowCount) / 2));
      setMinClusterSize(minSize);
      const maxSize = minSize + 4; // Default max is min + 4
      setMaxClusterSize(maxSize);
      
      // Update symbols to use cluster-style payouts
      if (symbols && symbols.length > 0 && !symbolsUpdated) {
        const updatedSymbols = symbols.map(symbol => {
          const newSymbol = { ...symbol };
          // Create cluster-based payout structure
          if (newSymbol.payouts) {
            const oldPayouts = { ...newSymbol.payouts };
            const newPayouts = {};
            
            // Generate payouts for cluster sizes from minSize to maxSize
            for (let clusterSize = minSize; clusterSize <= maxSize; clusterSize++) {
              // Base new payouts on existing payouts, scaling up for larger clusters
              const i = clusterSize - minSize; // index within the range
              if (i < 3 && oldPayouts[i+3]) {
                newPayouts[clusterSize] = oldPayouts[i+3] * (1 + 0.5 * i);
              } else {
                // For larger clusters, scale from the 5 of a kind payout if available
                newPayouts[clusterSize] = oldPayouts[5] 
                  ? oldPayouts[5] * (1 + 0.5 * i) 
                  : clusterSize * 10; // Default value
              }
            }
            
            newSymbol.payouts = newPayouts;
          }
          return newSymbol;
        });
        
        setSymbols(updatedSymbols);
        setSymbolsUpdated(true);
        
        // Save updated symbols to persistence
        if (window.api && window.api.saveSymbolConfig) {
          window.api.saveSymbolConfig(updatedSymbols);
        }
      }
    }
    
    // Save configuration
    saveConfiguration({
      paylines,
      paylineType: newValue,
      evaluationType,
      reelCount,
      rowCount,
      minClusterSize,
      maxClusterSize
    });
  };
  
  // Handle cluster size change and update symbols accordingly
  const handleClusterSizeChange = (isMin, value) => {
    // Ensure min/max relationship is maintained
    let newMin = isMin ? value : minClusterSize;
    let newMax = isMin ? maxClusterSize : value;
    
    // Enforce constraints
    newMin = Math.max(3, parseInt(newMin));
    newMax = Math.max(newMin + 1, parseInt(newMax));
    
    if (isMin) {
      setMinClusterSize(newMin);
    } else {
      setMaxClusterSize(newMax);
    }
    
    // Update symbol payouts if we're in cluster mode
    if (paylineType === 'clusters' && symbols && symbols.length > 0) {
      const updatedSymbols = symbols.map(symbol => {
        const newSymbol = { ...symbol };
        if (newSymbol.payouts) {
          const oldPayouts = { ...newSymbol.payouts };
          const newPayouts = {};
          
          // Recalculate payouts for the new range
          for (let clusterSize = newMin; clusterSize <= newMax; clusterSize++) {
            // Try to preserve existing values if available
            if (oldPayouts[clusterSize]) {
              newPayouts[clusterSize] = oldPayouts[clusterSize];
            } else {
              // Otherwise calculate a reasonable value
              const basePayout = oldPayouts[Object.keys(oldPayouts).sort((a,b) => a-b)[0]] || 10;
              const multiplier = (clusterSize - newMin + 1) * 0.5;
              newPayouts[clusterSize] = basePayout * (1 + multiplier);
            }
          }
          
          newSymbol.payouts = newPayouts;
        }
        return newSymbol;
      });
      
      setSymbols(updatedSymbols);
      
      // Save updated symbols to persistence
      if (window.api && window.api.saveSymbolConfig) {
        window.api.saveSymbolConfig(updatedSymbols);
      }
    }
    
    // Save updated configuration
    saveConfiguration({
      paylines,
      paylineType,
      evaluationType,
      reelCount,
      rowCount,
      minClusterSize: newMin,
      maxClusterSize: newMax
    });
  };

  // Generate all possible ways for the current reel/row configuration
  const generateAllWays = () => {
    const newPaylines = [];
    
    // For "ways" we typically use one payline per row
    for (let i = 0; i < rowCount; i++) {
      newPaylines.push({
        id: i + 1,
        name: `Row ${i + 1}`,
        pattern: Array(reelCount).fill(i),
        active: true,
        multiplier: 1
      });
    }
    
    setPaylines(newPaylines);
    saveConfiguration({
      paylines: newPaylines,
      paylineType,
      evaluationType,
      reelCount,
      rowCount,
      minClusterSize,
      maxClusterSize
    });
  };

  // Generate standard paylines for classic slots
  const generateStandardPaylines = () => {
    // Generate basic horizontal, diagonal, and zigzag patterns
    const newPaylines = [
      // Horizontal lines
      ...Array.from({ length: rowCount }).map((_, i) => ({
        id: i + 1,
        name: `Horizontal ${i + 1}`,
        pattern: Array(reelCount).fill(i),
        active: true,
        multiplier: 1
      })),
      
      // V-shape (if we have at least 3 rows)
      ...(rowCount >= 3 ? [{
        id: rowCount + 1,
        name: "V Shape",
        pattern: Array.from({ length: reelCount }).map((_, i) => {
          const middle = Math.floor(reelCount / 2);
          return i <= middle ? i : (reelCount - 1) - i;
        }),
        active: true,
        multiplier: 1
      }] : []),
      
      // Inverted V-shape (if we have at least 3 rows)
      ...(rowCount >= 3 ? [{
        id: rowCount + 2,
        name: "Inverted V",
        pattern: Array.from({ length: reelCount }).map((_, i) => {
          const middle = Math.floor(reelCount / 2);
          return i <= middle ? (rowCount - 1) - i : i - middle;
        }),
        active: true,
        multiplier: 1
      }] : [])
    ];
    
    setPaylines(newPaylines);
    saveConfiguration({
      paylines: newPaylines,
      paylineType,
      evaluationType,
      reelCount,
      rowCount,
      minClusterSize,
      maxClusterSize
    });
  };

  // Get the list of cluster sizes as an array from min to max
  const getClusterSizes = () => {
    const sizes = [];
    for (let i = minClusterSize; i <= maxClusterSize; i++) {
      sizes.push(i);
    }
    return sizes;
  };

  const renderPaylinePattern = (pattern) => (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {pattern.map((position, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ArrowForward sx={{ mx: 1, color: 'grey.500' }} fontSize="small" />}
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}
          >
            {position + 1}
          </Box>
        </React.Fragment>
      ))}
    </Box>
  );

  const renderPaylineEditor = () => {
    if (!currentPayline) return null;

    return (
      <Box sx={{ my: 3 }}>
        <Typography variant="h6" gutterBottom>Visual Payline Editor</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
            <Grid2 container spacing={1}>
              {Array.from({ length: reelCount }).map((_, reelIndex) => (
                <Grid2 item key={reelIndex}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="subtitle2" align="center" gutterBottom>
                      Reel {reelIndex + 1}
                    </Typography>
                    <Paper sx={{ bgcolor: 'white' }}>
                      {Array.from({ length: rowCount }).map((_, rowIndex) => (
                        <Box 
                          key={rowIndex}
                          onClick={() => handlePatternChange(reelIndex, rowIndex)}
                          sx={{
                            width: 40,
                            height: 40,
                            border: '1px solid #e0e0e0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            bgcolor: currentPayline.pattern[reelIndex] === rowIndex ? 'primary.main' : 'white',
                            color: currentPayline.pattern[reelIndex] === rowIndex ? 'white' : 'inherit',
                            '&:hover': {
                              bgcolor: currentPayline.pattern[reelIndex] === rowIndex ? 'primary.dark' : 'grey.200',
                            }
                          }}
                        >
                          {rowIndex + 1}
                        </Box>
                      ))}
                    </Paper>
                  </Box>
                </Grid2>
              ))}
            </Grid2>
          </Paper>
        </Box>
        
        <Grid2 container spacing={3}>
          <Grid2 item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Payline Name"
              value={currentPayline.name}
              onChange={(e) => setCurrentPayline({ ...currentPayline, name: e.target.value })}
              margin="normal"
            />
          </Grid2>
          <Grid2 item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Multiplier"
              type="number"
              slotProps={{ input: { min: 1, step: 0.1 } }}
              value={currentPayline.multiplier}
              onChange={(e) => setCurrentPayline({ ...currentPayline, multiplier: parseFloat(e.target.value) })}
              margin="normal"
            />
          </Grid2>
        </Grid2>
      </Box>
    );
  };

  const renderPaylineTable = () => {
    if (paylineType === 'clusters') {
      return (
        <Alert 
          severity="info" 
          sx={{ mb: 3 }}
          icon={<InfoIcon />}
        >
          Cluster pays mode doesn't use traditional paylines. Wins are evaluated based on connecting groups of identical symbols.
        </Alert>
      );
    }
    
    if (paylineType === 'ways') {
      return (
        <Box sx={{ mb: 3 }}>
          <Alert 
            severity="info" 
            sx={{ mb: 2 }}
            icon={<InfoIcon />}
          >
            Ways pays mode evaluates matching symbols on adjacent reels regardless of position. Each position connects to all positions on the adjacent reels.
          </Alert>
          <Button 
            variant="outlined" 
            onClick={generateAllWays}
            sx={{ mr: 2 }}
          >
            Generate Default Ways
          </Button>
        </Box>
      );
    }
    
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Pattern</TableCell>
              <TableCell>Multiplier</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paylines.map((payline) => (
              <TableRow key={payline.id} sx={{ opacity: payline.active ? 1 : 0.5 }}>
                <TableCell>{payline.id}</TableCell>
                <TableCell>{payline.name}</TableCell>
                <TableCell>{renderPaylinePattern(payline.pattern)}</TableCell>
                <TableCell>{payline.multiplier}x</TableCell>
                <TableCell>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={payline.active}
                        onChange={() => handleToggleActive(payline.id)}
                        color="primary"
                      />
                    }
                    label={payline.active ? "Active" : "Inactive"}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(payline)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(payline.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // Get the cluster sizes for display in the UI
  const clusterSizes = getClusterSizes();

  return (
    <Box sx={{ p: 3 }}>
      <SectionHeader 
        title="Payline Configuration"
        action={
          paylineType === 'standard' && (
            <Button 
              variant="contained" 
              startIcon={<Add />} 
              onClick={() => handleOpen()}
            >
              Add New Payline
            </Button>
          )
        }
      />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>Game Type & Evaluation Rules</Typography>
        <Paper sx={{ p: 2 }}>
          <Grid2 container spacing={3}>
            <Grid2 item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Payline Type:</Typography>
              <ToggleButtonGroup
                color="primary"
                value={paylineType}
                exclusive
                onChange={handlePaylineTypeChange}
                aria-label="Payline Type"
                sx={{ mb: 2 }}
              >
                <ToggleButton value="standard">
                  <Tooltip title="Traditional paylines with specific patterns">
                    <Box>Standard Paylines</Box>
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="ways">
                  <Tooltip title="Any symbols in adjacent reels create wins (243-ways, 1024-ways, etc.)">
                    <Box>Ways</Box>
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="clusters">
                  <Tooltip title="Groups of adjacent matching symbols form wins">
                    <Box>Clusters</Box>
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>

              {paylineType === 'standard' && (
                <Button 
                  variant="outlined"
                  onClick={generateStandardPaylines}
                  sx={{ ml: 2 }}
                >
                  Generate Standard Paylines
                </Button>
              )}

              <Divider sx={{ my: 2 }} />
            </Grid2>

            <Grid2 item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Number of Reels"
                type="number"
                slotProps={{ input: { min: 3, max: 9 } }}
                value={reelCount}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value);
                  setReelCount(newValue);
                  saveConfiguration({
                    paylines,
                    paylineType,
                    evaluationType,
                    reelCount: newValue,
                    rowCount,
                    minClusterSize,
                    maxClusterSize
                  });
                }}
              />
            </Grid2>
            <Grid2 item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Number of Rows"
                type="number"
                slotProps={{ input: { min: 2, max: 6 } }}
                value={rowCount}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value);
                  setRowCount(newValue);
                  saveConfiguration({
                    paylines,
                    paylineType,
                    evaluationType,
                    reelCount,
                    rowCount: newValue,
                    minClusterSize,
                    maxClusterSize
                  });
                }}
              />
            </Grid2>
            <Grid2 item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <ToggleButtonGroup
                    color="primary"
                    value={evaluationType}
                    exclusive
                    onChange={(_, val) => {
                      if (val) {
                        setEvaluationType(val);
                        saveConfiguration({
                          paylines,
                          paylineType,
                          evaluationType: val,
                          reelCount,
                          rowCount,
                          minClusterSize,
                          maxClusterSize
                        });
                      }
                    }}
                    size="small"
                    sx={{ ml: 2 }}
                  >
                    <ToggleButton value="leftToRight">Left → Right</ToggleButton>
                    <ToggleButton value="anyDirection">Any Direction</ToggleButton>
                  </ToggleButtonGroup>
                }
                label="Evaluation Direction:"
                labelPlacement="start"
              />
            </Grid2>
          </Grid2>
        </Paper>
      </Box>

      {paylineType === 'clusters' && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Cluster Pays Information</Typography>
            <Typography variant="body2" component="p">
              In Cluster Pays mode, winning combinations are formed when identical symbols appear in connected groups. 
              Symbols are connected if they are horizontally or vertically adjacent to each other.
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Cluster Size Configuration</Typography>
              <Grid2 container spacing={2} alignItems="center">
                <Grid2 item xs={12} sm={6}>
                  <TextField
                    label="Minimum Cluster Size"
                    type="number"
                    value={minClusterSize}
                    onChange={(e) => handleClusterSizeChange(true, parseInt(e.target.value))}
                    slotProps={{ input: { min: 3, max: maxClusterSize - 1 } }}
                    fullWidth
                    helperText="Minimum number of symbols needed for a cluster win"
                  />
                </Grid2>
                <Grid2 item xs={12} sm={6}>
                  <TextField
                    label="Maximum Cluster Size"
                    type="number"
                    value={maxClusterSize}
                    onChange={(e) => handleClusterSizeChange(false, parseInt(e.target.value))}
                    slotProps={{ input: { min: minClusterSize + 1, max: 30 } }}
                    fullWidth
                    helperText="Maximum cluster size for highest payout"
                  />
                </Grid2>
              </Grid2>
            </Box>
            
            <Typography variant="body2" component="p">
              Symbol payouts will be configured for the following cluster sizes: {clusterSizes.join(', ')} symbols.
            </Typography>
            
            <Typography variant="subtitle2" color="primary">
              Note: Symbol payouts have been automatically adjusted to reflect cluster values.
            </Typography>
          </CardContent>
        </Card>
      )}

      {paylineType === 'ways' && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Ways Pays Information</Typography>
            <Typography variant="body2" component="p">
              In Ways Pays mode, winning combinations are formed when matching symbols appear on adjacent reels, 
              starting from the leftmost reel. Any position on a reel connects to any position on an adjacent reel.
            </Typography>
            <Typography variant="body2">
              The total number of ways to win is: {rowCount}<sup>{reelCount}</sup> = {Math.pow(rowCount, reelCount)} ways
            </Typography>
          </CardContent>
        </Card>
      )}

      {renderPaylineTable()}

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentPayline && currentPayline.id && paylines.find(p => p.id === currentPayline.id) 
            ? `Edit Payline: ${currentPayline.name}` 
            : 'Create New Payline'}
        </DialogTitle>
        <DialogContent>
          {renderPaylineEditor()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save Payline
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaylineConfiguration;
