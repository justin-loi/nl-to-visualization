import { Alert, AlertTitle, Box } from '@mui/material';
import { Lightbulb } from '@mui/icons-material';

const AIInsights = ({ insights }) => {
  if (!insights || insights.length === 0) return null;

  return (
    <Box sx={{ mt: 2 }}>
      {insights.map((insight, index) => (
        <Alert 
          key={index}
          severity="info" 
          icon={<Lightbulb />}
          sx={{ mb: 1 }}
        >
          <AlertTitle>AI Insight</AlertTitle>
          {insight}
        </Alert>
      ))}
    </Box>
  );
};

export default AIInsights;