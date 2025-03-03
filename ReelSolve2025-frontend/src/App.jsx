import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Breadcrumbs,
  Button,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Toolbar,
  Typography
} from '@mui/material';
import {
  Apps as AppsIcon,
  Settings as SettingsIcon,
  ShowChart as LineChartIcon,
  Save as SaveIcon,
  PlayCircle as PlayCircleIcon,
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
  Gavel as GavelIcon
} from '@mui/icons-material';

import ReelMatrix from './components/ReelMatrix';
import SymbolManager from './components/SymbolManager';
import PaylineConfig from './components/PaylineConfig';
import RulesetManager from './components/RulesetManager'; // new component

const drawerWidth = 240;

const App = () => {
  // Holds the currently selected component
  const [selectedMenu, setSelectedMenu] = useState('reel');
  const [reelConfig, setReelConfig] = useState(null);
  const [open, setOpen] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Function for saving reel config (stub for Electron backend)
  const saveToDatabase = async (config) => {
    try {
      console.log('Saved config:', config);
      setSnackbar({
        open: true,
        message: 'Configuration saved to database',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving config:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save configuration',
        severity: 'error'
      });
    }
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // Called when ReelMatrix saves its configuration
  const handleSaveReelConfig = (config) => {
    setReelConfig(config);
    saveToDatabase(config);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Dynamic breadcrumb text mapping based on selected menu
  const breadcrumbText = {
    reel: "Reel Setup",
    symbol: "Symbol Setup",
    payline: "Payline Configuration",
    rules: "Ruleset Manager",
    simulation: "Simulation"
  }[selectedMenu];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar 
        position="fixed" 
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            ReelSolve 2025
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: 1, 
            justifyContent: 'flex-end' 
          }}
        >
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {/* Reel Configuration */}
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedMenu === 'reel'}
              onClick={() => setSelectedMenu('reel')}
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Reel Configuration" />
            </ListItemButton>
          </ListItem>
          {/* Symbol Setup */}
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedMenu === 'symbol'}
              onClick={() => setSelectedMenu('symbol')}
            >
              <ListItemIcon>
                <AppsIcon />
              </ListItemIcon>
              <ListItemText primary="Symbol Setup" />
            </ListItemButton>
          </ListItem>
          {/* Payline Configuration */}
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedMenu === 'payline'}
              onClick={() => setSelectedMenu('payline')}
            >
              <ListItemIcon>
                <LineChartIcon />
              </ListItemIcon>
              <ListItemText primary="Paylines" />
            </ListItemButton>
          </ListItem>
          {/* Ruleset Manager */}
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedMenu === 'rules'}
              onClick={() => setSelectedMenu('rules')}
            >
              <ListItemIcon>
                <GavelIcon />
              </ListItemIcon>
              <ListItemText primary="Ruleset Manager" />
            </ListItemButton>
          </ListItem>
          {/* Simulation (Placeholder) */}
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedMenu === 'simulation'}
              onClick={() => setSelectedMenu('simulation')}
            >
              <ListItemIcon>
                <PlayCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Simulation" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3,
          marginLeft: open ? `${drawerWidth}px` : 0,
          transition: (theme) => theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar />
        <Breadcrumbs aria-label="breadcrumb" sx={{ my: 2 }}>
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Link underline="hover" color="inherit" href="/">
            Slot Configuration
          </Link>
          <Typography color="text.primary">{breadcrumbText}</Typography>
        </Breadcrumbs>

        {/* Conditionally render components based on the selected menu */}
        <Box sx={{ mt: 2 }}>
          {selectedMenu === 'reel' && (
            <ReelMatrix onSave={handleSaveReelConfig} initialConfig={reelConfig} />
          )}
          {selectedMenu === 'symbol' && <SymbolManager />}
          {selectedMenu === 'payline' && <PaylineConfig />}
          {selectedMenu === 'rules' && <RulesetManager />}
          {selectedMenu === 'simulation' && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h5">Simulation Component Coming Soon</Typography>
            </Box>
          )}
        </Box>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
      />
    </Box>
  );
};

export default App;
