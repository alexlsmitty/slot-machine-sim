import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Paper
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';
import { useSymbolLibrary } from './SymbolLibraryContext';

const initialRules = [
  // Sample rule: if "Scatter" appears at least 3 times, then award 10 free spins.
  { 
    id: 1, 
    condition: { type: 'symbol_frequency', symbolId: 2, operator: '>=', threshold: 3 }, 
    effect: { type: 'bonus_free_spins', spins: 10 }
  }
];

const RulesetManager = () => {
  const { symbols } = useSymbolLibrary();
  const [rules, setRules] = useState(initialRules);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRuleId, setCurrentRuleId] = useState(null);

  // Form state for the new/edited rule.
  const [conditionType, setConditionType] = useState('symbol_frequency');
  const [selectedSymbolId, setSelectedSymbolId] = useState('');
  const [operator, setOperator] = useState('>=');
  const [threshold, setThreshold] = useState(1);
  const [effectType, setEffectType] = useState('bonus_free_spins');
  const [effectValue, setEffectValue] = useState(10);

  const resetForm = () => {
    setConditionType('symbol_frequency');
    setSelectedSymbolId('');
    setOperator('>=');
    setThreshold(1);
    setEffectType('bonus_free_spins');
    setEffectValue(10);
    setIsEditing(false);
    setCurrentRuleId(null);
  };

  const handleSave = () => {
    const newRule = {
      id: isEditing ? currentRuleId : (rules.length ? Math.max(...rules.map(r => r.id)) + 1 : 1),
      condition: { 
        type: conditionType, 
        symbolId: parseInt(selectedSymbolId), 
        operator, 
        threshold 
      },
      effect: effectType === 'bonus_free_spins'
        ? { type: effectType, spins: effectValue }
        : { type: effectType, multiplier: effectValue }
    };

    if (isEditing) {
      setRules(rules.map(rule => rule.id === newRule.id ? newRule : rule));
    } else {
      setRules([...rules, newRule]);
    }
    resetForm();
  };

  const handleEdit = (rule) => {
    setIsEditing(true);
    setCurrentRuleId(rule.id);
    setConditionType(rule.condition.type);
    setSelectedSymbolId(rule.condition.symbolId.toString());
    setOperator(rule.condition.operator);
    setThreshold(rule.condition.threshold);
    setEffectType(rule.effect.type);
    setEffectValue(rule.effect.type === 'bonus_free_spins' ? rule.effect.spins : rule.effect.multiplier);
  };

  const handleDelete = (id) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Bonus & Ruleset Manager
      </Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Create / Edit Rule
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Condition Section */}
          <Typography variant="subtitle1">Condition</Typography>
          <FormControl fullWidth>
            <InputLabel>Condition Type</InputLabel>
            <Select
              value={conditionType}
              label="Condition Type"
              onChange={(e) => setConditionType(e.target.value)}
            >
              <MenuItem value="symbol_frequency">Symbol Frequency</MenuItem>
              {/* Additional condition types can be added here */}
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
                    <MenuItem key={sym.id} value={sym.id}>
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

          {/* Effect Section */}
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
              {/* Additional effect types can be added here */}
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
              value={effectValue}
              onChange={(e) => setEffectValue(parseFloat(e.target.value))}
              fullWidth
            />
          )}

          <Button variant="contained" onClick={handleSave}>
            {isEditing ? 'Update Rule' : 'Add Rule'}
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Current Rules
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Condition</TableCell>
              <TableCell>Effect</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rules.map(rule => (
              <TableRow key={rule.id}>
                <TableCell>{rule.id}</TableCell>
                <TableCell>
                  {rule.condition.type === 'symbol_frequency' &&
                    `If Symbol ${symbols.find(s => s.id === rule.condition.symbolId)?.name || 'Unknown'} ${rule.condition.operator} ${rule.condition.threshold}`
                  }
                </TableCell>
                <TableCell>
                  {rule.effect.type === 'bonus_free_spins' &&
                    `Award ${rule.effect.spins} Free Spins`
                  }
                  {rule.effect.type === 'bonus_multiplier' &&
                    `Apply ${rule.effect.multiplier}x Multiplier`
                  }
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(rule)}>
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
      </Paper>
    </Box>
  );
};

export default RulesetManager;
