import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  FormControlLabel,
  Switch,
  Typography,
  Tooltip
} from '@mui/material';
import { Info } from '@mui/icons-material';
import { useSymbolLibrary } from '@contexts/GameContexts';

const GameMechanicsEditor = ({ onSave, initialRule = null, isEditing = false }) => {
  const { symbols } = useSymbolLibrary();
  
  // State for game mechanics
  const [mechanicName, setMechanicName] = useState('');
  const [mechanicType, setMechanicType] = useState('cascading_wins');
  
  // Cascading wins config
  const [replacementStyle, setReplacementStyle] = useState('from_above');
  const [maxCascades, setMaxCascades] = useState(5);
  const [cascadeDelay, setCascadeDelay] = useState(500);
  
  // Re-spins config
  const [respinCondition, setRespinCondition] = useState('any_win');
  const [respinSymbolId, setRespinSymbolId] = useState('');
  const [reelsToRespin, setReelsToRespin] = useState('all');
  const [respinCount, setRespinCount] = useState(1);
  const [holdWinningSymbols, setHoldWinningSymbols] = useState(true);
  
  // Cascading multipliers config
  const [initialMultiplier, setInitialMultiplier] = useState(1);
  const [incrementBy, setIncrementBy] = useState(1);
  const [maxMultiplier, setMaxMultiplier] = useState(5);
  const [resetOnNoWin, setResetOnNoWin] = useState(true);
  
  // Chain reaction config
  const [reactionType, setReactionType] = useState('respin');
  const [addWilds, setAddWilds] = useState(false);
  const [increaseMultiplier, setIncreaseMultiplier] = useState(false);
  const [maxReactions, setMaxReactions] = useState(3);
  const [wildSymbolId, setWildSymbolId] = useState('');

  useEffect(() => {
    // Set default symbol IDs when symbols are loaded
    if (symbols.length > 0) {
      const wildSymbol = symbols.find(s => s.isWild) || symbols[0];
      const scatterSymbol = symbols.find(s => s.isScatter) || symbols[0];
      
      if (!respinSymbolId) setRespinSymbolId(scatterSymbol.id.toString());
      if (!wildSymbolId) setWildSymbolId(wildSymbol.id.toString());
    }
  }, [symbols, respinSymbolId, wildSymbolId]);
  
  // If editing, load initial rule data
  useEffect(() => {
    if (initialRule && isEditing) {
      setMechanicName(initialRule.name || '');
      setMechanicType(initialRule.mechanic);
      
      // Load the specific mechanic configuration
      switch (initialRule.mechanic) {
        case 'cascading_wins':
          setReplacementStyle(initialRule.config.replacementStyle || 'from_above');
          setMaxCascades(initialRule.config.maxCascades || 5);
          setCascadeDelay(initialRule.config.delay || 500);
          break;
          
        case 're_spins':
          setRespinCondition(initialRule.config.condition?.type || 'any_win');
          if (initialRule.config.condition?.type === 'specific_symbol' && initialRule.config.condition.symbolId) {
            setRespinSymbolId(initialRule.config.condition.symbolId.toString());
          }
          setReelsToRespin(initialRule.config.reelsToRespin || 'all');
          setRespinCount(initialRule.config.respinCount || 1);
          setHoldWinningSymbols(initialRule.config.holdWinningSymbols !== false);
          break;
          
        case 'cascading_multipliers':
          setInitialMultiplier(initialRule.config.initialMultiplier || 1);
          setIncrementBy(initialRule.config.incrementBy || 1);
          setMaxMultiplier(initialRule.config.maxMultiplier || 5);
          setResetOnNoWin(initialRule.config.resetOnNoWin !== false);
          break;
          
        case 'chain_reaction':
          setReactionType(initialRule.config.reactionType || 'respin');
          setAddWilds(initialRule.config.addedFeatures?.includes('wild_symbols') || false);
          setIncreaseMultiplier(initialRule.config.addedFeatures?.includes('increasing_multiplier') || false);
          setMaxReactions(initialRule.config.maxReactions || 3);
          if (initialRule.config.wildSymbolId) {
            setWildSymbolId(initialRule.config.wildSymbolId.toString());
          }
          break;
          
        default:
          break;
      }
    }
  }, [initialRule, isEditing]);

  const handleSave = () => {
    if (!mechanicName) {
      alert("Please give your game mechanic a name");
      return;
    }
    
    let mechanicConfig = {};
    
    // Build the config based on the mechanic type
    switch (mechanicType) {
      case 'cascading_wins':
        mechanicConfig = {
          replacementStyle,
          maxCascades: parseInt(maxCascades),
          delay: parseInt(cascadeDelay)
        };
        break;
        
      case 're_spins':
        mechanicConfig = {
          condition: {
            type: respinCondition,
            ...(respinCondition === 'specific_symbol' ? { symbolId: parseInt(respinSymbolId) } : {})
          },
          reelsToRespin,
          respinCount: parseInt(respinCount),
          holdWinningSymbols
        };
        break;
        
      case 'cascading_multipliers':
        mechanicConfig = {
          initialMultiplier: parseFloat(initialMultiplier),
          incrementBy: parseFloat(incrementBy),
          maxMultiplier: parseFloat(maxMultiplier),
          resetOnNoWin
        };
        break;
        
      case 'chain_reaction':
        const addedFeatures = [];
        if (addWilds) addedFeatures.push('wild_symbols');
        if (increaseMultiplier) addedFeatures.push('increasing_multiplier');
        
        mechanicConfig = {
          reactionType,
          addedFeatures,
          maxReactions: parseInt(maxReactions),
          ...(addWilds ? { wildSymbolId: parseInt(wildSymbolId) } : {})
        };
        break;
        
      default:
        break;
    }

    const rule = {
      ruleType: 'game_mechanic',
      name: mechanicName,
      mechanic: mechanicType,
      config: mechanicConfig
    };

    onSave(rule);
    
    // Reset form
    setMechanicName('');
    setMechanicType('cascading_wins');
    setReplacementStyle('from_above');
    setMaxCascades(5);
    setCascadeDelay(500);
    setRespinCondition('any_win');
    setRespinSymbolId(symbols.find(s => s.isScatter)?.id.toString() || '');
    setReelsToRespin('all');
    setRespinCount(1);
    setHoldWinningSymbols(true);
    setInitialMultiplier(1);
    setIncrementBy(1);
    setMaxMultiplier(5);
    setResetOnNoWin(true);
    setReactionType('respin');
    setAddWilds(false);
    setIncreaseMultiplier(false);
    setMaxReactions(3);
    setWildSymbolId(symbols.find(s => s.isWild)?.id.toString() || '');
  };

  const renderGameMechanicConfig = () => {
    switch (mechanicType) {
      case 'cascading_wins':
        return (
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle1">
              Cascading Wins Configuration
              <Tooltip title="When a winning combination occurs, those symbols disappear and new ones cascade down">
                <Info fontSize="small" sx={{ ml: 1, verticalAlign: 'middle', color: 'primary.main' }} />
              </Tooltip>
            </Typography>
            
            <FormControl fullWidth>
              <InputLabel>Replacement Style</InputLabel>
              <Select
                value={replacementStyle}
                label="Replacement Style"
                onChange={(e) => setReplacementStyle(e.target.value)}
              >
                <MenuItem value="from_above">New Symbols From Above</MenuItem>
                <MenuItem value="new_symbols">Complete New Symbols</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Maximum Cascades"
              type="number"
              value={maxCascades}
              onChange={(e) => setMaxCascades(e.target.value)}
              helperText="Maximum number of consecutive cascades (-1 for unlimited)"
              inputProps={{ min: -1 }}
              fullWidth
            />
            
            <TextField
              label="Animation Delay (ms)"
              type="number"
              value={cascadeDelay}
              onChange={(e) => setCascadeDelay(e.target.value)}
              helperText="Delay between cascades in milliseconds"
              inputProps={{ min: 0, step: 100 }}
              fullWidth
            />
          </Box>
        );
        
      case 're_spins':
        return (
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle1">
              Re-Spins Configuration
              <Tooltip title="After a win, certain reels may re-spin for additional win opportunities">
                <Info fontSize="small" sx={{ ml: 1, verticalAlign: 'middle', color: 'primary.main' }} />
              </Tooltip>
            </Typography>
            
            <FormControl fullWidth>
              <InputLabel>Trigger Condition</InputLabel>
              <Select
                value={respinCondition}
                label="Trigger Condition"
                onChange={(e) => setRespinCondition(e.target.value)}
              >
                <MenuItem value="any_win">Any Win</MenuItem>
                <MenuItem value="specific_symbol">Specific Symbol</MenuItem>
                <MenuItem value="win_amount_above">Win Amount Above Threshold</MenuItem>
              </Select>
            </FormControl>
            
            {respinCondition === 'specific_symbol' && (
              <FormControl fullWidth>
                <InputLabel>Symbol</InputLabel>
                <Select
                  value={respinSymbolId}
                  label="Symbol"
                  onChange={(e) => setRespinSymbolId(e.target.value)}
                >
                  {symbols.map(sym => (
                    <MenuItem key={sym.id} value={sym.id.toString()}>
                      {sym.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            
            <FormControl fullWidth>
              <InputLabel>Reels to Re-Spin</InputLabel>
              <Select
                value={reelsToRespin}
                label="Reels to Re-Spin"
                onChange={(e) => setReelsToRespin(e.target.value)}
              >
                <MenuItem value="all">All Reels</MenuItem>
                <MenuItem value="non_winning">Non-Winning Reels</MenuItem>
                <MenuItem value="middle">Middle Reels Only</MenuItem>
                <MenuItem value="outer">Outer Reels Only</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Re-Spin Count"
              type="number"
              value={respinCount}
              onChange={(e) => setRespinCount(e.target.value)}
              helperText="Number of respins to award"
              inputProps={{ min: 1 }}
              fullWidth
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={holdWinningSymbols}
                  onChange={(e) => setHoldWinningSymbols(e.target.checked)}
                />
              }
              label="Hold Winning Symbols During Re-Spin"
            />
          </Box>
        );
        
      case 'cascading_multipliers':
        return (
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle1">
              Cascading Multipliers Configuration
              <Tooltip title="Win multiplier increases with each consecutive cascade">
                <Info fontSize="small" sx={{ ml: 1, verticalAlign: 'middle', color: 'primary.main' }} />
              </Tooltip>
            </Typography>
            
            <TextField
              label="Initial Multiplier"
              type="number"
              value={initialMultiplier}
              onChange={(e) => setInitialMultiplier(e.target.value)}
              helperText="Starting multiplier value"
              inputProps={{ min: 1, step: 0.5 }}
              fullWidth
            />
            
            <TextField
              label="Increment By"
              type="number"
              value={incrementBy}
              onChange={(e) => setIncrementBy(e.target.value)}
              helperText="How much the multiplier increases with each cascade"
              inputProps={{ min: 0.5, step: 0.5 }}
              fullWidth
            />
            
            <TextField
              label="Maximum Multiplier"
              type="number"
              value={maxMultiplier}
              onChange={(e) => setMaxMultiplier(e.target.value)}
              helperText="Maximum multiplier value (-1 for unlimited)"
              inputProps={{ min: -1, step: 1 }}
              fullWidth
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={resetOnNoWin}
                  onChange={(e) => setResetOnNoWin(e.target.checked)}
                />
              }
              label="Reset Multiplier on No Win"
            />
          </Box>
        );
        
      case 'chain_reaction':
        return (
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle1">
              Chain Reaction Configuration
              <Tooltip title="Trigger additional reactions after a win, such as re-spins or adding wilds">
                <Info fontSize="small" sx={{ ml: 1, verticalAlign: 'middle', color: 'primary.main' }} />
              </Tooltip>
            </Typography>
            
            <FormControl fullWidth>
              <InputLabel>Reaction Type</InputLabel>
              <Select
                value={reactionType}
                label="Reaction Type"
                onChange={(e) => setReactionType(e.target.value)}
              >
                <MenuItem value="respin">Re-Spin</MenuItem>
                <MenuItem value="add_wilds">Add Wilds</MenuItem>
                <MenuItem value="increase_multiplier">Increase Multiplier</MenuItem>
              </Select>
            </FormControl>
            
            <FormControlLabel
              control={
                <Switch
                  checked={addWilds}
                  onChange={(e) => setAddWilds(e.target.checked)}
                />
              }
              label="Add Wild Symbols"
            />
            
            {addWilds && (
              <FormControl fullWidth>
                <InputLabel>Wild Symbol</InputLabel>
                <Select
                  value={wildSymbolId}
                  label="Wild Symbol"
                  onChange={(e) => setWildSymbolId(e.target.value)}
                >
                  {symbols.map(sym => (
                    <MenuItem key={sym.id} value={sym.id.toString()}>
                      {sym.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            
            <FormControlLabel
              control={
                <Switch
                  checked={increaseMultiplier}
                  onChange={(e) => setIncreaseMultiplier(e.target.checked)}
                />
              }
              label="Increase Multiplier"
            />
            
            <TextField
              label="Maximum Reactions"
              type="number"
              value={maxReactions}
              onChange={(e) => setMaxReactions(e.target.value)}
              helperText="Maximum number of consecutive reactions (-1 for unlimited)"
              inputProps={{ min: -1 }}
              fullWidth
            />
          </Box>
        );
        
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Mechanic Name"
        value={mechanicName}
        onChange={(e) => setMechanicName(e.target.value)}
        fullWidth
      />
      
      <FormControl fullWidth>
        <InputLabel>Mechanic Type</InputLabel>
        <Select
          value={mechanicType}
          label="Mechanic Type"
          onChange={(e) => setMechanicType(e.target.value)}
        >
          <MenuItem value="cascading_wins">Cascading Wins</MenuItem>
          <MenuItem value="re_spins">Re-Spins</MenuItem>
          <MenuItem value="cascading_multipliers">Cascading Multipliers</MenuItem>
          <MenuItem value="chain_reaction">Chain Reaction</MenuItem>
        </Select>
      </FormControl>
      
      {renderGameMechanicConfig()}
      
      <Button variant="contained" onClick={handleSave}>
        {isEditing ? 'Update Mechanic' : 'Add Mechanic'}
      </Button>
    </Box>
  );
};

export default GameMechanicsEditor;