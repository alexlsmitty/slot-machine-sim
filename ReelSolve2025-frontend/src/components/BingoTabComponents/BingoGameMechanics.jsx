import React, { useState } from 'react';

const BingoGameMechanics = () => {
  // ---------------------------
  // State variables for game mechanics
  // ---------------------------
  // 1. Game Rounds and Timing
  const [roundDuration, setRoundDuration] = useState(60); // seconds per round
  const [numberOfRounds, setNumberOfRounds] = useState(5);

  // 2. Payouts and Card Pricing
  const [cardPrice, setCardPrice] = useState(1.0);
  const [payoutMultiplier, setPayoutMultiplier] = useState(1.0);

  // 3. Progressive Jackpot Triggers
  const [progressiveJackpotTrigger, setProgressiveJackpotTrigger] = useState('');

  // 4. Game Mode Setting: 'single' for Video Bingo, 'multiplayer' for Online Bingo
  const [gameMode, setGameMode] = useState('single');

  // API endpoint for game mechanics configuration
  const API_URL = '/api/bingo/game-mechanics';

  // ---------------------------
  // Handler to submit game mechanics configuration
  // ---------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      rounds: {
        duration: roundDuration,
        count: numberOfRounds,
      },
      pricing: {
        cardPrice,
        payoutMultiplier,
      },
      progressiveJackpotTrigger,
      gameMode,
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const data = await response.json();
        alert('Game mechanics configuration saved successfully!');
      } else {
        alert('Failed to save game mechanics configuration.');
      }
    } catch (error) {
      console.error('Error saving game mechanics configuration:', error);
      alert('Error saving game mechanics configuration.');
    }
  };

  // ---------------------------
  // Render game mechanics configuration form
  // ---------------------------
  return (
    <div>
      <h2>Bingo Game Mechanics</h2>
      <form onSubmit={handleSubmit}>
        {/* 1. Game Rounds and Timing */}
        <div>
          <label>
            Round Duration (seconds):
            <input
              type="number"
              value={roundDuration}
              onChange={(e) => setRoundDuration(parseInt(e.target.value))}
              min="10"
            />
          </label>
        </div>
        <div>
          <label>
            Number of Rounds:
            <input
              type="number"
              value={numberOfRounds}
              onChange={(e) => setNumberOfRounds(parseInt(e.target.value))}
              min="1"
            />
          </label>
        </div>

        {/* 2. Payouts and Card Pricing */}
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
        <div>
          <label>
            Payout Multiplier:
            <input
              type="number"
              value={payoutMultiplier}
              onChange={(e) => setPayoutMultiplier(parseFloat(e.target.value))}
              step="0.1"
              min="1"
            />
          </label>
        </div>

        {/* 3. Progressive Jackpot Triggers */}
        <div>
          <label>
            Progressive Jackpot Trigger Conditions:
            <textarea
              value={progressiveJackpotTrigger}
              onChange={(e) => setProgressiveJackpotTrigger(e.target.value)}
              placeholder="Enter conditions to trigger progressive jackpot"
              rows="3"
              cols="50"
            />
          </label>
        </div>

        {/* 4. Game Mode Setting */}
        <div>
          <label>
            Game Mode:
            <select value={gameMode} onChange={(e) => setGameMode(e.target.value)}>
              <option value="single">Single Player (Video Bingo)</option>
              <option value="multiplayer">Multiplayer (Online Bingo)</option>
            </select>
          </label>
        </div>

        {/* 5. Save Game Mechanics */}
        <button type="submit">Save Game Mechanics</button>
      </form>
    </div>
  );
};

export default BingoGameMechanics;
