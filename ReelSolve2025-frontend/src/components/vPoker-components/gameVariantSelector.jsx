import React, { useState, useEffect } from 'react';
import { Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import TabContainer from '../Shared/tabContainer';
// Import from the new unified context
import { useVideoPoker } from '@contexts/GameContexts';
import { videoPokerVariants } from '@models/videoPokerVariants';

const GameVariantSelector = () => {
  // Use the hook from the unified context
  const { variant, setVariant } = useVideoPoker();
  const [selectedVariantId, setSelectedVariantId] = useState(variant.id);

  useEffect(() => {
    // On mount, or when selectedVariantId changes, update the context if needed.
    const newVariant = videoPokerVariants.find(v => v.id === selectedVariantId);
    if (newVariant && newVariant.id !== variant.id) {
      setVariant(newVariant);
    }
  }, [selectedVariantId, setVariant, variant.id]);

  const handleVariantChange = (e) => {
    const newId = e.target.value;
    setSelectedVariantId(newId);
    const newVariant = videoPokerVariants.find(v => v.id === newId);
    if (newVariant) {
      setVariant(newVariant);
    }
  };

  return (
    <TabContainer>
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
  );
};

export default GameVariantSelector;
