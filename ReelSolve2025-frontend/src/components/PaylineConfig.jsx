import React, { useState, useEffect } from 'react';
import { 
  Box, Button, TextField, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Typography, 
  Grid2, Dialog, DialogActions, DialogContent, DialogTitle,
  ToggleButton, ToggleButtonGroup, Tooltip, FormControlLabel,
  Switch, Divider
} from '@mui/material';
import { Delete, Edit, Add, ArrowForward } from '@mui/icons-material';

const initialPaylines = [
  { id: 1, name: "Horizontal Center", pattern: [1, 1, 1, 1, 1], active: true, multiplier: 1 },
  { id: 2, name: "Top Horizontal", pattern: [0, 0, 0, 0, 0], active: true, multiplier: 1 },
  { id: 3, name: "Bottom Horizontal", pattern: [2, 2, 2, 2, 2], active: true, multiplier: 1 },
  { id: 4, name: "V Shape", pattern: [0, 1, 2, 1, 0], active: true, multiplier: 1 },
  { id: 5, name: "Inverted V", pattern: [2, 1, 0, 1, 2], active: true, multiplier: 1 }
];

const PaylineConfiguration = () => {
  const [paylines, setPaylines] = useState(initialPaylines);
  const [currentPayline, setCurrentPayline] = useState(null);
  const [open, setOpen] = useState(false);
  const [reelCount, setReelCount] = useState(5);
  const [rowCount, setRowCount] = useState(3);
  const [evaluationType, setEvaluationType] = useState('leftToRight');

  // On mount, try to load saved payline configuration via IPC
  useEffect(() => {
    if (window.api && window.api.getPaylineConfig) {
      window.api.getPaylineConfig().then(savedPaylines => {
        if (savedPaylines && savedPaylines.length > 0) {
          setPaylines(savedPaylines);
        }
      });
    }
  }, []);

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
    // Call IPC to save payline configuration if available
    if (window.api && window.api.savePaylineConfig) {
      window.api.savePaylineConfig(updatedPaylines);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    const updated = paylines.filter(p => p.id !== id);
    setPaylines(updated);
    if (window.api && window.api.savePaylineConfig) {
      window.api.savePaylineConfig(updated);
    }
  };

  const handlePatternChange = (reelIndex, rowIndex) => {
    const newPattern = [...currentPayline.pattern];
    newPattern[reelIndex] = rowIndex;
    setCurrentPayline({ ...currentPayline, pattern: newPattern });
  };

  const handleToggleActive = (id) => {
    const updated = paylines.map(p => p.id === id ? { ...p, active: !p.active } : p);
    setPaylines(updated);
    if (window.api && window.api.savePaylineConfig) {
      window.api.savePaylineConfig(updated);
    }
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
              inputProps={{ min: 1, step: 0.1 }}
              value={currentPayline.multiplier}
              onChange={(e) => setCurrentPayline({ ...currentPayline, multiplier: parseFloat(e.target.value) })}
              margin="normal"
            />
          </Grid2>
        </Grid2>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Payline Configuration</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={() => handleOpen()}
        >
          Add New Payline
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>Payline Evaluation Rules</Typography>
        <Paper sx={{ p: 2 }}>
          <Grid2 container spacing={3}>
            <Grid2 item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Number of Reels"
                type="number"
                inputProps={{ min: 3, max: 9 }}
                value={reelCount}
                onChange={(e) => setReelCount(parseInt(e.target.value))}
              />
            </Grid2>
            <Grid2 item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Number of Rows"
                type="number"
                inputProps={{ min: 2, max: 6 }}
                value={rowCount}
                onChange={(e) => setRowCount(parseInt(e.target.value))}
              />
            </Grid2>
            <Grid2 item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <ToggleButtonGroup
                    color="primary"
                    value={evaluationType}
                    exclusive
                    onChange={(e, val) => val && setEvaluationType(val)}
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
