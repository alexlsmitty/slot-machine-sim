import React, { useState } from 'react';
import { Paper, Typography, Box, FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';
import SectionHeader from '../Navigation/sectionHeader';
import TabContainer from '../Shared/tabContainer';

const BingoPatternManager = () => {
  const [patternType, setPatternType] = useState('horizontal');
  const [patternDetails, setPatternDetails] = useState('');
  const [patternPayout, setPatternPayout] = useState(0);
  const [patternProbability, setPatternProbability] = useState(0);
  const [patterns, setPatterns] = useState([]);

  const API_URL = '/api/bingo/patterns';

  const addPattern = () => {
    const newPattern = { type: patternType, details: patternDetails, payout: patternPayout, probability: patternProbability };
    setPatterns([...patterns, newPattern]);
    setPatternDetails('');
    setPatternPayout(0);
    setPatternProbability(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patterns }),
      });
      if (response.ok) {
        alert('Patterns saved successfully!');
      } else {
        alert('Failed to save patterns.');
      }
    } catch (error) {
      console.error('Error saving patterns:', error);
      alert('Error saving patterns.');
    }
  };

  return (
    <TabContainer>
      <SectionHeader title="Bingo Pattern Manager" />
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Pattern Type</InputLabel>
          <Select
            value={patternType}
            label="Pattern Type"
            onChange={(e) => setPatternType(e.target.value)}
          >
            <MenuItem value="horizontal">Horizontal Line</MenuItem>
            <MenuItem value="vertical">Vertical Line</MenuItem>
            <MenuItem value="diagonal">Diagonal Line</MenuItem>
            <MenuItem value="X">X Pattern</MenuItem>
            <MenuItem value="blackout">Blackout</MenuItem>
            <MenuItem value="corners">Corners</MenuItem>
            <MenuItem value="progressive">Progressive</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Pattern Details"
          multiline
          rows={3}
          value={patternDetails}
          onChange={(e) => setPatternDetails(e.target.value)}
          placeholder="Enter pattern details or configuration"
          fullWidth
        />

        <TextField
          label="Pattern Payout"
          type="number"
          value={patternPayout}
          onChange={(e) => setPatternPayout(parseFloat(e.target.value))}
          fullWidth
          inputProps={{ step: "0.01", min: "0" }}
        />

        <TextField
          label="Pattern Probability (%)"
          type="number"
          value={patternProbability}
          onChange={(e) => setPatternProbability(parseFloat(e.target.value))}
          fullWidth
          inputProps={{ step: "0.01", min: "0", max: "100" }}
        />

        <Button variant="contained" onClick={addPattern}>
          Add Pattern
        </Button>

        {patterns.length > 0 && (
          <Box>
            <Typography variant="h6">Added Patterns</Typography>
            <ul>
              {patterns.map((pattern, index) => (
                <li key={index}>
                  <strong>Type:</strong> {pattern.type} | <strong>Payout:</strong> {pattern.payout} | <strong>Probability:</strong> {pattern.probability}% | <strong>Details:</strong> {pattern.details}
                </li>
              ))}
            </ul>
          </Box>
        )}

        <Button variant="outlined" type="submit">
          Save All Patterns
        </Button>
      </Box>
    </TabContainer>
  );
};

export default BingoPatternManager;
