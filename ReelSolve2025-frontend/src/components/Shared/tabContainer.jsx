import React from 'react';
import { Box } from '@mui/material';

const TabContainer = ({ children }) => {
  return (
    <Box
      sx={{
        borderRadius: 2,
        boxShadow: 'var(--shadow-soft)',
        bgcolor: 'var(--background-primary)',
        p: 3,
        mb: 4,
      }}
    >
      {children}
    </Box>
  );
};

export default TabContainer;