import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button, Paper } from '@mui/material';
import TabContainer from '../Shared/tabContainer';

const CardLibraryManager = ({ variant }) => {
  // Compute the initial deck based on the variant. Fallback to an empty array if none exists.
  const getInitialDeck = () => {
    return variant && variant.getDefaultDeck ? variant.getDefaultDeck() : [];
  };

  const [cards, setCards] = useState(getInitialDeck());

  // Update the deck when the variant changes
  useEffect(() => {
    setCards(getInitialDeck());
  }, [variant]);

  const previewCard = (card) => {
    console.log("Previewing card:", card);
  };

  return (
    <TabContainer>
      <Typography variant="h5" gutterBottom>
        Card Library Manager
      </Typography>
      <Grid container spacing={2}>
        {cards.map((card) => (
          <Grid item key={card.id} xs={12} sm={6} md={4}>
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
          </Grid>
        ))}
      </Grid>
    </TabContainer>
  );
};

export default CardLibraryManager;
