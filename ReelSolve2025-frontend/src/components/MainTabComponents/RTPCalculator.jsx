import React, { useState, useEffect } from 'react';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useSymbolLibrary } from './SymbolLibraryContext';

const RTPCalculator = ({ reelConfig }) => {
  const { symbols } = useSymbolLibrary();
  const [creditsPerBet, setCreditsPerBet] = useState(1);
  const [targetRTP, setTargetRTP] = useState(95);
  const [calculatedRTP, setCalculatedRTP] = useState(null);
  const [difference, setDifference] = useState(null);
  const [paylineType, setPaylineType] = useState('standard');
  const [paylineConfig, setPaylineConfig] = useState(null);

  // Load payline configuration when component mounts
  useEffect(() => {
    if (window.api && window.api.getPaylineConfig) {
      window.api.getPaylineConfig().then(config => {
        if (config) {
          setPaylineConfig(config);
          if (config.paylineType) {
            setPaylineType(config.paylineType);
          }
        }
      });
    }
  }, []);

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

    if (paylineType === 'standard') {
      // Standard payline RTP calculation (existing logic)
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
    } 
    else if (paylineType === 'ways') {
      // Ways pays RTP calculation - all symbols can connect to all positions on adjacent reels
      // For each symbol, calculate contribution based on its presence on each reel
      symbols.forEach(symbol => {
        let waysProbability = 1;
        
        // Calculate probability of symbol appearing at least once on each reel
        reelConfig.reels.forEach(reel => {
          const totalPercent = reel.symbols.reduce((sum, s) => sum + s.percentage, 0);
          const reelSymbolEntry = reel.symbols.find(s => s.id === symbol.id);
          const reelSymbolPercent = reelSymbolEntry ? reelSymbolEntry.percentage : 0;
          
          // Probability of symbol appearing at least once on this reel
          // For ways, we need presence on each reel, not specific positions
          const probAtLeastOnce = reelSymbolPercent / (totalPercent || 1);
          waysProbability *= probAtLeastOnce;
        });
        
        // Get payout for this symbol for the number of reels
        const payout = symbol.payouts[numReels] || 0;
        expectedPayout += waysProbability * payout;
      });
    }
    else if (paylineType === 'clusters') {
      // Approximate RTP for clusters - this is complex and would need a specialized algorithm
      // This is a simplified approximation
      symbols.forEach(symbol => {
        // For clusters, we use an approximation based on symbol frequency
        let clusterProbability = 0;
        
        // Calculate average symbol frequency across reels
        const avgSymbolFrequency = reelConfig.reels.reduce((sum, reel) => {
          const totalPercent = reel.symbols.reduce((s, symb) => s + symb.percentage, 0);
          const reelSymbolEntry = reel.symbols.find(s => s.id === symbol.id);
          const symFreq = reelSymbolEntry ? reelSymbolEntry.percentage / (totalPercent || 1) : 0;
          return sum + symFreq;
        }, 0) / numReels;
        
        // Simple approximation of cluster probability (would need refinement for accuracy)
        // Calculate probability for each cluster size
        for (let clusterSize = 3; clusterSize <= 8; clusterSize++) {
          // Simplified probability model - adjust for your specific needs
          const clusterProb = Math.pow(avgSymbolFrequency, clusterSize) * (9 - clusterSize);
          const clusterPayout = symbol.payouts[Math.min(clusterSize, 8)] || 0;
          expectedPayout += clusterProb * clusterPayout;
        }
      });
    }

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
