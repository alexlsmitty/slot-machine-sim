import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Checkbox, FormControlLabel, Alert } from '@mui/material';
import TabContainer from '../Shared/tabContainer';
import ErrorBoundary from '../Shared/errorBoundary';

const BonusAndSideBetManager = () => {
  const [error, setError] = useState(null);
  
  try {
    const [bonusSettings, setBonusSettings] = useState({
      bonusRoundEnabled: true,
      bonusMultiplier: 2,
      sideBetEnabled: false,
      sideBetPayout: 10,
    });

    const updateBonusSetting = (setting, value) => {
      try {
        setBonusSettings(prev => ({ ...prev, [setting]: value }));
      } catch (err) {
        console.error("Error updating bonus setting:", err);
        setError(`Failed to update ${setting}: ${err.message}`);
      }
    };

    const previewBonusRTP = () => {
      try {
        console.log("Previewing bonus RTP with settings:", bonusSettings);
      } catch (err) {
        console.error("Error previewing bonus RTP:", err);
        setError(`Failed to preview bonus RTP: ${err.message}`);
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
      </ErrorBoundary>
    );
  } catch (err) {
    console.error("Fatal error in BonusAndSideBetManager:", err);
    return (
      <TabContainer>
        <Alert severity="error">
          Failed to initialize Bonus & Side Bet Manager: {err.message}
        </Alert>
      </TabContainer>
    );
  }
};

export default BonusAndSideBetManager;