import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CircularProgress,
  Button,
  Alert,
  Divider
} from '@mui/material';
import { CheckCircle, Error } from '@mui/icons-material';

const FlaskApiTest = () => {
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testApiConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Use the exposed API in preload script
      const response = await window.api.flaskApiTest();
      
      if (response.error) {
        setError(response.message);
      } else {
        setApiResponse(response);
      }
    } catch (err) {
      setError(`Failed to connect to API: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Test API connection when component mounts
    testApiConnection();
  }, []);

  return (
    <Card variant="outlined" sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Flask API Connection Test
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={24} sx={{ mr: 1 }} />
            <Typography>Testing API connection...</Typography>
          </Box>
        ) : error ? (
          <Alert 
            severity="error" 
            icon={<Error fontSize="inherit" />}
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        ) : apiResponse ? (
          <Box sx={{ my: 2 }}>
            <Alert 
              severity="success" 
              icon={<CheckCircle fontSize="inherit" />}
              sx={{ mb: 2 }}
            >
              API Connection Successful!
            </Alert>
            
            <Typography variant="h6" gutterBottom>
              Response from Flask:
            </Typography>
            
            <Box sx={{ 
              bgcolor: 'background.paper', 
              p: 2, 
              borderRadius: 1,
              boxShadow: '0 0 10px rgba(0,0,0,0.05)',
              overflowX: 'auto'
            }}>
              <pre style={{ margin: 0 }}>
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </Box>
          </Box>
        ) : null}
        
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Button 
            variant="contained" 
            onClick={testApiConnection} 
            disabled={loading}
          >
            Test Connection Again
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FlaskApiTest;