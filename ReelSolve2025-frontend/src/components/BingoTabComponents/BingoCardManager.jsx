import React, { useState } from 'react';

const BingoCardManager = () => {
  // --------------------------
  // State variables to store configuration details
  // --------------------------
  const [cardLayout, setCardLayout] = useState('75-ball'); // default layout
  const [numberArrangement, setNumberArrangement] = useState('');
  const [cardPrice, setCardPrice] = useState(1.0);
  const [cardQuantity, setCardQuantity] = useState(1);
  const [specialTypes, setSpecialTypes] = useState({
    wildCard: false,
    extraFreeSpaces: false,
  });

  // API endpoint for saving card configurations
  const API_URL = '/api/bingo/cards';

  // --------------------------
  // Handlers for form changes
  // --------------------------
  const handleSpecialChange = (e) => {
    const { name, checked } = e.target;
    setSpecialTypes(prev => ({ ...prev, [name]: checked }));
  };

  // --------------------------
  // Handler for form submission to save configuration
  // --------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      cardLayout,
      numberArrangement,
      cardPrice,
      cardQuantity,
      specialTypes,
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const data = await response.json();
        alert('Card configuration saved successfully!');
        // Optionally update UI or reset form fields here.
      } else {
        alert('Failed to save card configuration.');
      }
    } catch (error) {
      console.error('Error saving card configuration:', error);
      alert('Error saving card configuration.');
    }
  };

  // --------------------------
  // Render the form for card configuration
  // --------------------------
  return (
    <div>
      <h2>Bingo Card Manager</h2>
      <form onSubmit={handleSubmit}>
        {/* 1. Card Layout Selection */}
        <div>
          <label>
            Card Layout:
            <select value={cardLayout} onChange={(e) => setCardLayout(e.target.value)}>
              <option value="75-ball">75-ball</option>
              <option value="90-ball">90-ball</option>
              {/* Additional layouts can be added here */}
            </select>
          </label>
        </div>

        {/* 2. Number Arrangement */}
        <div>
          <label>
            Number Arrangement (JSON or custom format):
            <textarea
              value={numberArrangement}
              onChange={(e) => setNumberArrangement(e.target.value)}
              placeholder="Enter number arrangement details"
              rows={4}
              cols={50}
            />
          </label>
        </div>

        {/* 3. Card Price */}
        <div>
          <label>
            Card Price:
            <input
              type="number"
              value={cardPrice}
              onChange={(e) => setCardPrice(parseFloat(e.target.value))}
              step="0.01"
              min="0"
            />
          </label>
        </div>

        {/* 4. Card Quantity */}
        <div>
          <label>
            Card Quantity:
            <input
              type="number"
              value={cardQuantity}
              onChange={(e) => setCardQuantity(parseInt(e.target.value))}
              min="1"
            />
          </label>
        </div>

        {/* 5. Special Card Types */}
        <div>
          <label>
            <input
              type="checkbox"
              name="wildCard"
              checked={specialTypes.wildCard}
              onChange={handleSpecialChange}
            />
            Wild Card
          </label>
          <label>
            <input
              type="checkbox"
              name="extraFreeSpaces"
              checked={specialTypes.extraFreeSpaces}
              onChange={handleSpecialChange}
            />
            Extra Free Spaces
          </label>
        </div>

        {/* 6. Save Button */}
        <button type="submit">Save Card Configuration</button>
      </form>
    </div>
  );
};

export default BingoCardManager;
