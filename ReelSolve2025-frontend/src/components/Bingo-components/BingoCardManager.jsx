import React, { useState } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField, Button, Checkbox, FormControlLabel } from '@mui/material';
import SectionHeader from '../Navigation/sectionHeader';
import TabContainer from '../Shared/tabContainer';

const BingoCardManager = () => {
  const [cardLayout, setCardLayout] = useState('75-ball');
  const [numberArrangement, setNumberArrangement] = useState('');
  const [cardPrice, setCardPrice] = useState(1.0);
  const [cardQuantity, setCardQuantity] = useState(1);
  const [specialTypes, setSpecialTypes] = useState({ wildCard: false, extraFreeSpaces: false });

  const API_URL = '/api/bingo/cards';

  const handleSpecialChange = (e) => {
    const { name, checked } = e.target;
    setSpecialTypes((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { cardLayout, numberArrangement, cardPrice, cardQuantity, specialTypes };
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        alert('Card configuration saved successfully!');
      } else {
        alert('Failed to save card configuration.');
      }
    } catch (error) {
      console.error('Error saving card configuration:', error);
      alert('Error saving card configuration.');
    }
  };

  return (
    <TabContainer>
      <SectionHeader title="Bingo Card Manager" />
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Card Layout</InputLabel>
          <Select value={cardLayout} label="Card Layout" onChange={(e) => setCardLayout(e.target.value)}>
            <MenuItem value="75-ball">75-ball</MenuItem>
            <MenuItem value="90-ball">90-ball</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Number Arrangement"
          multiline
          rows={4}
          value={numberArrangement}
          onChange={(e) => setNumberArrangement(e.target.value)}
          placeholder="Enter number arrangement details"
        />
        <TextField
          fullWidth
          label="Card Price"
          type="number"
          value={cardPrice}
          onChange={(e) => setCardPrice(parseFloat(e.target.value))}
          inputProps={{ step: "0.01", min: "0" }}
        />
        <TextField
          fullWidth
          label="Card Quantity"
          type="number"
          value={cardQuantity}
          onChange={(e) => setCardQuantity(parseInt(e.target.value))}
          inputProps={{ min: "1" }}
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                name="wildCard"
                checked={specialTypes.wildCard}
                onChange={handleSpecialChange}
              />
            }
            label="Wild Card"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="extraFreeSpaces"
                checked={specialTypes.extraFreeSpaces}
                onChange={handleSpecialChange}
              />
            }
            label="Extra Free Spaces"
          />
        </Box>
        <Button variant="contained" type="submit">
          Save Card Configuration
        </Button>
      </Box>
    </TabContainer>
  );
};

export default BingoCardManager;
