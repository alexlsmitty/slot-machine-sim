import React, { useState } from 'react';

const BingoPatternManager = () => {
  // ======================================================
  // PART 1: Winning Pattern Management
  // ======================================================
  // State for pattern configurations
  const [patternType, setPatternType] = useState('horizontal'); // Default pattern type
  const [patternDetails, setPatternDetails] = useState('');
  const [patternPayout, setPatternPayout] = useState(0);
  const [patternProbability, setPatternProbability] = useState(0);
  const [patterns, setPatterns] = useState([]);

  // API endpoint for saving pattern configurations
  const API_PATTERN_URL = '/api/bingo/patterns';

  // Handler to add a new pattern configuration locally
  const addPattern = () => {
    const newPattern = {
      type: patternType,
      details: patternDetails,
      payout: patternPayout,
      probability: patternProbability,
    };

    setPatterns([...patterns, newPattern]);

    // Reset the pattern input fields after adding the pattern
    setPatternDetails('');
    setPatternPayout(0);
    setPatternProbability(0);
  };

  // Handler for submitting all pattern configurations to the backend
  const handlePatternSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_PATTERN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patterns }),
      });
      if (response.ok) {
        const data = await response.json();
        alert('Patterns saved successfully!');
      } else {
        alert('Failed to save patterns.');
      }
    } catch (error) {
      console.error('Error saving patterns:', error);
      alert('Error saving patterns.');
    }
  };

  // ======================================================
  // PART 2: Ball Draw Mechanics Management
  // ======================================================
  // State for ball draw configurations:
  // - Ball count configuration (e.g., 75-ball, 90-ball)
  // - Draw speed settings (e.g., delay in seconds between draws)
  // - Special draw rules (custom rules for the draw process)
  // - Ball weighting/probability settings (custom weighting for balls)
  const [ballCount, setBallCount] = useState('75-ball');
  const [drawSpeed, setDrawSpeed] = useState(1.0);
  const [specialDrawRules, setSpecialDrawRules] = useState('');
  const [ballWeighting, setBallWeighting] = useState('');

  // API endpoint for saving ball draw configurations
  const API_DRAW_URL = '/api/bingo/draw';

  // Handler for submitting the ball draw configurations to the backend
  const handleDrawSubmit = async (e) => {
    e.preventDefault();
    const drawPayload = {
      ballCount,
      drawSpeed,
      specialDrawRules,
      ballWeighting,
    };

    try {
      const response = await fetch(API_DRAW_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(drawPayload),
      });
      if (response.ok) {
        const data = await response.json();
        alert('Draw settings saved successfully!');
      } else {
        alert('Failed to save draw settings.');
      }
    } catch (error) {
      console.error('Error saving draw settings:', error);
      alert('Error saving draw settings.');
    }
  };

  // ======================================================
  // RENDER: Combining the two configuration sections
  // ======================================================
  return (
    <div>
      <h2>Bingo Pattern Manager</h2>
      {/* ---- Winning Pattern Management Form ---- */}
      <form onSubmit={handlePatternSubmit}>
        {/* 1. Pattern Type Selection */}
        <div>
          <label>
            Pattern Type:
            <select value={patternType} onChange={(e) => setPatternType(e.target.value)}>
              <option value="horizontal">Horizontal Line</option>
              <option value="vertical">Vertical Line</option>
              <option value="diagonal">Diagonal Line</option>
              <option value="X">X Pattern</option>
              <option value="blackout">Blackout</option>
              <option value="corners">Corners</option>
              <option value="progressive">Progressive</option>
              {/* Additional pattern types can be added here */}
            </select>
          </label>
        </div>

        {/* 2. Additional Pattern Details */}
        <div>
          <label>
            Pattern Details (Description/Configuration):
            <textarea
              value={patternDetails}
              onChange={(e) => setPatternDetails(e.target.value)}
              placeholder="Enter pattern details or configuration"
              rows={3}
              cols={50}
            />
          </label>
        </div>

        {/* 3. Pattern Payout */}
        <div>
          <label>
            Pattern Payout:
            <input
              type="number"
              value={patternPayout}
              onChange={(e) => setPatternPayout(parseFloat(e.target.value))}
              step="0.01"
              min="0"
            />
          </label>
        </div>

        {/* 4. Pattern Probability */}
        <div>
          <label>
            Pattern Probability (in percentage):
            <input
              type="number"
              value={patternProbability}
              onChange={(e) => setPatternProbability(parseFloat(e.target.value))}
              step="0.01"
              min="0"
              max="100"
            />
          </label>
        </div>

        {/* 5. Button to Add Pattern to Local List */}
        <button type="button" onClick={addPattern}>Add Pattern</button>

        {/* 6. Displaying the List of Added Patterns */}
        {patterns.length > 0 && (
          <div>
            <h3>Added Patterns</h3>
            <ul>
              {patterns.map((pattern, index) => (
                <li key={index}>
                  <strong>Type:</strong> {pattern.type} | <strong>Payout:</strong> {pattern.payout} | <strong>Probability:</strong> {pattern.probability}% | <strong>Details:</strong> {pattern.details}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 7. Button to Save All Patterns */}
        <button type="submit">Save All Patterns</button>
      </form>

      <hr />

      <h2>Bingo Draw Mechanics</h2>
      {/* ---- Ball Draw Mechanics Form ---- */}
      <form onSubmit={handleDrawSubmit}>
        {/* 1. Ball Count Configuration */}
        <div>
          <label>
            Ball Count:
            <select value={ballCount} onChange={(e) => setBallCount(e.target.value)}>
              <option value="75-ball">75-ball</option>
              <option value="90-ball">90-ball</option>
              {/* Additional ball count options can be added here */}
            </select>
          </label>
        </div>

        {/* 2. Draw Speed Settings */}
        <div>
          <label>
            Draw Speed (seconds per draw):
            <input
              type="number"
              value={drawSpeed}
              onChange={(e) => setDrawSpeed(parseFloat(e.target.value))}
              step="0.1"
              min="0.1"
            />
          </label>
        </div>

        {/* 3. Special Draw Rules */}
        <div>
          <label>
            Special Draw Rules:
            <textarea
              value={specialDrawRules}
              onChange={(e) => setSpecialDrawRules(e.target.value)}
              placeholder="Enter any special rules for the draw"
              rows={3}
              cols={50}
            />
          </label>
        </div>

        {/* 4. Ball Weighting/Probability Settings */}
        <div>
          <label>
            Ball Weighting/Probability Settings (JSON or custom format):
            <textarea
              value={ballWeighting}
              onChange={(e) => setBallWeighting(e.target.value)}
              placeholder="Enter ball weighting details"
              rows={3}
              cols={50}
            />
          </label>
        </div>

        {/* 5. Button to Save Draw Settings */}
        <button type="submit">Save Draw Settings</button>
      </form>
    </div>
  );
};

export default BingoPatternManager;
