import React, { useState, useEffect } from 'react';
import { 
  Box, Button, TextField, Dialog, DialogActions, DialogContent, 
  DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, IconButton, Typography, Grid2, Tabs, Tab, 
  Slider, FormControl, InputLabel, Select, MenuItem, Alert
} from '@mui/material';
import { Delete, Edit, Add, ColorLens } from '@mui/icons-material';
import { useSymbolLibrary } from '@contexts/GameContexts';
import SectionHeader from '@Navigation/sectionHeader';

const SymbolManager = () => {
  const { symbols, setSymbols } = useSymbolLibrary();
  const [currentSymbol, setCurrentSymbol] = useState(null);
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [paylineType, setPaylineType] = useState('standard');
  const [reelCount, setReelCount] = useState(5);
  const [clusterSizes, setClusterSizes] = useState([6, 7, 8, 9, 10]);
  const [minClusterSize, setMinClusterSize] = useState(6);

  useEffect(() => {
    // Load both payline config AND reel config to get proper context
    if (window.api) {
      if (window.api.getPaylineConfig) {
        window.api.getPaylineConfig().then(config => {
          if (config) {
            if (config.paylineType) {
              setPaylineType(config.paylineType);
            }
            if (config.reelCount) {
              setReelCount(config.reelCount);
            }
            if (config.minClusterSize) {
              setMinClusterSize(config.minClusterSize);
              
              // Generate cluster sizes dynamically
              if (config.maxClusterSize) {
                const sizes = [];
                for (let i = config.minClusterSize; i <= config.maxClusterSize; i++) {
                  sizes.push(i);
                }
                setClusterSizes(sizes);
              } else {
                // Fallback to default range
                const sizes = [];
                for (let i = 0; i < 5; i++) {
                  sizes.push(config.minClusterSize + i);
                }
                setClusterSizes(sizes);
              }
            }
          }
        });
      }
      
      if (window.api.getReelConfig) {
        window.api.getReelConfig().then(config => {
          if (config && config.reels) {
            setReelCount(config.reels.length);
          }
        });
      }
    }
  }, []);

  const handleOpen = (symbol = null) => {
    if (symbol) {
      setCurrentSymbol({ ...symbol });
    } else {
      // Initialize with payouts based on current context
      const initialPayouts = {};
      
      if (paylineType === 'clusters') {
        // For clusters, initialize payouts for different cluster sizes
        clusterSizes.forEach(size => {
          initialPayouts[size] = 0;
        });
      } else {
        // For standard paylines or ways, initialize based on reel count (3 to reelCount)
        for (let i = 3; i <= reelCount; i++) {
          initialPayouts[i] = 0;
        }
      }
      
      setCurrentSymbol({
        id: symbols.length ? Math.max(...symbols.map(s => s.id)) + 1 : 1,
        name: '',
        image: '',
        color: '#7C4DFF',
        payouts: initialPayouts,
        isWild: false,
        isScatter: false
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTabValue(0);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSave = () => {
    let updatedSymbols;
    if (symbols.find(s => s.id === currentSymbol.id)) {
      updatedSymbols = symbols.map(s => s.id === currentSymbol.id ? currentSymbol : s);
    } else {
      updatedSymbols = [...symbols, currentSymbol];
    }
    setSymbols(updatedSymbols);
    
    // Save to persistence
    if (window.api && window.api.saveSymbolConfig) {
      window.api.saveSymbolConfig(updatedSymbols);
    }
    
    handleClose();
  };

  const handleDelete = (id) => {
    const updated = symbols.filter(s => s.id !== id);
    setSymbols(updated);
    
    // Save to persistence
    if (window.api && window.api.saveSymbolConfig) {
      window.api.saveSymbolConfig(updated);
    }
  };

  const handlePayoutChange = (size, value) => {
    setCurrentSymbol({
      ...currentSymbol,
      payouts: { ...currentSymbol.payouts, [size]: parseInt(value) }
    });
  };

  const handleInputChange = (field, value) => {
    setCurrentSymbol({ ...currentSymbol, [field]: value });
  };

  const SymbolPreview = ({ symbol }) => (
    <Box 
      width={80} 
      height={80} 
      bgcolor={symbol.color} 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      borderRadius={1}
      color="white"
      fontWeight="bold"
    >
      {symbol.name.charAt(0)}
    </Box>
  );

  // Function to render payouts based on context
  const renderPayoutConfig = () => {
    if (!currentSymbol) return null;
    
    // Determine what payout entries to render based on paylineType
    let payoutEntries = [];
    
    if (paylineType === 'clusters') {
      // For clusters, show payout entries based on clusterSizes
      payoutEntries = clusterSizes.map(size => ({
        size,
        label: `${size} in Cluster`,
        value: currentSymbol.payouts[size] || 0,
        max: size * 100, // Higher max values for larger clusters
        step: size < 8 ? 5 : 10
      }));
    } else {
      // For standard or ways, show entries from 3 to reelCount
      payoutEntries = Array.from({ length: reelCount - 2 }, (_, i) => {
        const size = i + 3; // Starting from 3
        return {
          size,
          label: `${size} of a Kind`,
          value: currentSymbol.payouts[size] || 0,
          max: size * 100,
          step: size < 5 ? 1 : 5
        };
      });
    }

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          {paylineType === 'clusters' ? 'Cluster Payouts' : 'Line Payouts'}
        </Typography>
        
        {paylineType === 'clusters' && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Configure payouts for different cluster sizes. A cluster consists of adjacent matching symbols.
          </Alert>
        )}
        
        {payoutEntries.map(entry => (
          <Box sx={{ mb: 4 }} key={entry.size}>
            <Typography gutterBottom>{entry.label}</Typography>
            <Grid2 container spacing={2} alignItems="center">
              <Grid2 item xs>
                <Slider
                  value={entry.value}
                  min={0}
                  max={entry.max}
                  step={entry.step}
                  onChange={(e, val) => handlePayoutChange(entry.size, val)}
                  sx={{
                    color: paylineType === 'clusters' 
                      ? 'var(--accent-tertiary)' 
                      : 'var(--accent-primary)'
                  }}
                />
              </Grid2>
              <Grid2 item>
                <TextField
                  value={entry.value}
                  onChange={(e) => handlePayoutChange(entry.size, e.target.value)}
                  type="number"
                  inputProps={{ min: 0, max: entry.max * 10 }}
                  sx={{ width: 80 }}
                />
              </Grid2>
            </Grid2>
          </Box>
        ))}
      </Box>
    );
  };

  // Format payouts for display in the table
  const formatPayouts = (symbol) => {
    if (paylineType === 'clusters') {
      // For clusters, show the min, middle, and max cluster sizes
      const clusterPayouts = clusterSizes.map(size => symbol.payouts[size] || 0);
      return clusterPayouts.join('x / ');
    } else {
      // For standard/ways, show 3 to reelCount payouts
      const linePayouts = [];
      for (let i = 3; i <= reelCount; i++) {
        linePayouts.push(symbol.payouts[i] || 0);
      }
      return linePayouts.join('x / ');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <SectionHeader 
        title="Symbol Manager"
        action={
          <Button 
            variant="contained" 
            startIcon={<Add />} 
            onClick={() => handleOpen()}
          >
            Add New Symbol
          </Button>
        }
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Preview</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>
                {paylineType === 'clusters' 
                  ? `Payouts (${clusterSizes.join('/')} in cluster)` 
                  : `Payouts (${Array.from({length: reelCount-2}, (_, i) => i+3).join('/')} of a kind)`}
              </TableCell>
              <TableCell>Special</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {symbols.map((symbol) => (
              <TableRow key={symbol.id}>
                <TableCell>
                  <SymbolPreview symbol={symbol} />
                </TableCell>
                <TableCell>{symbol.name}</TableCell>
                <TableCell>{formatPayouts(symbol)}</TableCell>
                <TableCell>
                  {symbol.isWild ? 'Wild ' : ''}
                  {symbol.isScatter ? 'Scatter' : ''}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(symbol)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(symbol.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentSymbol && currentSymbol.id && symbols.find(s => s.id === currentSymbol.id) 
            ? `Edit Symbol: ${currentSymbol.name}` 
            : 'Create New Symbol'}
        </DialogTitle>
        <DialogContent>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Basic Info" />
            <Tab label="Payouts" />
            <Tab label="Special Behaviors" />
          </Tabs>
          
          {tabValue === 0 && currentSymbol && (
            <Box sx={{ mt: 2 }}>
              <Grid2 container spacing={3}>
                <Grid2 item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    label="Symbol Name"
                    value={currentSymbol.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Image Path"
                    value={currentSymbol.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    margin="normal"
                    helperText="Path to symbol image or ID"
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <ColorLens sx={{ mr: 1 }} />
                    <Typography variant="body1" sx={{ mr: 2 }}>Symbol Color:</Typography>
                    <input
                      type="color"
                      value={currentSymbol.color}
                      onChange={(e) => handleInputChange('color', e.target.value)}
                      style={{ width: '50px', height: '30px' }}
                    />
                  </Box>
                </Grid2>
                <Grid2 item xs={12} sm={4}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    {currentSymbol && <SymbolPreview symbol={currentSymbol} />}
                  </Box>
                </Grid2>
              </Grid2>
            </Box>
          )}
          
          {tabValue === 1 && currentSymbol && renderPayoutConfig()}
          
          {tabValue === 2 && currentSymbol && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>Special Behaviors</Typography>
              
              <Grid2 container spacing={3}>
                <Grid2 item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Symbol Type</InputLabel>
                    <Select
                      value={
                        currentSymbol.isWild ? (currentSymbol.isScatter ? 'both' : 'wild') :
                        (currentSymbol.isScatter ? 'scatter' : 'regular')
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        setCurrentSymbol({
                          ...currentSymbol,
                          isWild: val === 'wild' || val === 'both',
                          isScatter: val === 'scatter' || val === 'both'
                        });
                      }}
                      label="Symbol Type"
                    >
                      <MenuItem value="regular">Regular Symbol</MenuItem>
                      <MenuItem value="wild">Wild Symbol</MenuItem>
                      <MenuItem value="scatter">Scatter Symbol</MenuItem>
                      <MenuItem value="both">Wild & Scatter</MenuItem>
                    </Select>
                  </FormControl>
                  
                  {(currentSymbol.isWild || currentSymbol.isScatter) && (
                    <Box sx={{ mt: 3, p: 2, borderRadius: 1, border: '1px solid rgba(255, 255, 255, 0.1)', bgcolor: 'var(--background-tertiary)' }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Special Behavior Notes:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {currentSymbol.isWild && "• Wild symbols substitute for any other regular symbol"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {currentSymbol.isScatter && "• Scatter symbols pay anywhere, not just on paylines"}
                      </Typography>
                    </Box>
                  )}
                </Grid2>
              </Grid2>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save Symbol
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SymbolManager;
