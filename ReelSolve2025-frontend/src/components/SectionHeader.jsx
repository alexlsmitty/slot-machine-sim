import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const SectionHeader = ({ title, action }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--background-elevated)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <Typography 
        variant="h5" 
        sx={{ 
          color: 'var(--text-primary)',
          fontWeight: 600,
          letterSpacing: '-0.02em',
        }}
      >
        {title}
      </Typography>
      {action && (
        <Box>
          {action}
        </Box>
      )}
    </Paper>
  );
};

export default SectionHeader;