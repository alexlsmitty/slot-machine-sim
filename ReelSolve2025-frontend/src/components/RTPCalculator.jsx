import React, { useState } from 'react';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useSymbolLibrary } from './SymbolLibraryContext';

const RTPCalculator = ({ reelConfig }) => {
  const { symbols } = useSymbolLibrary();
  const [creditsPerBet, setCreditsPerBet] = useState(1);
  const [targetRTP, setTargetRTP] = useState(95);
  const [calculatedRTP, setCalculatedRTP] = useState(null);
  const [difference, setDifference] = useState(null);

  // Calculates theoretical RTP using the formula:
  // RTP = (Expected Payout / Credits per Bet) * 100
  // Expected Payout is computed by summing, for each symbol, (probability of symbol on all reels * payout)
  const calculateRTP = () => {
    if (!reelConfig || !reelConfig.reels || reelConfig.reels.length === 0) return;
    if (reelConfig.selectionMethod !== 'percentage') {
      setCalculatedRTP(0);
      setDifference(targetRTP - 0);
      return;
    }

    let expectedPayout = 0;
    const numReels = reelConfig.reels.length;

    // Iterate through each symbol in the shared library.
    symbols.forEach(symbol => {
      let productProb = 1;
      reelConfig.reels.forEach(reel => {
        // Assume each reel has an array of symbol entries like: { id, percentage }
        const totalPercent = reel.symbols.reduce((sum, s) => sum + s.percentage, 0);
        const reelSymbolEntry = reel.symbols.find(s => s.id === symbol.id);
        // If symbol not present on the reel, its probability is zero.
        const prob = reelSymbolEntry ? reelSymbolEntry.percentage / (totalPercent || 1) : 0;
        productProb *= prob;
      });
      // Get the payout for this symbol when it appears on all reels.
      const payout = symbol.payouts[numReels] || 0;
      expectedPayout += productProb * payout;
    });

    // Theoretical RTP = (Expected Payout / Credits per Bet) * 100
    const rtpPercent = (expectedPayout / creditsPerBet) * 100;
    setCalculatedRTP(rtpPercent);
    setDifference(targetRTP - rtpPercent);
  };

  return (
    <Paper sx={{ p: 2, width: '300px', m: 2 }}>
      <Typography variant="h5" gutterBottom>
        Theoretical RTP Calculator
      </Typography>
      <TextField
        label="Credits per Bet"
        type="number"
        value={creditsPerBet}
        onChange={(e) => setCreditsPerBet(parseFloat(e.target.value))}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Target RTP (%)"
        type="number"
        value={targetRTP}
        onChange={(e) => setTargetRTP(parseFloat(e.target.value))}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" onClick={calculateRTP} fullWidth sx={{ mt: 2 }}>
        Calculate RTP
      </Button>
      {calculatedRTP !== null && (
        <Box sx={{ mt: 2 }}>
          <Typography>
            Theoretical RTP: {calculatedRTP.toFixed(2)}%
          </Typography>
          <Typography>
            Difference: {difference.toFixed(2)}%
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default RTPCalculator;
