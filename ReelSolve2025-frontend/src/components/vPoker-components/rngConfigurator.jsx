import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import TabContainer from '../Shared/tabContainer';
import ErrorBoundary from '../Shared/errorBoundary';

const RNGConfigurator = () => {
  const [error, setError] = useState(null);
  
  try {
    const [seed, setSeed] = useState(12345);

    const updateSeed = (value) => {
      try {
        setSeed(isNaN(Number(value)) ? 0 : Number(value));
      } catch (err) {
        console.error("Error updating seed:", err);
        setError(`Failed to update seed: ${err.message}`);
      }
    };

    const testRNG = () => {
      try {
        console.log("Testing RNG with seed:", seed);
        // Simulate potential error for testing
        if (seed === 0) {
          throw new Error("Seed cannot be zero");
        }
        // Normal behavior
      } catch (err) {
        console.error("Error testing RNG:", err);
        setError(`Failed to test RNG: ${err.message}`);
      }
    };

    return (
      <ErrorBoundary>
        <TabContainer>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          <Typography variant="h5" gutterBottom>
            RNG Configurator
          </Typography>
          <Box component="form" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              label="RNG Seed"
              type="number"
              value={seed}
              onChange={(e) => updateSeed(e.target.value)}
              variant="outlined"
              error={seed === 0}
              helperText={seed === 0 ? "Seed cannot be zero" : ""}
            />
            <Button variant="contained" onClick={testRNG} disabled={seed === 0}>
              Test RNG
            </Button>
          </Box>
        </TabContainer>
      </ErrorBoundary>
    );
  } catch (err) {
    console.error("Fatal error in RNGConfigurator:", err);
    return (
      <TabContainer>
        <Alert severity="error">
          Failed to initialize RNG Configurator: {err.message}
        </Alert>
      </TabContainer>
    );
  }
};

export default RNGConfigurator;