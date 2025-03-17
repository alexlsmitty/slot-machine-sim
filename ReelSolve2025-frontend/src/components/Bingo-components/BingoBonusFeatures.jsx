import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Checkbox, FormControlLabel } from '@mui/material';
import TabContainer from '../Shared/tabContainer';
import SectionHeader from '../Navigation/sectionHeader';

const BingoBonusFeatures = () => {
  const [freeCardsEnabled, setFreeCardsEnabled] = useState(false);
  const [freeCardsCount, setFreeCardsCount] = useState(0);
  const [multiplierBallsEnabled, setMultiplierBallsEnabled] = useState(false);
  const [multiplierValue, setMultiplierValue] = useState(1);
  const [bonusMiniGamesEnabled, setBonusMiniGamesEnabled] = useState(false);
  const [bonusMiniGameDetails, setBonusMiniGameDetails] = useState('');
  const [progressiveJackpotEnabled, setProgressiveJackpotEnabled] = useState(false);
  const [jackpotThreshold, setJackpotThreshold] = useState(0);

  const API_URL = '/api/bingo/bonus-features';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      freeCards: { enabled: freeCardsEnabled, count: freeCardsEnabled ? freeCardsCount : 0 },
      multiplierBalls: { enabled: multiplierBallsEnabled, multiplier: multiplierBallsEnabled ? multiplierValue : 1 },
      bonusMiniGames: { enabled: bonusMiniGamesEnabled, details: bonusMiniGamesEnabled ? bonusMiniGameDetails : '' },
      progressiveJackpot: { enabled: progressiveJackpotEnabled, threshold: progressiveJackpotEnabled ? jackpotThreshold : 0 },
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        alert('Bonus features configuration saved successfully!');
      } else {
        alert('Failed to save bonus features configuration.');
      }
    } catch (error) {
      console.error('Error saving bonus features configuration:', error);
      alert('Error saving bonus features configuration.');
    }
  };

  return (
    <TabContainer>
      <SectionHeader title="Bingo Bonus Features" />
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          <Typography variant="subtitle1">Free Cards</Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={freeCardsEnabled}
                onChange={(e) => setFreeCardsEnabled(e.target.checked)}
              />
            }
            label="Enable Free Cards"
          />
          {freeCardsEnabled && (
            <TextField
              fullWidth
              label="Number of Free Cards"
              type="number"
              value={freeCardsCount}
              onChange={(e) => setFreeCardsCount(parseInt(e.target.value))}
              inputProps={{ min: "0" }}
            />
          )}
        </Box>

        <Box>
          <Typography variant="subtitle1">Multiplier Balls</Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={multiplierBallsEnabled}
                onChange={(e) => setMultiplierBallsEnabled(e.target.checked)}
              />
            }
            label="Enable Multiplier Balls"
          />
          {multiplierBallsEnabled && (
            <TextField
              fullWidth
              label="Multiplier Value"
              type="number"
              value={multiplierValue}
              onChange={(e) => setMultiplierValue(parseFloat(e.target.value))}
              inputProps={{ step: "0.1", min: "1" }}
            />
          )}
        </Box>

        <Box>
          <Typography variant="subtitle1">Bonus Mini-Games</Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={bonusMiniGamesEnabled}
                onChange={(e) => setBonusMiniGamesEnabled(e.target.checked)}
              />
            }
            label="Enable Bonus Mini-Games"
          />
          {bonusMiniGamesEnabled && (
            <TextField
              fullWidth
              label="Mini-Game Details"
              multiline
              rows={3}
              value={bonusMiniGameDetails}
              onChange={(e) => setBonusMiniGameDetails(e.target.value)}
              placeholder="Enter mini-game details"
            />
          )}
        </Box>

        <Box>
          <Typography variant="subtitle1">Progressive Jackpot</Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={progressiveJackpotEnabled}
                onChange={(e) => setProgressiveJackpotEnabled(e.target.checked)}
              />
            }
            label="Enable Progressive Jackpot"
          />
          {progressiveJackpotEnabled && (
            <TextField
              fullWidth
              label="Jackpot Threshold"
              type="number"
              value={jackpotThreshold}
              onChange={(e) => setJackpotThreshold(parseFloat(e.target.value))}
              inputProps={{ step: "0.01", min: "0" }}
            />
          )}
        </Box>

        <Button variant="contained" type="submit">
          Save Bonus Features
        </Button>
      </Box>
    </TabContainer>
  );
};

export default BingoBonusFeatures;
