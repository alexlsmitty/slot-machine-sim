import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import TabContainer from '../Shared/tabContainer';

const RNGConfigurator = () => {
  const [seed, setSeed] = useState(12345);

  const testRNG = () => {
    console.log("Testing RNG with seed:", seed);
  };

  return (
    <TabContainer>
      <Typography variant="h5" gutterBottom>
        RNG Configurator
      </Typography>
      <Box component="form" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          label="RNG Seed"
          type="number"
          value={seed}
          onChange={(e) => setSeed(isNaN(Number(e.target.value)) ? 0 : Number(e.target.value))}
          variant="outlined"
        />
        <Button variant="contained" onClick={testRNG}>
          Test RNG
        </Button>
      </Box>
    </TabContainer>
  );
};

export default RNGConfigurator;
