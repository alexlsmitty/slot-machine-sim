// Footer.jsx
import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    // Box is used as the footer container with responsive styling
    <Box 
      component="footer" 
      sx={{ 
        py: 2, // vertical padding
        px: 2, // horizontal padding
        mt: 'auto', // pushes footer to the bottom of the page
        backgroundColor: (theme) => 
          theme.palette.mode === 'light' 
            ? theme.palette.grey[200] 
            : theme.palette.grey[800], // dynamic background based on theme mode
      }}
    >
      {/* Footer main text */}
      <Typography variant="body1" align="center">
        Slot Machine Optimization Tool © {new Date().getFullYear()}
      </Typography>
      {/* Attribution and tech stack info */}
      <Typography variant="body2" color="text.secondary" align="center">
        {'Built with '}
        <Link color="inherit" href="https://reactjs.org/">
          React
        </Link>
        {', '}
        <Link color="inherit" href="https://mui.com/">
          Material-UI
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;
