import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tab,
  Tabs,
  Grid,
  Button,
  CircularProgress,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Paper,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Import game-specific calculators
import SlotRTPCalculator from './slotRTPCalculator';
import BingoRTPCalculator from './bingoRTPCalculator';
import TableGamesRTPCalculator from './tablesRTPCalculator';
import ArcadeRTPCalculator from './arcadeRTPCalculator';

// TabPanel component for tab content
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`rtp-tabpanel-${index}`}
      aria-labelledby={`rtp-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const RTPCalculator = ({ gameType = 'slots' }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState(null);
  const [calculationError, setCalculationError] = useState(null);
  const [rtpBreakdown, setRtpBreakdown] = useState([]);
  const [volatilityData, setVolatilityData] = useState([]);
  const [simulationOptions, setSimulationOptions] = useState({
    iterations: 100000,
    simType: 'theoretical',
    detailedBreakdown: false,
  });
  
  // Reference to the appropriate calculator based on game type
  const calculator = useMemo(() => {
    switch (gameType) {
      case 'bingo':
        return new BingoRTPCalculator();
      case 'tables':
        return new TableGamesRTPCalculator();
      case 'arcade':
        return new ArcadeRTPCalculator();
      case 'slots':
      default:
        return new SlotRTPCalculator();
    }
  }, [gameType]);

  useEffect(() => {
    // Reset state when game type changes
    setActiveTab(0);
    setResults(null);
    setCalculationError(null);
    setRtpBreakdown([]);
    setVolatilityData([]);
    
    // Get game-specific additional options and ensure all keys exist.
    const additionalOptions = {
      iterations: calculator.getDefaultIterations(),
      simType: calculator.getDefaultSimType(),
      detailedBreakdown: false,
      // Provide defaults for expected keys in the various calculators.
      includeFeatures: false,
      paylineAnalysis: false,
      symbolAnalysis: false,
      playerCount: 1,
      cardsPerPlayer: 1,
      includeJackpots: false,
      analysisType: 'single_game',
      ...calculator.getAdditionalOptions()
    };
    setSimulationOptions(additionalOptions);
  }, [gameType, calculator]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    setCalculationError(null);

    try {
      // Get appropriate configuration data based on game type
      const config = await calculator.getGameConfiguration();
      
      if (!config) {
        throw new Error("Failed to load game configuration");
      }

      // Calculate RTP using the appropriate calculator
      const calculationResults = await calculator.calculateRTP(
        config, 
        simulationOptions
      );
      
      setResults(calculationResults);
      setRtpBreakdown(calculationResults.breakdown || []);
      setVolatilityData(calculationResults.volatilityData || []);
    } catch (error) {
      console.error("RTP Calculation failed:", error);
      setCalculationError(error.message || "Failed to calculate RTP");
    } finally {
      setIsCalculating(false);
    }
  };

  const handleOptionChange = (key, value) => {
    setSimulationOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Color palette for charts
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F'];

  const renderConfigurationPanel = () => (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {`${gameType.charAt(0).toUpperCase() + gameType.slice(1)} RTP Simulation Settings`}
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={3}>
          {/* Common options across all game types */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Simulation Type</InputLabel>
              <Select
                value={simulationOptions.simType}
                onChange={(e) => handleOptionChange('simType', e.target.value)}
                label="Simulation Type"
              >
                <MenuItem value="theoretical">Theoretical (Mathematical)</MenuItem>
                <MenuItem value="monte_carlo">Monte Carlo Simulation</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              margin="normal"
              label="Iterations"
              type="number"
              value={simulationOptions.iterations}
              onChange={(e) => handleOptionChange('iterations', parseInt(e.target.value))}
              inputProps={{ min: 1000, step: 1000 }}
              disabled={simulationOptions.simType !== 'monte_carlo'}
            />
          </Grid>

          {/* Game-specific options rendered dynamically */}
          {calculator.renderGameSpecificOptions(simulationOptions, handleOptionChange)}

          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCalculate}
                disabled={isCalculating}
                sx={{ minWidth: 150 }}
              >
                {isCalculating ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Calculate RTP"
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderResultsPanel = () => {
    if (calculationError) {
      return (
        <Alert severity="error" sx={{ mb: 3 }}>
          {calculationError}
        </Alert>
      );
    }

    if (!results) {
      return (
        <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', mb: 3 }}>
          <Typography variant="body1" color="textSecondary">
            Run a calculation to see RTP results
          </Typography>
        </Paper>
      );
    }

    return (
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Calculation Results
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" component="div" gutterBottom>
                Overall RTP: {results.overall.toFixed(2)}%
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom>
                Volatility: {results.volatility}
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom>
                Hit Frequency: {results.hitFrequency.toFixed(2)}%
              </Typography>
              
              {/* Game-specific summary statistics */}
              {calculator.renderResultsSummary(results)}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={rtpBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {rtpBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => value.toFixed(2)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>

          {/* Game-specific detailed results */}
          {calculator.renderDetailedResults(results)}
        </CardContent>
      </Card>
    );
  };

  const renderVolatilityPanel = () => {
    if (!results || !volatilityData.length) {
      return (
        <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            Run a calculation to see volatility statistics
          </Typography>
        </Paper>
      );
    }

    return (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Hit Distribution and Volatility
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          {/* Common distribution chart */}
          <Box sx={{ height: 400, mb: 3 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volatilityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="frequency" fill="#8884d8" name="Win Frequency" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
          
          {/* Game-specific volatility charts */}
          {calculator.renderVolatilityDetails(volatilityData, results)}
        </CardContent>
      </Card>
    );
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        RTP Calculator - {gameType.charAt(0).toUpperCase() + gameType.slice(1)} Games
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="rtp calculator tabs">
          <Tab label="Configuration" />
          <Tab label="Results" />
          <Tab label="Volatility Analysis" />
        </Tabs>
      </Box>
      
      <TabPanel value={activeTab} index={0}>
        {renderConfigurationPanel()}
      </TabPanel>
      
      <TabPanel value={activeTab} index={1}>
        {renderResultsPanel()}
      </TabPanel>
      
      <TabPanel value={activeTab} index={2}>
        {renderVolatilityPanel()}
      </TabPanel>
    </Box>
  );
};

RTPCalculator.propTypes = {
  gameType: PropTypes.oneOf(['slots', 'bingo', 'tables', 'arcade']),
};

export default RTPCalculator;