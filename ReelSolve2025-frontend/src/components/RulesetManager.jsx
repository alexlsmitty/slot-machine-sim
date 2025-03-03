import React, { useState } from 'react';
import { 
  Box, Button, TextField, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Typography, 
  Grid, Dialog, DialogActions, DialogContent, DialogTitle, 
  Switch, FormControlLabel, Divider 
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

// Sample initial special rules – you can replace these with your own or load from a backend
const initialRules = [
  { id: 1, name: "Free Spins Trigger", condition: "3 or more Scatter symbols", effect: "Award 10 free spins", active: true },
  { id: 2, name: "Bonus Multiplier", condition: "4 or more Wild symbols", effect: "Apply x2 multiplier", active: true }
];

const SpecialRules = () => {
  const [specialRules, setSpecialRules] = useState(initialRules);
  const [currentRule, setCurrentRule] = useState(null);
  const [open, setOpen] = useState(false);

  // Open dialog for new rule or edit existing rule
  const handleOpen = (rule = null) => {
    if (rule) {
      setCurrentRule({ ...rule });
    } else {
      const newId = specialRules.length ? Math.max(...specialRules.map(r => r.id)) + 1 : 1;
      setCurrentRule({
        id: newId,
        name: `Rule ${newId}`,
        condition: '',
        effect: '',
        active: true
      });
    }
    setOpen(true);
  };

  // Close the dialog and reset current rule state
  const handleClose = () => {
    setOpen(false);
    setCurrentRule(null);
  };

  // Save a new rule or update an existing rule
  const handleSave = () => {
    if (specialRules.find(r => r.id === currentRule.id)) {
      setSpecialRules(specialRules.map(r => r.id === currentRule.id ? currentRule : r));
    } else {
      setSpecialRules([...specialRules, currentRule]);
    }
    handleClose();
  };

  // Delete a rule by filtering it out
  const handleDelete = (id) => {
    setSpecialRules(specialRules.filter(r => r.id !== id));
  };

  // Toggle a rule's active status
  const handleToggleActive = (id) => {
    setSpecialRules(specialRules.map(r => 
      r.id === id ? { ...r, active: !r.active } : r
    ));
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Special Rules Configuration</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={() => handleOpen()}
        >
          Add New Rule
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Table of Special Rules */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Rule Name</TableCell>
              <TableCell>Condition</TableCell>
              <TableCell>Effect</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {specialRules.map(rule => (
              <TableRow key={rule.id} sx={{ opacity: rule.active ? 1 : 0.5 }}>
                <TableCell>{rule.id}</TableCell>
                <TableCell>{rule.name}</TableCell>
                <TableCell>{rule.condition}</TableCell>
                <TableCell>{rule.effect}</TableCell>
                <TableCell>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={rule.active}
                        onChange={() => handleToggleActive(rule.id)}
                        color="primary"
                      />
                    }
                    label={rule.active ? "Active" : "Inactive"}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(rule)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(rule.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Creating / Editing a Rule */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentRule && specialRules.find(r => r.id === currentRule.id) 
            ? `Edit Rule: ${currentRule.name}` 
            : 'Create New Rule'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {/* Rule Name */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Rule Name"
                  value={currentRule ? currentRule.name : ''}
                  onChange={(e) => setCurrentRule({ ...currentRule, name: e.target.value })}
                  margin="normal"
                />
              </Grid>
              {/* Rule Condition */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Condition"
                  value={currentRule ? currentRule.condition : ''}
                  onChange={(e) => setCurrentRule({ ...currentRule, condition: e.target.value })}
                  margin="normal"
                  helperText="E.g., '3 or more Scatter symbols'"
                />
              </Grid>
              {/* Rule Effect */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Effect"
                  value={currentRule ? currentRule.effect : ''}
                  onChange={(e) => setCurrentRule({ ...currentRule, effect: e.target.value })}
                  margin="normal"
                  helperText="E.g., 'Award 10 free spins' or 'Apply x2 multiplier'"
                />
              </Grid>
              {/* Active Toggle */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={currentRule ? currentRule.active : false}
                      onChange={(e) => setCurrentRule({ ...currentRule, active: e.target.checked })}
                      color="primary"
                    />
                  }
                  label="Active Rule"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save Rule
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SpecialRules;
