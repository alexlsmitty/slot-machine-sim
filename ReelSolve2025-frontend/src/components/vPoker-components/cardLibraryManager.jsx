import React, { useState, useEffect } from 'react';
import { Grid2, Typography, Button, Paper, Alert } from '@mui/material';
import TabContainer from '../Shared/tabContainer';
import { useVideoPoker } from '@contexts/GameContexts';
import ErrorBoundary from '../Shared/errorBoundary';

const CardLibraryManager = () => {
  const [error, setError] = useState(null);
  
  try {
    // Get variant from context instead of props
    const { variant } = useVideoPoker();

    // Compute the initial deck based on the variant
    const getInitialDeck = () => {
      try {
        return variant && variant.getDefaultDeck ? variant.getDefaultDeck() : [];
      } catch (err) {
        console.error("Error getting default deck:", err);
        setError(`Failed to load default deck: ${err.message}`);
        return [];
      }
    };

    const [cards, setCards] = useState(getInitialDeck());

    // Update the deck when the variant changes
    useEffect(() => {
      try {
        setCards(getInitialDeck());
      } catch (err) {
        console.error("Error updating cards:", err);
        setError(`Failed to update card deck: ${err.message}`);
      }
    }, [variant]);

    const previewCard = (card) => {
      try {
        console.log("Previewing card:", card);
      } catch (err) {
        console.error("Error previewing card:", err);
        setError(`Failed to preview card: ${err.message}`);
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
            Card Library Manager
          </Typography>
          <Grid2 container spacing={2}>
            {cards.map((card) => (
              <Grid2 item key={card.id} xs={12} sm={6} md={4}>
                <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                  <img
                    src={card.image}
                    alt={`${card.rank} of ${card.suit}`}
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                  <Typography variant="subtitle1" sx={{ mt: 1 }}>
                    {card.rank} {card.suit !== 'None' ? `of ${card.suit}` : ''}{' '}
                    {card.isWild ? "(Wild)" : ""}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => previewCard(card)}
                    sx={{ mt: 1 }}
                  >
                    Preview
                  </Button>
                </Paper>
              </Grid2>
            ))}
          </Grid2>
        </TabContainer>
      </ErrorBoundary>
    );
  } catch (err) {
    console.error("Fatal error in CardLibraryManager:", err);
    return (
      <TabContainer>
        <Alert severity="error">
          Failed to initialize Card Library: {err.message}
        </Alert>
      </TabContainer>
    );
  }
};

export default CardLibraryManager;
