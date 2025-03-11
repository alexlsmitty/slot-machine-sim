import React, { useEffect, useState } from 'react';
import { 
  Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, 
  ListItemButton, ListItemIcon, ListItemText, IconButton, 
  useMediaQuery, useTheme, Tooltip
} from '@mui/material';
import {
  Casino as CasinoIcon,
  ViewModule as ReelIcon,
  Payments as PaylineIcon,
  Settings as RulesetIcon,
  Stars as BonusIcon,
  Calculate as RTPIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Api as ApiIcon  // Add this new import
} from '@mui/icons-material';
import './App.css';
import ReelMatrix from './components/MainTabComponents/ReelMatrix';
import SymbolManager from './components/MainTabComponents/SymbolManager';
import PaylineConfig from './components/MainTabComponents/PaylineConfig';
import RulesetManager from './components/MainTabComponents/RulesetComponents/RulesetManager';
import BonusManager from './components/MainTabComponents/BonusManager';
import RTPCalculator from './components/MainTabComponents/RTPCalculator';
import { SymbolLibraryProvider } from './components/MainTabComponents/SymbolLibraryContext';
import ConfigurationManager from './components/MainTabComponents/ConfigurationManager';
import FlaskApiTest from './components/FlaskApiTest';

function App() {
  const [currentView, setCurrentView] = useState('symbols');
  const [drawerOpen, setDrawerOpen] = useState(true);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [location, setLocation] = useState(window.location.pathname);

  // Auto-save when changing views
  useEffect(() => {
    // Save the current state when navigating away from a view
    return () => {
      if (window.api && window.api.quickSaveConfiguration) {
        window.api.quickSaveConfiguration().catch(error => {
          console.error('Error auto-saving:', error);
        });
      }
    };
  }, [currentView]);

  // Save navigation state
  useEffect(() => {
    if (window.api && window.api.saveNavigationState) {
      window.api.saveNavigationState({ currentView });
    }
  }, [currentView]);

  // Load navigation state on mount
  useEffect(() => {
    if (window.api && window.api.getNavigationState) {
      window.api.getNavigationState().then(state => {
        if (state && state.currentView) {
          setCurrentView(state.currentView);
        }
      });
    }
  }, []);

  // Auto-save when user navigates between components
  useEffect(() => {
    const handleRouteChange = () => {
      const newPath = window.location.pathname;
      
      if (newPath !== location) {
        // Route has changed, autosave the current state
        if (window.api && window.api.autoSaveState) {
          window.api.autoSaveState()
            .then(result => {
              if (!result.success) {
                console.warn('Auto-save failed:', result.error);
              }
            })
            .catch(err => {
              console.error('Auto-save error:', err);
            });
        }
        
        setLocation(newPath);
      }
    };

    // Listen for history changes
    window.addEventListener('popstate', handleRouteChange);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [location]);

  const handleViewChange = (view) => {
    // Auto-save before changing views
    if (window.api && window.api.quickSaveConfiguration) {
      window.api.quickSaveConfiguration().then(() => {
        setCurrentView(view);
        if (isSmallScreen) {
          setDrawerOpen(false);
        }
      }).catch(error => {
        console.error('Error saving before navigation:', error);
        // Still change the view even if save fails
        setCurrentView(view);
        if (isSmallScreen) {
          setDrawerOpen(false);
        }
      });
    } else {
      setCurrentView(view);
      if (isSmallScreen) {
        setDrawerOpen(false);
      }
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Update the renderView function

const renderView = () => {
  const view = (() => {
    switch (currentView) {
      case 'symbols':
        return <SymbolManager />;
      case 'reels':
        return <ReelMatrix />;
      case 'paylines':
        return <PaylineConfig />;
      case 'rules':
        return <RulesetManager />;
      case 'bonus':
        return <BonusManager />;
      case 'rtp':
        return <RTPCalculator />;
      case 'apitest':
        return <FlaskApiTest />;  // Add this new case
      default:
        return <SymbolManager />;
    }
  })();

  // Wrap with a fade-in effect for smoother transitions
  return (
    <Box
      sx={{
        animation: 'fadeIn 0.3s ease-in-out',
        '@keyframes fadeIn': {
          '0%': {
            opacity: 0,
          },
          '100%': {
            opacity: 1,
          },
        },
      }}
    >
      {view}
    </Box>
  );
};

  const drawerWidth = 240;

  return (
    <SymbolLibraryProvider>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* App Bar */}
        <AppBar 
          position="fixed" 
          sx={{ 
            zIndex: theme.zIndex.drawer + 1,
            backgroundImage: 'var(--gradient-header)',
            boxShadow: 'var(--shadow-glow)'
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isSmallScreen && (
                <IconButton
                  color="inherit"
                  aria-label="toggle drawer"
                  onClick={toggleDrawer}
                  edge="start"
                  sx={{ mr: 2 }}
                >
                  {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
                </IconButton>
              )}
              <CasinoIcon sx={{ mr: 1 }} />
              <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
                ReelSolve 2025
              </Typography>
            </Box>
            
            {/* Global Controls in the App Bar */}
            <ConfigurationManager />
          </Toolbar>
        </AppBar>

        {/* Navigation Drawer */}
        <Drawer
          variant={isSmallScreen ? "temporary" : "permanent"}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: 'var(--background-secondary)',
              backgroundImage: 'var(--gradient-sidebar)',
              border: 'none',
              boxShadow: 'var(--shadow-strong)',
              height: '100%', // Ensure full height
              position: isSmallScreen ? 'fixed' : 'relative', // Use fixed position on small screens
              zIndex: theme.zIndex.drawer,
            },
          }}
        >
          <Toolbar /> {/* Space for the app bar */}
          <Box sx={{ 
            overflow: 'auto', 
            p: 1, 
            height: '100%', // Ensure full height
            display: 'flex',
            flexDirection: 'column'
          }}>
            <List sx={{ flexGrow: 1 }}>
              {[
                { id: 'symbols', text: 'Symbol Manager', icon: <CasinoIcon /> },
                { id: 'reels', text: 'Reel Matrix', icon: <ReelIcon /> },
                { id: 'paylines', text: 'Payline Config', icon: <PaylineIcon /> },
                { id: 'rules', text: 'Ruleset Manager', icon: <RulesetIcon /> },
                { id: 'bonus', text: 'Bonus Manager', icon: <BonusIcon /> },
                { id: 'rtp', text: 'RTP Calculator', icon: <RTPIcon /> },
                { id: 'apitest', text: 'API Test', icon: <ApiIcon /> } // Add this new item
              ].map((item) => (
                <ListItem key={item.id} disablePadding>
                  <ListItemButton 
                    onClick={() => handleViewChange(item.id)}
                    selected={currentView === item.id}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* Main Content */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1,
            p: 3, // Add padding around all sides
            ml: isSmallScreen ? 0 : `${drawerWidth}px`, // Add left margin equal to drawer width on larger screens
            width: isSmallScreen ? '100%' : `calc(100% - ${drawerWidth}px)`, // Ensure proper width calculation
            bgcolor: 'var(--background-primary)',
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            minHeight: '100vh', // Ensure minimum height
            boxSizing: 'border-box', // Include padding in width calculations
          }}
        >
          <Toolbar /> {/* Space for the app bar */}
          <Box 
            sx={{ 
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: 'var(--shadow-soft)',
              mb: 4 // Add bottom margin to create space between content and viewport edge
            }}
          >
            {renderView()}
          </Box>
        </Box>
      </Box>
    </SymbolLibraryProvider>
  );
}

export default App;