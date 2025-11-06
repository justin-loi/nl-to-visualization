import { Box, Chip, Typography } from '@mui/material';
import { TrendingUp, PieChart, Timeline, BarChart } from '@mui/icons-material';

const QuickStartPrompts = ({ onPromptClick, show = true }) => {
  const prompts = [
    { text: 'Show monthly Tesla vehicle sales trends over the past year', icon: TrendingUp, color: '#1976d2' },
    { text: 'Compare Tesla expenses by category for this quarter', icon: PieChart, color: '#9c27b0' },
    { text: 'Plot Tesla daily revenue as a time series line chart', icon: Timeline, color: '#2e7d32' },
    { text: 'Create a bar chart showing Tesla vehicle sales by region', icon: BarChart, color: '#ed6c02' },
  ];

  if (!show) return null;

  return (
    <Box sx={{ px: 3, py: 2, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
        Quick Start
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {prompts.map((prompt, index) => (
          <Chip
            key={index}
            icon={<prompt.icon sx={{ fontSize: 18 }} />}
            label={prompt.text}
            onClick={() => onPromptClick(prompt.text)}
            sx={{
              bgcolor: 'background.default',
              '&:hover': { bgcolor: 'action.hover' },
              borderColor: prompt.color,
              border: '1px solid',
              color: 'text.primary'
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default QuickStartPrompts;