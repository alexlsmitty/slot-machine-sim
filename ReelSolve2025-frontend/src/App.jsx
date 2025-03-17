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
// Import components... (Slots first)
import {
  ReelMatrix,
  SymbolManager,
  PaylineConfiguration,
  RulesetManager,
  BonusManager,
  ConfigurationManager
} from './components/Components-main';
import { 
  NavigationDrawer,
  GameSwitchConfig,
  SectionHeader,
  navigationConfig 
} from '@components/Navigation';
// Import bingo components
import { 
  BingoCardManager,
  BingoPatternManager, 
  BingoBonusFeatures, 
  BingoGameMechanics } from './components/Bingo-components';
// Import poker components
import {
  GameVariantSelector,
  CardLibraryManager,
  BonusAndSideBetManager,
  RNGConfigurator
} from './components/vPoker-components';
import { PaytableConfig } from './components/Components-main';
// Import the contexts and utils components/files
import { GameProvider, useVideoPoker } from '@contexts/GameContexts';
import RTPCalculator from './utils/Rtp-Calc/RTPCalculator';
import FlaskApiTest from '@Flask/flaskApiTest';

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
          return <PaylineConfiguration />;
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