import React, { useState } from 'react';
import {
  Box, AppBar, Toolbar, Typography,
  useMediaQuery, useTheme
} from '@mui/material';
import {
  Casino as CasinoIcon,
  ViewModule as ReelIcon,
  Payments as PaylineIcon,
  Settings as RulesetIcon,
  Stars as BonusIcon,
  Calculate as RTPCalculatorIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Api as ApiIcon
} from '@mui/icons-material';
import './App.css';
// Import components...
import ReelMatrix from './components/Components-main/ReelMatrix';
import SymbolManager from './components/Components-main/SymbolManager';
import PaylineConfig from './components/Components-main/ConfigurationManager';
import RulesetManager from './components/Components-main/RulesetComponents/RulesetManager';
import BonusManager from './components/Components-main/BonusManager';
import RTPCalculator from './utils/Rtp-Calc/RTPCalculator';
import ConfigurationManager from './components/Components-main/ConfigurationManager';
import FlaskApiTest from './components/flaskApiTest';
import { 
  NavigationDrawer,
  GameSwitchConfig,
  SectionHeader,
  navigationConfig 
} from '@components/Navigation';
import BingoPatternManager from './components/Bingo-components/BingoPatternManager';
import BingoGameMechanics from './components/Bingo-components/BingoGameMechanics';
import BingoCardManager from './components/Bingo-components/BingoCardManager';
import BingoBonusFeatures from './components/Bingo-components/BingoBonusFeatures';
// Import poker components
import GameVariantSelector from './components/vPoker-components/gameVariantSelector';
import PaytableConfig from './components/Components-main/ConfigurationManager';
import BonusAndSideBetManager from './components/vPoker-components/bonusAndSideBetManager';
import CardLibraryManager from './components/vPoker-components/cardLibraryManager';
import RNGConfigurator from './components/vPoker-components/rngConfigurator';
// Import the unified GameProvider (replaces individual providers)
import { GameProvider, useVideoPoker } from '@contexts/GameContexts';

function App() {
  const [currentGameType, setCurrentGameType] = useState('slots');
  const [currentView, setCurrentView] = useState('reel'); // initial view for "slots"
  const [drawerOpen, setDrawerOpen] = useState(true);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleViewChange = (view) => {
    // Auto-save before changing view...
    setCurrentView(view);
    if (isSmallScreen) {
      setDrawerOpen(false);
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Update the renderView function to use contexts directly
  const renderView = () => {
    if (currentGameType === 'slots') {
      switch (currentView) {
        case 'reel':
          return <ReelMatrix />;
        case 'symbol':
          return <SymbolManager />;
        case 'payline':
          return <PaylineConfig />;
        case 'rules':
          return <RulesetManager />;
        case 'bonus':
          return <BonusManager />;
        case 'simulation':
          return <RTPCalculator gameType="slots" />;
        default:
          return <ReelMatrix />;
      }
    } else if (currentGameType === 'bingo') {
      switch (currentView) {
        case 'card':
          return <BingoCardManager />;
        case 'pattern':
          return <BingoPatternManager />;
        case 'bonus':
          return <BingoBonusFeatures />;
        case 'mechanics':
          return <BingoGameMechanics />;
        case 'simulation':
          return <RTPCalculator gameType="bingo" />;
        default:
          return <BingoPatternManager />;
      }
    } else if (currentGameType === 'poker') {
      switch (currentView) {
        case 'gamevariant':
          return <GameVariantSelector />;
        case 'card':
          return <CardLibraryManager />;
        case 'paytable':
          return <PaytableConfig />;
        case 'bonus':
          return <BonusAndSideBetManager />;
        case 'rngconfig':
          return <RNGConfigurator />;
        case 'simulation':
          return <RTPCalculator gameType="poker" />;
        default:
          return <GameVariantSelector />;
      }
    } else if (currentGameType === 'tables') {
      return <div>Table Configuration Coming Soon</div>;
    } else {
      return <div>Not Implemented</div>;
    }
  };

  const drawerWidth = 240;

  return (
    <GameProvider>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <AppBar position="fixed">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" noWrap>
              ReelSolve2025
            </Typography>
            {/* Render GameSwitchConfig here */}
            <GameSwitchConfig 
              currentGameType={currentGameType}
              setCurrentGameType={setCurrentGameType}
              currentView={currentView}
              setCurrentView={setCurrentView}
              navigationConfig={navigationConfig}
            />
          </Toolbar>
        </AppBar>
        <NavigationDrawer 
          open={drawerOpen}
          drawerWidth={drawerWidth}
          selectedMenu={currentView}
          onMenuSelect={handleViewChange}
          onDrawerOpen={toggleDrawer}
          onDrawerClose={() => setDrawerOpen(false)}
          gameType={currentGameType}
        />
        <Box 
          component="main" 
          sx={{ flexGrow: 1, p: 3, ml: isSmallScreen ? 0 : `${drawerWidth}px`, width: isSmallScreen ? '100%' : `calc(100% - ${drawerWidth}px)`, bgcolor: 'var(--background-primary)', minHeight: '100vh' }}
        >
          <Toolbar />
          <Box sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 'var(--shadow-soft)', mb: 4 }}>
            {renderView()}
          </Box>
        </Box>
      </Box>
    </GameProvider>
  );
}

export default App;