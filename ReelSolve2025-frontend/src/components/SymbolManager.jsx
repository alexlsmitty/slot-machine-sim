import React, { useState } from 'react';
import { 
  Box, Button, TextField, Dialog, DialogActions, DialogContent, 
  DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, IconButton, Typography, Grid2, Tabs, Tab, 
  Slider, FormControl, InputLabel, Select, MenuItem 
} from '@mui/material';
import { Delete, Edit, Add, ColorLens } from '@mui/icons-material';
import { useSymbolLibrary } from './SymbolLibraryContext'; // Adjust the path as needed

const SymbolManager = () => {
  const { symbols, setSymbols } = useSymbolLibrary();
  const [currentSymbol, setCurrentSymbol] = useState(null);
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const handleOpen = (symbol = null) => {
    if (symbol) {
      setCurrentSymbol({ ...symbol });
    } else {
      setCurrentSymbol({
        id: symbols.length ? Math.max(...symbols.map(s => s.id)) + 1 : 1,
        name: '',
        image: '',
        color: '#1976D2',
        payouts: { 3: 0, 4: 0, 5: 0 },
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
    // Optionally: window.api.saveSymbolConfig(updatedSymbols);
    handleClose();
  };

  const handleDelete = (id) => {
    const updated = symbols.filter(s => s.id !== id);
    setSymbols(updated);
    // Optionally: window.api.saveSymbolConfig(updated);
  };

  const handlePayoutChange = (length, value) => {
    setCurrentSymbol({
      ...currentSymbol,
      payouts: { ...currentSymbol.payouts, [length]: parseInt(value) }
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

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Symbol Manager</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Add New Symbol
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Preview</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Payouts (3/4/5)</TableCell>
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
                <TableCell>
                  {symbol.payouts[3]}x / {symbol.payouts[4]}x / {symbol.payouts[5]}x
                </TableCell>
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
          
          {tabValue === 1 && currentSymbol && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>Payout Multipliers</Typography>
              
              <Box sx={{ mb: 4 }}>
                <Typography gutterBottom>3 of a Kind</Typography>
                <Grid2 container spacing={2} alignItems="center">
                  <Grid2 item xs>
                    <Slider
                      value={currentSymbol.payouts[3]}
                      min={0}
                      max={100}
                      step={1}
                      onChange={(e, val) => handlePayoutChange(3, val)}
                    />
                  </Grid2>
                  <Grid2 item>
                    <TextField
                      value={currentSymbol.payouts[3]}
                      onChange={(e) => handlePayoutChange(3, e.target.value)}
                      type="number"
                      inputProps={{ min: 0, max: 1000 }}
                      sx={{ width: 80 }}
                    />
                  </Grid2>
                </Grid2>
              </Box>
              
              <Box sx={{ mb: 4 }}>
                <Typography gutterBottom>4 of a Kind</Typography>
                <Grid2 container spacing={2} alignItems="center">
                  <Grid2 item xs>
                    <Slider
                      value={currentSymbol.payouts[4]}
                      min={0}
                      max={200}
                      step={1}
                      onChange={(e, val) => handlePayoutChange(4, val)}
                    />
                  </Grid2>
                  <Grid2 item>
                    <TextField
                      value={currentSymbol.payouts[4]}
                      onChange={(e) => handlePayoutChange(4, e.target.value)}
                      type="number"
                      inputProps={{ min: 0, max: 1000 }}
                      sx={{ width: 80 }}
                    />
                  </Grid2>
                </Grid2>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography gutterBottom>5 of a Kind</Typography>
                <Grid2 container spacing={2} alignItems="center">
                  <Grid2 item xs>
                    <Slider
                      value={currentSymbol.payouts[5]}
                      min={0}
                      max={500}
                      step={5}
                      onChange={(e, val) => handlePayoutChange(5, val)}
                    />
                  </Grid2>
                  <Grid2 item>
                    <TextField
                      value={currentSymbol.payouts[5]}
                      onChange={(e) => handlePayoutChange(5, e.target.value)}
                      type="number"
                      inputProps={{ min: 0, max: 5000 }}
                      sx={{ width: 80 }}
                    />
                  </Grid2>
                </Grid2>
              </Box>
            </Box>
          )}
          
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
                    <Box sx={{ mt: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
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
