import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  Grid2,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  OutlinedInput,
  FormHelperText
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';
import { useSymbolLibrary } from '@contexts/GameContexts';
import SectionHeader from '../Navigation/sectionHeader';

// Bonus type options
const BONUS_TYPES = [
  'Hold and Spins',
  'Free Spins',
  'Jackpot Chances',
  'Spin The Wheel',
  'Progressive Jackpots',
  'Super Bonus'
];

// Trigger type options
const TRIGGER_TYPES = [
  'On Symbol Combination',
  'Random Chance',
  'After Payline Win'
];

// For this example, bonus types that involve jackpots
const BONUS_TYPES_WITH_JACKPOTS = [
  'Jackpot Chances',
  'Spin The Wheel',
  'Progressive Jackpots'
];

const BonusManager = () => {
  const { symbols } = useSymbolLibrary();
  
  const [bonusList, setBonusList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBonusId, setCurrentBonusId] = useState(null);

  // Form state for the bonus rule
  const [bonusName, setBonusName] = useState('');
  const [bonusType, setBonusType] = useState(BONUS_TYPES[0]);
  const [triggerType, setTriggerType] = useState(TRIGGER_TYPES[0]);
  // Trigger value as percentage (e.g. 5 for 5% chance)
  const [triggerValue, setTriggerValue] = useState('');
  const [jackpots, setJackpots] = useState([]); // each jackpot: { id, name, payout, multiplier }
  
  // Replace custom reel configuration text input with a multi-select for bonus reel symbols
  const [bonusReelSymbolIds, setBonusReelSymbolIds] = useState([]);
  
  // This JSON output shows the details of the selected bonus reel symbols.
  const bonusReelConfigJSON = JSON.stringify(
    symbols.filter(sym => bonusReelSymbolIds.includes(sym.id)),
    null,
    2
  );
  
  // For combination bonuses (optional)
  const [comboBonusIds, setComboBonusIds] = useState([]);

  // RTP Calculation state
  const [calculatedBonusRTP, setCalculatedBonusRTP] = useState(null);
  const [rtpError, setRtpError] = useState('');

  const resetForm = () => {
    setBonusName('');
    setBonusType(BONUS_TYPES[0]);
    setTriggerType(TRIGGER_TYPES[0]);
    setTriggerValue('');
    setJackpots([]);
    setBonusReelSymbolIds([]);
    setComboBonusIds([]);
    setIsEditing(false);
    setCurrentBonusId(null);
    setCalculatedBonusRTP(null);
    setRtpError('');
  };

  // Jackpot handling
  const addJackpot = () => {
    const newId = jackpots.length ? Math.max(...jackpots.map(j => j.id)) + 1 : 1;
    setJackpots([...jackpots, { id: newId, name: '', payout: 0, multiplier: 1 }]);
  };

  const updateJackpot = (id, field, value) => {
    setJackpots(jackpots.map(j => j.id === id ? { ...j, [field]: value } : j));
  };

  const removeJackpot = (id) => {
    setJackpots(jackpots.filter(j => j.id !== id));
  };

  const handleSave = () => {
    const newBonus = {
      id: isEditing ? currentBonusId : (bonusList.length ? Math.max(...bonusList.map(b => b.id)) + 1 : 1),
      name: bonusName,
      bonusType,
      trigger: { type: triggerType, value: triggerValue },
      jackpots: BONUS_TYPES_WITH_JACKPOTS.includes(bonusType) ? jackpots : [],
      bonusReelSymbolIds,
      comboBonusIds,
    };

    if (isEditing) {
      setBonusList(bonusList.map(b => b.id === currentBonusId ? newBonus : b));
    } else {
      setBonusList([...bonusList, newBonus]);
    }
    resetForm();
  };

  const handleEdit = (bonus) => {
    setIsEditing(true);
    setCurrentBonusId(bonus.id);
    setBonusName(bonus.name);
    setBonusType(bonus.bonusType);
    setTriggerType(bonus.trigger.type);
    setTriggerValue(bonus.trigger.value);
    setJackpots(bonus.jackpots || []);
    setBonusReelSymbolIds(bonus.bonusReelSymbolIds || []);
    setComboBonusIds(bonus.comboBonusIds || []);
  };

  const handleDelete = (id) => {
    setBonusList(bonusList.filter(b => b.id !== id));
  };

  // Bonus RTP calculation:
  // For this simplified example:
  // Bonus RTP = (TriggerValue / 100) * (Effect Payout)
  // For bonus_free_spins, assume effect payout = (number of free spins * fixed factor)
  // For bonus_multiplier, assume effect payout = (multiplier * fixed factor)
  // We'll use a fixed factor of 10.
  const calculateBonusRTP = () => {
    setRtpError('');
    // Validate trigger value is provided and numeric.
    const triggerChance = parseFloat(triggerValue);
    if (isNaN(triggerChance) || triggerChance < 0) {
      setRtpError('Please enter a valid trigger value (percentage).');
      return;
    }
    const fixedFactor = 10;
    let bonusPayout = 0;
    if (bonusType === 'Free Spins') {
      bonusPayout = parseFloat(triggerValue) ? parseFloat(triggerValue) : 0; // not ideal; we'll instead use effect value
      // For Free Spins, we assume effect value (number of free spins) multiplied by the fixed factor.
      bonusPayout = (parseFloat(triggerValue) ? parseFloat(triggerValue) : 0) * fixedFactor;
    } else if (bonusType === 'Hold and Spins') {
      // Example: use jackpots to calculate average payout.
      if (jackpots.length === 0) {
        setRtpError('Please configure at least one jackpot for Hold and Spins.');
        return;
      }
      const avgPayout = jackpots.reduce((sum, j) => sum + parseFloat(j.payout), 0) / jackpots.length;
      bonusPayout = avgPayout * fixedFactor;
    } else if (bonusType === 'Jackpot Chances' || bonusType === 'Spin The Wheel' || bonusType === 'Progressive Jackpots') {
      if (jackpots.length === 0) {
        setRtpError('Please configure at least one jackpot for this bonus type.');
        return;
      }
      const avgPayout = jackpots.reduce((sum, j) => sum + parseFloat(j.payout), 0) / jackpots.length;
      bonusPayout = avgPayout * fixedFactor;
    } else if (bonusType === 'Super Bonus') {
      // For Super Bonus, assume a fixed multiplier bonus.
      bonusPayout = fixedFactor * 2;
    } else {
      setRtpError('RTP cannot be calculated for the selected bonus type.');
      return;
    }
    // Bonus RTP calculation using trigger chance (as percentage) and bonus payout.
    const bonusRTP = (triggerChance / 100) * bonusPayout;
    setCalculatedBonusRTP(bonusRTP);
  };

  return (
    <Box sx={{ p: 3 }}>
      <SectionHeader title="Bonus Manager" />
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Create / Edit Bonus
        </Typography>
        <Grid2 container spacing={2}>
          <Grid2 item xs={12}>
            <TextField
              label="Bonus Name"
              value={bonusName}
              onChange={(e) => setBonusName(e.target.value)}
              fullWidth
            />
          </Grid2>
          <Grid2 item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Bonus Type</InputLabel>
              <Select
                value={bonusType}
                label="Bonus Type"
                onChange={(e) => setBonusType(e.target.value)}
              >
                {BONUS_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid2>
          <Grid2 item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Trigger Type</InputLabel>
              <Select
                value={triggerType}
                label="Trigger Type"
                onChange={(e) => setTriggerType(e.target.value)}
              >
                {TRIGGER_TYPES.map((tt) => (
                  <MenuItem key={tt} value={tt}>{tt}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid2>
          <Grid2 item xs={12} sm={6}>
            <TextField
              label="Trigger Value (%)"
              type="number"
              value={triggerValue}
              onChange={(e) => setTriggerValue(e.target.value)}
              fullWidth
            />
          </Grid2>
          {/* Bonus Reel Symbols: instead of a JSON input, use a multi-select */}
          <Grid2 item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="bonus-reel-label">Bonus Reel Symbols</InputLabel>
              <Select
                labelId="bonus-reel-label"
                multiple
                value={bonusReelSymbolIds}
                onChange={(e) => setBonusReelSymbolIds(e.target.value)}
                input={<OutlinedInput label="Bonus Reel Symbols" />}
              >
                {symbols.map(sym => (
                  <MenuItem key={sym.id} value={sym.id}>
                    {sym.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                Select the symbols to be used for the bonus round reel configuration.
              </FormHelperText>
            </FormControl>
          </Grid2>
          {/* JSON Output for Bonus Reel Configuration */}
          {bonusReelSymbolIds.length > 0 && (
            <Grid2 item xs={12}>
              <TextField
                label="Bonus Reel Configuration (JSON)"
                value={bonusReelConfigJSON}
                multiline
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid2>
          )}
          {/* Jackpot Configuration */}
          {BONUS_TYPES_WITH_JACKPOTS.includes(bonusType) && (
            <Grid2 item xs={12}>
              <Typography variant="subtitle1">Jackpot Configuration</Typography>
              {jackpots.map((jackpot) => (
                <Grid2 container spacing={1} key={jackpot.id} alignItems="center">
                  <Grid2 item xs={4}>
                    <TextField
                      label="Jackpot Name"
                      value={jackpot.name}
                      onChange={(e) => updateJackpot(jackpot.id, 'name', e.target.value)}
                      fullWidth
                    />
                  </Grid2>
                  <Grid2 item xs={3}>
                    <TextField
                      label="Payout"
                      type="number"
                      value={jackpot.payout}
                      onChange={(e) => updateJackpot(jackpot.id, 'payout', parseFloat(e.target.value))}
                      fullWidth
                    />
                  </Grid2>
                  <Grid2 item xs={3}>
                    <TextField
                      label="Multiplier"
                      type="number"
                      value={jackpot.multiplier}
                      onChange={(e) => updateJackpot(jackpot.id, 'multiplier', parseFloat(e.target.value))}
                      fullWidth
                    />
                  </Grid2>
                  <Grid2 item xs={2}>
                    <IconButton onClick={() => removeJackpot(jackpot.id)}>
                      <Delete />
                    </IconButton>
                  </Grid2>
                </Grid2>
              ))}
              <Box sx={{ mt: 1 }}>
                <Button variant="outlined" startIcon={<Add />} onClick={addJackpot}>
                  Add Jackpot
                </Button>
              </Box>
            </Grid2>
          )}
          {/* Combination Bonuses */}
          <Grid2 item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Combine With (Bonus IDs)</InputLabel>
              <Select
                multiple
                value={comboBonusIds}
                onChange={(e) => setComboBonusIds(e.target.value)}
                label="Combine With (Bonus IDs)"
              >
                {bonusList
                  .filter(b => !isEditing || b.id !== currentBonusId)
                  .map(b => (
                    <MenuItem key={b.id} value={b.id}>
                      {b.name} (ID: {b.id})
                    </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid2>
          {/* Save / Cancel Button */}
          <Grid2 item xs={12}>
            <Button variant="contained" onClick={handleSave}>
              {isEditing ? 'Update Bonus' : 'Add Bonus'}
            </Button>
            {isEditing && (
              <Button variant="text" onClick={resetForm} sx={{ ml: 2 }}>
                Cancel
              </Button>
            )}
          </Grid2>
        </Grid2>
      </Paper>
      
      {/* RTP Calculation Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Bonus RTP Calculator
        </Typography>
        <Button variant="contained" onClick={calculateBonusRTP}>
          Calculate Bonus RTP
        </Button>
        {rtpError && (
          <Typography color="error" sx={{ mt: 1 }}>
            {rtpError}
          </Typography>
        )}
        {calculatedBonusRTP !== null && !rtpError && (
          <Box sx={{ mt: 2 }}>
            <Typography>
              Bonus RTP: {calculatedBonusRTP.toFixed(2)}%
            </Typography>
          </Box>
        )}
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Current Bonuses
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Trigger</TableCell>
              <TableCell>Jackpots</TableCell>
              <TableCell>Bonus Reel Config</TableCell>
              <TableCell>Combination Bonuses</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bonusList.map(bonus => (
              <TableRow key={bonus.id}>
                <TableCell>{bonus.id}</TableCell>
                <TableCell>{bonus.name}</TableCell>
                <TableCell>{bonus.bonusType}</TableCell>
                <TableCell>{bonus.trigger.type} ({bonus.trigger.value}%)</TableCell>
                <TableCell>
                  {bonus.jackpots && bonus.jackpots.length > 0
                    ? bonus.jackpots.map(j => `${j.name}: ${j.payout} (${j.multiplier}x)`).join(', ')
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  {bonus.bonusReelSymbolIds && bonus.bonusReelSymbolIds.length > 0
                    ? JSON.stringify(
                        symbols.filter(s => bonus.bonusReelSymbolIds.includes(s.id)),
                        null,
                        2
                      )
                    : 'Default'}
                </TableCell>
                <TableCell>
                  {bonus.comboBonusIds && bonus.comboBonusIds.length > 0
                    ? bonus.comboBonusIds.join(', ')
                    : 'None'}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(bonus)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(bonus.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default BonusManager;
