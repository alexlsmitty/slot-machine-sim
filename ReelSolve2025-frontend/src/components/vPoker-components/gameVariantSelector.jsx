import React, { useState, useEffect } from 'react';
import { Typography, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material';
import TabContainer from '../Shared/tabContainer';
import { useVideoPoker } from '@contexts/GameContexts';
import { videoPokerVariants } from '@models/videoPokerVariants';
import ErrorBoundary from '../Shared/errorBoundary';

const GameVariantSelector = () => {
  // Add error state
  const [error, setError] = useState(null);

  try {
    // Use the hook from the unified context
    const { variant, setVariant } = useVideoPoker();
    const [selectedVariantId, setSelectedVariantId] = useState(variant?.id || '');

    useEffect(() => {
      try {
        // On mount, or when selectedVariantId changes, update the context if needed.
        if (!selectedVariantId) return;
        
        const newVariant = videoPokerVariants.find(v => v.id === selectedVariantId);
        if (newVariant && newVariant.id !== variant?.id) {
          setVariant(newVariant);
        }
      } catch (err) {
        console.error("Error in variant selection effect:", err);
        setError(`Failed to update variant: ${err.message}`);
      }
    }, [selectedVariantId, setVariant, variant?.id]);

    const handleVariantChange = (e) => {
      try {
        const newId = e.target.value;
        setSelectedVariantId(newId);
        const newVariant = videoPokerVariants.find(v => v.id === newId);
        if (newVariant) {
          setVariant(newVariant);
        }
      } catch (err) {
        console.error("Error changing variant:", err);
        setError(`Failed to change variant: ${err.message}`);
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
            Game Variant Selector
          </Typography>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="variant-selector-label">Select Variant</InputLabel>
            <Select
              labelId="variant-selector-label"
              label="Select Variant"
              value={selectedVariantId}
              onChange={handleVariantChange}
            >
              {videoPokerVariants.map((v) => (
                <MenuItem key={v.id} value={v.id}>
                  {v.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </TabContainer>
      </ErrorBoundary>
    );
  } catch (err) {
    console.error("Fatal error in GameVariantSelector:", err);
    return (
      <TabContainer>
        <Alert severity="error">
          Failed to initialize Game Variant Selector: {err.message}
        </Alert>
      </TabContainer>
    );
  }
};

export default GameVariantSelector;