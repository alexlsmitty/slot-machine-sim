import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { useSymbolLibrary } from '../SymbolLibraryContext';

const RuleConditionEffectEditor = ({ onSave, initialRule = null, isEditing = false }) => {
  const { symbols } = useSymbolLibrary();
  const [ruleName, setRuleName] = useState('');
  const [conditionType, setConditionType] = useState('symbol_frequency');
  const [selectedSymbolId, setSelectedSymbolId] = useState('');
  const [operator, setOperator] = useState('>=');
  const [threshold, setThreshold] = useState(3);
  const [effectType, setEffectType] = useState('bonus_free_spins');
  const [effectValue, setEffectValue] = useState(10);
  
  useEffect(() => {
    // Set default symbol IDs when symbols are loaded
    if (symbols.length > 0 && !selectedSymbolId) {
      const scatterSymbol = symbols.find(s => s.isScatter) || symbols[0];
      setSelectedSymbolId(scatterSymbol.id.toString());
    }
  }, [symbols, selectedSymbolId]);
  
  // If editing, load initial rule data
  useEffect(() => {
    if (initialRule && isEditing) {
      setRuleName(initialRule.name || '');
      setConditionType(initialRule.condition.type);
      setSelectedSymbolId(initialRule.condition.symbolId.toString());
      setOperator(initialRule.condition.operator);
      setThreshold(initialRule.condition.threshold);
      setEffectType(initialRule.effect.type);
      setEffectValue(initialRule.effect.type === 'bonus_free_spins' ? 
        initialRule.effect.spins : 
        initialRule.effect.multiplier);
    }
  }, [initialRule, isEditing]);
  
  const handleSave = () => {
    if (!ruleName) {
      alert("Please give your rule a name");
      return;
    }
    
    if (!selectedSymbolId) {
      alert("Please select a symbol");
      return;
    }

    const rule = {
      ruleType: 'condition_effect',
      name: ruleName,
      condition: { 
        type: conditionType, 
        symbolId: parseInt(selectedSymbolId), 
        operator, 
        threshold 
      },
      effect: effectType === 'bonus_free_spins'
        ? { type: effectType, spins: parseInt(effectValue) }
        : { type: effectType, multiplier: parseFloat(effectValue) }
    };

    onSave(rule);
    
    // Reset form
    setRuleName('');
    setConditionType('symbol_frequency');
    setSelectedSymbolId(symbols.find(s => s.isScatter)?.id.toString() || '');
    setOperator('>=');
    setThreshold(3);
    setEffectType('bonus_free_spins');
    setEffectValue(10);
  };
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Rule Name"
        value={ruleName}
        onChange={(e) => setRuleName(e.target.value)}
        fullWidth
      />
      
      <Typography variant="subtitle1">Condition</Typography>
      <FormControl fullWidth>
        <InputLabel>Condition Type</InputLabel>
        <Select
          value={conditionType}
          label="Condition Type"
          onChange={(e) => setConditionType(e.target.value)}
        >
          <MenuItem value="symbol_frequency">Symbol Frequency</MenuItem>
          <MenuItem value="win_amount">Win Amount</MenuItem>
          <MenuItem value="game_state">Game State</MenuItem>
        </Select>
      </FormControl>
      
      {conditionType === 'symbol_frequency' && (
        <>
          <FormControl fullWidth>
            <InputLabel>Symbol</InputLabel>
            <Select
              value={selectedSymbolId}
              label="Symbol"
              onChange={(e) => setSelectedSymbolId(e.target.value)}
            >
              {symbols.map(sym => (
                <MenuItem key={sym.id} value={sym.id.toString()}>
                  {sym.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel>Operator</InputLabel>
            <Select
              value={operator}
              label="Operator"
              onChange={(e) => setOperator(e.target.value)}
            >
              <MenuItem value="=">=</MenuItem>
              <MenuItem value=">">&gt;</MenuItem>
              <MenuItem value="<">&lt;</MenuItem>
              <MenuItem value=">=">&gt;=</MenuItem>
              <MenuItem value="<=">&lt;=</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            label="Threshold"
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(parseInt(e.target.value))}
            fullWidth
          />
        </>
      )}
      
      {conditionType === 'win_amount' && (
        <>
          <FormControl fullWidth>
            <InputLabel>Operator</InputLabel>
            <Select
              value={operator}
              label="Operator"
              onChange={(e) => setOperator(e.target.value)}
            >
              <MenuItem value=">">&gt;</MenuItem>
              <MenuItem value=">=">&gt;=</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            label="Win Amount Threshold"
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(parseInt(e.target.value))}
            fullWidth
          />
        </>
      )}
      
      <Typography variant="subtitle1">Effect</Typography>
      <FormControl fullWidth>
        <InputLabel>Effect Type</InputLabel>
        <Select
          value={effectType}
          label="Effect Type"
          onChange={(e) => setEffectType(e.target.value)}
        >
          <MenuItem value="bonus_free_spins">Bonus Free Spins</MenuItem>
          <MenuItem value="bonus_multiplier">Bonus Multiplier</MenuItem>
          <MenuItem value="add_wilds">Add Wild Symbols</MenuItem>
          <MenuItem value="special_feature">Trigger Special Feature</MenuItem>
        </Select>
      </FormControl>
      
      {effectType === 'bonus_free_spins' && (
        <TextField
          label="Free Spins"
          type="number"
          value={effectValue}
          onChange={(e) => setEffectValue(parseInt(e.target.value))}
          fullWidth
        />
      )}
      
      {effectType === 'bonus_multiplier' && (
        <TextField
          label="Multiplier"
          type="number"
          inputProps={{ step: 0.1, min: 1 }}
          value={effectValue}
          onChange={(e) => setEffectValue(parseFloat(e.target.value))}
          fullWidth
        />
      )}
      
      <Button variant="contained" onClick={handleSave}>
        {isEditing ? 'Update Rule' : 'Add Rule'}
      </Button>
    </Box>
  );
};

export default RuleConditionEffectEditor;