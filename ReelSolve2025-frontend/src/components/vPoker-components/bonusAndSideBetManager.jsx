import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Checkbox, FormControlLabel } from '@mui/material';
import TabContainer from '../Shared/tabContainer';

const BonusAndSideBetManager = () => {
  const [bonusSettings, setBonusSettings] = useState({
    bonusRoundEnabled: true,
    bonusMultiplier: 2,
    sideBetEnabled: false,
    sideBetPayout: 10,
  });

  const updateBonusSetting = (setting, value) => {
    setBonusSettings(prev => ({ ...prev, [setting]: value }));
  };

  const previewBonusRTP = () => {
    console.log("Previewing bonus RTP with settings:", bonusSettings);
  };

  return (
    <TabContainer>
      <Typography variant="h5" gutterBottom>
        Bonus & Side Bet Manager
      </Typography>
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={bonusSettings.bonusRoundEnabled}
              onChange={(e) => updateBonusSetting("bonusRoundEnabled", e.target.checked)}
            />
          }
          label="Bonus Round Enabled"
        />
        <TextField
          label="Bonus Multiplier"
          type="number"
          value={bonusSettings.bonusMultiplier}
          onChange={(e) =>
            updateBonusSetting(
              "bonusMultiplier",
              isNaN(Number(e.target.value)) ? 0 : Number(e.target.value)
            )
          }
          variant="outlined"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={bonusSettings.sideBetEnabled}
              onChange={(e) => updateBonusSetting("sideBetEnabled", e.target.checked)}
            />
          }
          label="Side Bet Enabled"
        />
        <TextField
          label="Side Bet Payout"
          type="number"
          value={bonusSettings.sideBetPayout}
          onChange={(e) =>
            updateBonusSetting(
              "sideBetPayout",
              isNaN(Number(e.target.value)) ? 0 : Number(e.target.value)
            )
          }
          variant="outlined"
        />
        <Button variant="contained" onClick={previewBonusRTP}>
          Preview Bonus RTP
        </Button>
      </Box>
    </TabContainer>
  );
};

export default BonusAndSideBetManager;
