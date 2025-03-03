import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, ButtonGroup } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Header = () => {
  return (
    // AppBar creates a Material Design header
    <AppBar position="static">
      <Toolbar>
        {/* IconButton for potential menu navigation */}
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        {/* Title text using Typography */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ReelSolve 2025
        </Typography>
        {/* Example button (e.g., for Login) */}
        <ButtonGroup variant="contained" aria-label="outlined primary button group">
            <Button color="inherit">Slots</Button>
            <Button color="inherit">Tables</Button>
            <Button color="inherit">Bingo</Button>
            <Button color="inherit">Scratch Cards</Button>
            <Button color="inherit">Lottery</Button>
        </ButtonGroup>
        
      </Toolbar>
    </AppBar>
  );
};

export default Header;
