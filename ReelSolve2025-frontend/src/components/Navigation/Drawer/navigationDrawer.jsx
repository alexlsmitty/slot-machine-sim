import React from 'react';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';

import { navigationConfig } from '../navigationConfig';

const NavigationDrawer = ({
  open,
  drawerWidth,
  selectedMenu,
  onMenuSelect,
  onDrawerOpen,
  onDrawerClose,
  gameType = 'slots' // default game type
}) => {
  const navItems = navigationConfig[gameType] || [];
  
  return (
    <>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'var(--background-secondary)',
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
            justifyContent: 'flex-end',
            p: 1,
          }}
        >
          <IconButton onClick={onDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {navItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                selected={selectedMenu === item.id}
                onClick={() => onMenuSelect(item.id)}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label || item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {!open && (
        <Box
          sx={{
            position: 'fixed',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1200,
          }}
        >
          <IconButton onClick={onDrawerOpen} className="nav-toggle-button">
            <MenuIcon />
          </IconButton>
        </Box>
      )}
    </>
  );
};

export default NavigationDrawer;