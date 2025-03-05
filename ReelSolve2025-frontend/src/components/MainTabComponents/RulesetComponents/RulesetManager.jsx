import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Chip,
  Button
} from '@mui/material';
import { Delete, Edit, ContentCopy, Add } from '@mui/icons-material';
import { useSymbolLibrary } from '../SymbolLibraryContext';
import SectionHeader from '../../sectionHeader';
import RuleConditionEffectEditor from './RuleConditionEffectEditor';
import GameMechanicsEditor from './GameMechanicsEditor';

// TabPanel component for the tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`rule-tabpanel-${index}`}
      aria-labelledby={`rule-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const RulesetManager = () => {
  const { symbols } = useSymbolLibrary();
  const [rules, setRules] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRuleId, setCurrentRuleId] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [viewMode, setViewMode] = useState('all'); // 'all', 'conditions', 'mechanics'
  
  // State for loading from backend
  useEffect(() => {
    if (window.api && window.api.getRulesetConfig) {
      window.api.getRulesetConfig().then(config => {
        if (config && Array.isArray(config.rules)) {
          setRules(config.rules);
        }
      });
    }
  }, []);

  // Save to backend
  const saveRules = (updatedRules) => {
    if (window.api && window.api.saveRulesetConfig) {
      window.api.saveRulesetConfig({ rules: updatedRules });
    }
    setRules(updatedRules);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddRule = (ruleType) => {
    setIsEditing(true);
    setCurrentRuleId(null);
    setTabValue(ruleType === 'condition_effect' ? 0 : 1);
  };

  const handleEditRule = (rule) => {
    setCurrentRuleId(rule.id);
    setIsEditing(true);
    setTabValue(rule.ruleType === 'condition_effect' ? 0 : 1);
  };

  const handleDeleteRule = (id) => {
    const updatedRules = rules.filter(rule => rule.id !== id);
    saveRules(updatedRules);
  };

  const handleDuplicateRule = (rule) => {
    const newRule = {
      ...rule,
      id: Math.max(0, ...rules.map(r => r.id)) + 1,
      name: `${rule.name} (Copy)`
    };
    const updatedRules = [...rules, newRule];
    saveRules(updatedRules);
  };

  const handleSaveRule = (ruleData) => {
    let updatedRules;
    
    if (currentRuleId !== null) {
      // Editing existing rule
      updatedRules = rules.map(rule => 
        rule.id === currentRuleId ? { ...ruleData, id: currentRuleId } : rule
      );
    } else {
      // Adding new rule
      const newId = rules.length > 0 ? Math.max(...rules.map(rule => rule.id)) + 1 : 1;
      updatedRules = [...rules, { ...ruleData, id: newId }];
    }
    
    saveRules(updatedRules);
    setIsEditing(false);
    setCurrentRuleId(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentRuleId(null);
  };

  const currentRule = currentRuleId !== null ? rules.find(r => r.id === currentRuleId) : null;
  
  const filteredRules = viewMode === 'all' 
    ? rules 
    : viewMode === 'conditions' 
      ? rules.filter(r => r.ruleType === 'condition_effect')
      : rules.filter(r => r.ruleType === 'game_mechanic');

  return (
    <Box sx={{ p: 3 }}>
      <SectionHeader 
        title="Ruleset Manager"
        action={
          !isEditing && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined" 
                startIcon={<Add />} 
                onClick={() => handleAddRule('condition_effect')}
              >
                Add Rule
              </Button>
              <Button 
                variant="contained" 
                color="secondary"
                startIcon={<Add />} 
                onClick={() => handleAddRule('game_mechanic')}
              >
                Add Game Mechanic
              </Button>
            </Box>
          )
        }
      />

      {isEditing ? (
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Condition/Effect Rules" />
          <Tab label="Game Mechanics" />
        </Tabs>
      ) : (
        <Tabs value={viewMode === 'all' ? 0 : viewMode === 'conditions' ? 1 : 2} onChange={(_, val) => {
          setViewMode(val === 0 ? 'all' : val === 1 ? 'conditions' : 'mechanics');
        }}>
          <Tab label="All Rules" />
          <Tab label="Condition Rules" />
          <Tab label="Game Mechanics" />
        </Tabs>
      )}

      {isEditing ? (
        <>
          <TabPanel value={tabValue} index={0}>
            <RuleConditionEffectEditor 
              rule={currentRule || { ruleType: 'condition_effect', name: '', condition: {}, effect: {} }}
              onSave={handleSaveRule}
              onCancel={handleCancelEdit}
              symbols={symbols}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <GameMechanicsEditor 
              rule={currentRule || { ruleType: 'game_mechanic', name: '', mechanic: '', config: {} }}
              onSave={handleSaveRule}
              onCancel={handleCancelEdit}
            />
          </TabPanel>
        </>
      ) : (
        <Paper sx={{ mt: 2, width: '100%', overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Description</TableCell>
                <TableCell width="20%">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2" sx={{ py: 2 }}>
                      {viewMode === 'all' 
                        ? 'No rules defined yet' 
                        : viewMode === 'conditions' 
                          ? 'No condition rules defined yet'
                          : 'No game mechanics defined yet'
                      }
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRules.map(rule => (
                  <TableRow key={rule.id}>
                    <TableCell>{rule.name}</TableCell>
                    <TableCell>
                      <Chip 
                        label={rule.ruleType === 'condition_effect' ? 'Condition Rule' : 'Game Mechanic'} 
                        color={rule.ruleType === 'condition_effect' ? 'primary' : 'secondary'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {rule.ruleType === 'condition_effect' ? (
                        `When ${getRuleDescription(rule, symbols)}`
                      ) : (
                        getMechanicDescription(rule)
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex' }}>
                        <IconButton onClick={() => handleEditRule(rule)} size="small">
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => handleDuplicateRule(rule)} size="small">
                          <ContentCopy fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteRule(rule.id)} size="small" color="error">
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

// Helper function to get a human readable description of a rule
function getRuleDescription(rule, symbols) {
  if (!rule.condition || !rule.effect) return 'Invalid rule configuration';
  
  let conditionText = '';
  const condition = rule.condition;
  
  switch (condition.type) {
    case 'symbol_frequency':
      const symbol = symbols.find(s => s.id === condition.symbolId);
      conditionText = `${symbol?.name || 'Symbol'} appears ${condition.operator} ${condition.threshold} times`;
      break;
    case 'win_amount':
      conditionText = `win amount is ${condition.operator} ${condition.amount}`;
      break;
    default:
      conditionText = condition.type;
  }
  
  let effectText = '';
  const effect = rule.effect;
  
  switch (effect.type) {
    case 'bonus_free_spins':
      effectText = `award ${effect.spins} free spins`;
      break;
    case 'multiplier':
      effectText = `apply ${effect.value}x multiplier`;
      break;
    default:
      effectText = effect.type;
  }
  
  return `${conditionText}, then ${effectText}`;
}

// Helper function for game mechanic descriptions
function getMechanicDescription(rule) {
  switch (rule.mechanic) {
    case 'cascading_wins':
      return `Winning symbols disappear and are replaced from ${rule.config.replacementStyle}`;
    case 'respins':
      return `After a win, reels ${rule.config.reelsToRespin?.join(', ')} will respin`;
    case 'increasing_multiplier':
      return `Multiplier increases by ${rule.config.increment}x with each consecutive win`;
    case 'chain_reaction':
      return `Wins trigger ${rule.config.reaction} with ${rule.config.additionalEffect || 'no'} additional effects`;
    default:
      return rule.mechanic;
  }
}

export default RulesetManager;
