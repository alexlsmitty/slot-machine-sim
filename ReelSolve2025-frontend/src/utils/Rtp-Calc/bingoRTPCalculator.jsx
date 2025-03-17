import React from 'react';
import {
  Grid2,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormControlLabel,
  Switch,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Card,
  CardContent,
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import BaseRTPCalculator from './baseRTPCalculator';

class BingoRTPCalculator extends BaseRTPCalculator {
  getDefaultIterations() {
    return 50000; // Bingo may need fewer iterations
  }
  
  getAdditionalOptions() {
    return {
      playerCount: 1,
      cardsPerPlayer: 4,
      includeJackpots: true,
      analysisType: 'single_game',
    };
  }
  
  async getGameConfiguration() {
    try {
      // This would be replaced with actual API calls
      // Since we don't have bingo-specific configurations yet, we'll use mock data
      
      // In a real implementation, you would use something like:
      // const bingoCardConfig = await window.api.getBingoCardConfig();
      // const bingoPatternConfig = await window.api.getBingoPatternConfig();
      
      return {
        cardPrice: 1.00,
        gameType: '75-ball',
        patterns: [
          { name: 'Single Line', prize: 5, probability: 0.052 },
          { name: 'Double Line', prize: 10, probability: 0.021 },
          { name: 'Full House', prize: 50, probability: 0.003 },
          { name: 'Corners', prize: 8, probability: 0.028 },
        ],
        progressiveJackpot: {
          enabled: true,
          startValue: 1000,
          increment: 0.01, // Per card sold
          triggerPattern: 'Full House in 30 calls or fewer',
          probability: 0.0001,
        },
        bonusFeatures: {
          freeCards: { enabled: true, probability: 0.05, value: 1 },
          multiplierBalls: { enabled: true, probability: 0.1, value: 2 }
        }
      };
    } catch (error) {
      console.error("Failed to load bingo configurations", error);
      throw new Error("Failed to load bingo configurations");
    }
  }
  
  async calculateRTP(config, options) {
    // For now, let's return a mock result
    try {
      // This would be replaced with actual calculation logic
      const mockResult = {
        overall: 85.21,
        volatility: "Low-Medium",
        hitFrequency: 15.73,
        baseGameRTP: 78.45,
        featuresRTP: 6.76,
        breakdown: [
          { name: 'Regular Wins', value: 78.45 },
          { name: 'Bonus Features', value: 4.32 },
          { name: 'Progressive Jackpot', value: 2.44 }
        ],
        volatilityData: [
          { name: '0x', frequency: 84.27 },
          { name: '1-5x', frequency: 12.35 },
          { name: '5-10x', frequency: 2.12 },
          { name: '10-50x', frequency: 1.15 },
          { name: '50-100x', frequency: 0.08 },
          { name: '100x+', frequency: 0.03 }
        ],
        patternStats: [
          { pattern: 'Single Line', hits: 2600, contribution: 37.64 },
          { pattern: 'Double Line', hits: 1050, contribution: 30.27 },
          { pattern: 'Full House', hits: 150, contribution: 21.69 },
          { pattern: 'Corners', hits: 1400, contribution: 10.40 },
        ],
        callDistribution: [
          { calls: '1-30', frequency: 0.02 },
          { calls: '31-40', frequency: 0.12 },
          { calls: '41-50', frequency: 0.35 },
          { calls: '51-60', frequency: 0.31 },
          { calls: '61-75', frequency: 0.20 },
        ],
        jackpotStats: {
          triggerProbability: 0.0001,
          averageValue: 2440.00,
          contribution: 2.44,
        }
      };
      
      return mockResult;
    } catch (error) {
      console.error("RTP calculation failed", error);
      throw new Error("Failed to calculate bingo RTP");
    }
  }
  
  renderGameSpecificOptions(options, handleOptionChange) {
    return (
      <>
        <Grid2 item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            margin="normal"
            label="Number of Players"
            type="number"
            value={options.playerCount}
            onChange={(e) => handleOptionChange('playerCount', parseInt(e.target.value))}
            inputProps={{ min: 1, max: 100 }}
          />
        </Grid2>
        <Grid2 item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            margin="normal"
            label="Cards Per Player"
            type="number"
            value={options.cardsPerPlayer}
            onChange={(e) => handleOptionChange('cardsPerPlayer', parseInt(e.target.value))}
            inputProps={{ min: 1, max: 10 }}
          />
        </Grid2>
        <Grid2 item xs={12} sm={6} md={4}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Analysis Type</InputLabel>
            <Select
              value={options.analysisType}
              onChange={(e) => handleOptionChange('analysisType', e.target.value)}
              label="Analysis Type"
            >
              <MenuItem value="single_game">Single Game</MenuItem>
              <MenuItem value="session">Session Analysis</MenuItem>
              <MenuItem value="progressive">Progressive Analysis</MenuItem>
            </Select>
          </FormControl>
        </Grid2>
        <Grid2 item xs={12} sm={6} md={4}>
          <FormControlLabel
            control={
              <Switch
                checked={options.includeJackpots}
                onChange={(e) => handleOptionChange('includeJackpots', e.target.checked)}
              />
            }
            label="Include Progressive Jackpots"
          />
        </Grid2>
      </>
    );
  }
  
  renderResultsSummary(results) {
    return (
      <>
        <Typography variant="body1" gutterBottom>
          Regular Wins RTP: {results.baseGameRTP.toFixed(2)}%
        </Typography>
        <Typography variant="body1" gutterBottom>
          Bonus Features RTP: {results.featuresRTP.toFixed(2)}%
        </Typography>
        {results.jackpotStats && (
          <Typography variant="body1" gutterBottom>
            Progressive Jackpot Contribution: {results.jackpotStats.contribution.toFixed(2)}%
          </Typography>
        )}
      </>
    );
  }
  
  renderDetailedResults(results) {
    if (!results.patternStats) return null;
    
    const [tabValue, setTabValue] = React.useState(0);
    
    const handleTabChange = (event, newValue) => {
      setTabValue(newValue);
    };
    
    return (
      <>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 4 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="bingo analysis tabs">
            <Tab label="Pattern Analysis" />
            <Tab label="Call Distribution" />
            <Tab label="Win Distribution" />
            {results.jackpotStats && <Tab label="Jackpot Analysis" />}
          </Tabs>
        </Box>
        
        {/* Pattern Analysis Tab */}
        {tabValue === 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Pattern Performance
            </Typography>
            
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Pattern</TableCell>
                    <TableCell align="right">Hits</TableCell>
                    <TableCell align="right">Contribution to RTP (%)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.patternStats.map((row) => (
                    <TableRow key={row.pattern}>
                      <TableCell component="th" scope="row">
                        {row.pattern}
                      </TableCell>
                      <TableCell align="right">{row.hits.toLocaleString()}</TableCell>
                      <TableCell align="right">{row.contribution.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Box sx={{ height: 300, mt: 4 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={results.patternStats}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="pattern" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="contribution" fill="#8884d8" name="RTP Contribution (%)" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        )}
        
        {/* Call Distribution Tab */}
        {tabValue === 1 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Call Distribution
            </Typography>
            
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Number of Calls</TableCell>
                    <TableCell align="right">Frequency (%)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.callDistribution.map((row) => (
                    <TableRow key={row.calls}>
                      <TableCell component="th" scope="row">
                        {row.calls}
                      </TableCell>
                      <TableCell align="right">{(row.frequency * 100).toFixed(2)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Box sx={{ height: 300, mt: 4 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={results.callDistribution.map(item => ({
                    calls: item.calls,
                    frequency: item.frequency * 100
                  }))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="calls" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="frequency" fill="#82ca9d" name="Frequency (%)" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        )}
        
        {/* Win Distribution Tab */}
        {tabValue === 2 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Win Distribution
            </Typography>
            
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Win Multiple</TableCell>
                    <TableCell align="right">Frequency (%)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.volatilityData.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.frequency.toFixed(2)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Box sx={{ height: 300, mt: 4 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={results.volatilityData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="frequency" fill="#8884d8" name="Frequency (%)" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        )}
        
        {/* Jackpot Analysis Tab */}
        {tabValue === 3 && results.jackpotStats && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Progressive Jackpot Analysis
            </Typography>
            
            <Card variant="outlined">
              <CardContent>
                <Grid2 container spacing={2}>
                  <Grid2 item xs={12} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Trigger Probability
                    </Typography>
                    <Typography variant="h6">
                      {(results.jackpotStats.triggerProbability * 100).toFixed(4)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      (1 in {Math.round(1 / results.jackpotStats.triggerProbability)})
                    </Typography>
                  </Grid2>
                  
                  <Grid2 item xs={12} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Average Jackpot Value
                    </Typography>
                    <Typography variant="h6">
                      ${results.jackpotStats.averageValue.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </Typography>
                  </Grid2>
                  
                  <Grid2 item xs={12} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      RTP Contribution
                    </Typography>
                    <Typography variant="h6">
                      {results.jackpotStats.contribution.toFixed(2)}%
                    </Typography>
                  </Grid2>
                </Grid2>
              </CardContent>
            </Card>
          </Box>
        )}
      </>
    );
  }
  
  // Add a bingo-specific method for estimating session length
  estimateSessionStats(options) {
    const cardCost = 1.00; // This would come from configuration
    const cardsTotal = options.playerCount * options.cardsPerPlayer;
    const gamesPerHour = 12; // Average for bingo
    
    return {
      costPerGame: cardCost * cardsTotal,
      gamesPerHour: gamesPerHour,
      costPerHour: cardCost * cardsTotal * gamesPerHour,
      expectedReturnPerHour: cardCost * cardsTotal * gamesPerHour * (this.state.results?.overall / 100)
    };
  }
  
  // Override to add bingo-specific session info
  renderAdditionalResults() {
    if (!this.state.results) return null;
    
    const sessionStats = this.estimateSessionStats(this.state.options);
    
    return (
      <Card variant="outlined" sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Session Estimates
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid2 container spacing={2}>
            <Grid2 item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" color="text.secondary">
                Cost per Game
              </Typography>
              <Typography variant="h6">
                ${sessionStats.costPerGame.toFixed(2)}
              </Typography>
            </Grid2>
            
            <Grid2 item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" color="text.secondary">
                Games per Hour
              </Typography>
              <Typography variant="h6">
                {sessionStats.gamesPerHour}
              </Typography>
            </Grid2>
            
            <Grid2 item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" color="text.secondary">
                Hourly Cost
              </Typography>
              <Typography variant="h6">
                ${sessionStats.costPerHour.toFixed(2)}
              </Typography>
            </Grid2>
            
            <Grid2 item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" color="text.secondary">
                Expected Return/Hour
              </Typography>
              <Typography variant="h6">
                ${sessionStats.expectedReturnPerHour?.toFixed(2) || "N/A"}
              </Typography>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>
    );
  }
}

export default BingoRTPCalculator;