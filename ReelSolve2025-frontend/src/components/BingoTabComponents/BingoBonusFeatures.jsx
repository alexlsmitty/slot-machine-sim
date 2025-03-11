import React, { useState } from 'react';

const BingoBonusFeatures = () => {
  // ---------------------------
  // State variables for bonus features
  // ---------------------------
  const [freeCardsEnabled, setFreeCardsEnabled] = useState(false);
  const [freeCardsCount, setFreeCardsCount] = useState(0);

  const [multiplierBallsEnabled, setMultiplierBallsEnabled] = useState(false);
  const [multiplierValue, setMultiplierValue] = useState(1);

  const [bonusMiniGamesEnabled, setBonusMiniGamesEnabled] = useState(false);
  const [bonusMiniGameDetails, setBonusMiniGameDetails] = useState('');

  const [progressiveJackpotEnabled, setProgressiveJackpotEnabled] = useState(false);
  const [jackpotThreshold, setJackpotThreshold] = useState(0);

  // API endpoint for bonus features configuration
  const API_URL = '/api/bingo/bonus-features';

  // ---------------------------
  // Handler to submit bonus features configuration to the backend
  // ---------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      freeCards: {
        enabled: freeCardsEnabled,
        count: freeCardsEnabled ? freeCardsCount : 0,
      },
      multiplierBalls: {
        enabled: multiplierBallsEnabled,
        multiplier: multiplierBallsEnabled ? multiplierValue : 1,
      },
      bonusMiniGames: {
        enabled: bonusMiniGamesEnabled,
        details: bonusMiniGamesEnabled ? bonusMiniGameDetails : '',
      },
      progressiveJackpot: {
        enabled: progressiveJackpotEnabled,
        threshold: progressiveJackpotEnabled ? jackpotThreshold : 0,
      },
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const data = await response.json();
        alert('Bonus features configuration saved successfully!');
      } else {
        alert('Failed to save bonus features configuration.');
      }
    } catch (error) {
      console.error('Error saving bonus features configuration:', error);
      alert('Error saving bonus features configuration.');
    }
  };

  // ---------------------------
  // Render bonus features configuration form
  // ---------------------------
  return (
    <div>
      <h2>Bingo Bonus Features</h2>
      <form onSubmit={handleSubmit}>
        {/* 1. Free Cards */}
        <div>
          <label>
            <input
              type="checkbox"
              checked={freeCardsEnabled}
              onChange={(e) => setFreeCardsEnabled(e.target.checked)}
            />
            Enable Free Cards
          </label>
          {freeCardsEnabled && (
            <div>
              <label>
                Number of Free Cards:
                <input
                  type="number"
                  value={freeCardsCount}
                  onChange={(e) => setFreeCardsCount(parseInt(e.target.value))}
                  min="0"
                />
              </label>
            </div>
          )}
        </div>

        {/* 2. Multiplier Balls */}
        <div>
          <label>
            <input
              type="checkbox"
              checked={multiplierBallsEnabled}
              onChange={(e) => setMultiplierBallsEnabled(e.target.checked)}
            />
            Enable Multiplier Balls
          </label>
          {multiplierBallsEnabled && (
            <div>
              <label>
                Multiplier Value:
                <input
                  type="number"
                  value={multiplierValue}
                  onChange={(e) => setMultiplierValue(parseFloat(e.target.value))}
                  step="0.1"
                  min="1"
                />
              </label>
            </div>
          )}
        </div>

        {/* 3. Bonus Mini-Games */}
        <div>
          <label>
            <input
              type="checkbox"
              checked={bonusMiniGamesEnabled}
              onChange={(e) => setBonusMiniGamesEnabled(e.target.checked)}
            />
            Enable Bonus Mini-Games
          </label>
          {bonusMiniGamesEnabled && (
            <div>
              <label>
                Mini-Game Details:
                <textarea
                  value={bonusMiniGameDetails}
                  onChange={(e) => setBonusMiniGameDetails(e.target.value)}
                  placeholder="Enter details or description of bonus mini-games"
                  rows="3"
                  cols="50"
                />
              </label>
            </div>
          )}
        </div>

        {/* 4. Progressive Jackpot */}
        <div>
          <label>
            <input
              type="checkbox"
              checked={progressiveJackpotEnabled}
              onChange={(e) => setProgressiveJackpotEnabled(e.target.checked)}
            />
            Enable Progressive Jackpot
          </label>
          {progressiveJackpotEnabled && (
            <div>
              <label>
                Jackpot Threshold:
                <input
                  type="number"
                  value={jackpotThreshold}
                  onChange={(e) => setJackpotThreshold(parseFloat(e.target.value))}
                  step="0.01"
                  min="0"
                />
              </label>
            </div>
          )}
        </div>

        {/* 5. Save Bonus Features */}
        <button type="submit">Save Bonus Features</button>
      </form>
    </div>
  );
};

export default BingoBonusFeatures;
