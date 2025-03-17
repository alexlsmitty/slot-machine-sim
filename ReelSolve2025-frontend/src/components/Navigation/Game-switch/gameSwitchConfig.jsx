import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Menu, 
  MenuItem, 
  Button, 
  Typography, 
  Avatar,
  Divider,
  ListItemIcon,
  ListItemText,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  Casino as SlotsIcon,
  TableBar as TablesIcon,
  Style as BingoIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
// Import custom Poker SVG as a React component
import PokerIcon from '../../../assets/PokerSymbol';

// Define game types (stubs for Poker and Tables)
const gameTypes = [
  { 
    id: 'slots', 
    label: 'Slots', 
    icon: <SlotsIcon />,
    description: 'Configure slot games with reels, paylines, symbols, and bonus rounds.',
  },
  { 
    id: 'bingo', 
    label: 'Bingo', 
    icon: <BingoIcon />,
    description: 'Configure bingo games with custom cards, patterns, and bonuses.',
  },
  { 
    id: 'poker', 
    label: 'Poker', 
    icon: <Avatar sx={{ width: 28, height: 28 }}><PokerIcon /></Avatar>,
    description: 'Poker configuration is coming soon.',
  },
  { 
    id: 'tables', 
    label: 'Tables', 
    icon: <TablesIcon />,
    description: 'Table game configuration is coming soon.',
  }
];

const GameSwitchConfig = ({ currentGameType, setCurrentGameType, currentView, setCurrentView, navigationConfig }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingGameType, setPendingGameType] = useState(null);
  
  const open = Boolean(anchorEl);
  
  // Find the current game type object
  const currentGame = gameTypes.find(game => game.id === currentGameType) || gameTypes[0];

  useEffect(() => {
    // Load the last used game type from API or localStorage
    const loadLastGameType = async () => {
      try {
        if (window.api && window.api.getLastGameType) {
          const lastGameType = await window.api.getLastGameType();
          if (lastGameType && gameTypes.some(game => game.id === lastGameType)) {
            setCurrentGameType(lastGameType);
          }
        } else {
          const storedGameType = localStorage.getItem('lastGameType');
          if (storedGameType && gameTypes.some(game => game.id === storedGameType)) {
            setCurrentGameType(storedGameType);
          }
        }
      } catch (error) {
        console.error('Failed to load last game type:', error);
      }
    };
    loadLastGameType();
  }, [setCurrentGameType]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleGameTypeSelect = (gameType) => {
    handleClose();
    if (gameType === currentGameType) return; // Do nothing if we're already on that type

    // Check if the current view is present in the new game's navigation config
    const isViewCompatible = navigationConfig[gameType]?.some(item => item.id === currentView);
    if (isViewCompatible) {
      switchGameType(gameType);
    } else {
      // If not compatible, show the confirmation dialog
      setPendingGameType(gameType);
      setConfirmDialogOpen(true);
    }
  };

  const switchGameType = async (gameType) => {
    // Auto-save current state before switching (if available)
    if (window.api && window.api.autoSaveState) {
      try {
        await window.api.autoSaveState();
      } catch (error) {
        console.error('Failed to auto-save state:', error);
      }
    }
    
    setCurrentGameType(gameType);
    
    // Save new game type persistently
    if (window.api && window.api.saveLastGameType) {
      try {
        window.api.saveLastGameType(gameType);
      } catch (error) {
        console.error('Failed to save game type:', error);
      }
    } else {
      localStorage.setItem('lastGameType', gameType);
    }
    
    // Ensure current view is part of new navigation; otherwise, switch to first available view
    if (!navigationConfig[gameType]?.some(item => item.id === currentView)) {
      const firstViewId = navigationConfig[gameType]?.[0]?.id;
      if (firstViewId) {
        setCurrentView(firstViewId);
      }
    }
  };

  const handleConfirmSwitch = () => {
    setConfirmDialogOpen(false);
    if (pendingGameType) {
      switchGameType(pendingGameType);
    }
  };

  const handleCancelSwitch = () => {
    setConfirmDialogOpen(false);
    setPendingGameType(null);
  };

  return (
    <>
      <Button
        id="game-selector-button"
        aria-controls={open ? 'game-selector-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          color: 'white',
          background: 'rgba(124, 77, 255, 0.2)',
          borderRadius: '28px',
          '&:hover': {
            background: 'rgba(124, 77, 255, 0.3)',
          },
          px: 2,
          py: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32 }}>{currentGame.icon}</Avatar>
          <Typography>{currentGame.label}</Typography>
        </Box>
      </Button>
      
      <Menu
        id="game-selector-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'game-selector-button' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            width: 320,
            overflow: 'visible',
            borderRadius: '12px',
            background: 'var(--background-elevated)',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'var(--background-elevated)',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Typography sx={{ p: 2, pb: 1 }} color="text.secondary" variant="subtitle2">
          Select Game Type
        </Typography>
        <Divider />
        {gameTypes.map((game) => {
          const isSelected = currentGameType === game.id;
          return (
            <MenuItem 
              key={game.id}
              onClick={() => handleGameTypeSelect(game.id)}
              selected={isSelected}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 0.5,
                py: 1.5,
                px: 2,
                borderLeft: isSelected ? '3px solid var(--primary)' : '3px solid transparent',
                '&.Mui-selected': {
                  background: 'rgba(124, 77, 255, 0.08)',
                },
                '&:hover': {
                  background: 'rgba(124, 77, 255, 0.12)',
                },
              }}
            >
              <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                <ListItemIcon sx={{ minWidth: 38 }}>
                  <Avatar sx={{ width: 28, height: 28, bgcolor: isSelected ? 'primary.main' : 'action.selected' }}>
                    {game.icon}
                  </Avatar>
                </ListItemIcon>
                <ListItemText 
                  primary={game.label}
                  primaryTypographyProps={{ fontWeight: isSelected ? 600 : 400 }}
                />
                {isSelected && (
                  <Chip label="Active" size="small" color="primary" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ pl: 4.75 }}>
                {game.description}
              </Typography>
            </MenuItem>
          );
        })}
      </Menu>
      
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCancelSwitch}
        aria-labelledby="game-switch-dialog-title"
        aria-describedby="game-switch-dialog-description"
        PaperProps={{ sx: { borderRadius: '12px', background: 'var(--background-elevated)' } }}
      >
        <DialogTitle id="game-switch-dialog-title">Switch Game Type</DialogTitle>
        <DialogContent>
          <DialogContentText id="game-switch-dialog-description">
            Switching to {pendingGameType && gameTypes.find(game => game.id === pendingGameType)?.label} will adjust the available configuration options.
            The current view is not available in the new game type. Do you wish to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelSwitch} color="inherit">Cancel</Button>
          <Button onClick={handleConfirmSwitch} variant="contained" autoFocus>Continue</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GameSwitchConfig;