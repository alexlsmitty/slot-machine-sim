import React, { useState } from 'react';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import SectionHeader from '../Navigation/sectionHeader';
import TabContainer from '../Shared/tabContainer';

const BingoGameMechanics = () => {
  const [roundDuration, setRoundDuration] = useState(60);
  const [numberOfRounds, setNumberOfRounds] = useState(5);
  const [cardPrice, setCardPrice] = useState(1.0);
  const [payoutMultiplier, setPayoutMultiplier] = useState(1.0);
  const [progressiveJackpotTrigger, setProgressiveJackpotTrigger] = useState('');
  const [gameMode, setGameMode] = useState('single');

  const API_URL = '/api/bingo/game-mechanics';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      rounds: { duration: roundDuration, count: numberOfRounds },
      pricing: { cardPrice, payoutMultiplier },
      progressiveJackpotTrigger,
      gameMode,
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        alert('Game mechanics configuration saved successfully!');
      } else {
        alert('Failed to save game mechanics configuration.');
      }
    } catch (error) {
      console.error('Error saving game mechanics configuration:', error);
      alert('Error saving game mechanics configuration.');
    }
  };

  return (
    <TabContainer>
      <SectionHeader title="Bingo Game Mechanics" />
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          fullWidth
          label="Round Duration (seconds)"
          type="number"
          value={roundDuration}
          onChange={(e) => setRoundDuration(parseInt(e.target.value))}
          inputProps={{ min: 10 }}
        />
        <TextField
          fullWidth
          label="Number of Rounds"
          type="number"
          value={numberOfRounds}
          onChange={(e) => setNumberOfRounds(parseInt(e.target.value))}
          inputProps={{ min: 1 }}
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
          label="Payout Multiplier"
          type="number"
          value={payoutMultiplier}
          onChange={(e) => setPayoutMultiplier(parseFloat(e.target.value))}
          inputProps={{ step: "0.1", min: "1" }}
        />
        <TextField
          fullWidth
          label="Progressive Jackpot Trigger Conditions"
          multiline
          rows={3}
          value={progressiveJackpotTrigger}
          onChange={(e) => setProgressiveJackpotTrigger(e.target.value)}
          placeholder="Enter trigger conditions"
        />
        <FormControl fullWidth>
          <InputLabel>Game Mode</InputLabel>
          <Select value={gameMode} label="Game Mode" onChange={(e) => setGameMode(e.target.value)}>
            <MenuItem value="single">Single Player (Video Bingo)</MenuItem>
            <MenuItem value="multiplayer">Multiplayer (Online Bingo)</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" type="submit">
          Save Game Mechanics
        </Button>
      </Box>
    </TabContainer>
  );
};

export default BingoGameMechanics;
