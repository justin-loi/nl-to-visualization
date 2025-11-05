import { Box, Chip, Typography } from '@mui/material';
import { TrendingUp, PieChart, Timeline, BarChart } from '@mui/icons-material';

const QuickStartPrompts = ({ onPromptClick, show = true }) => {
  const prompts = [
    { text: 'Show me sales trends', icon: TrendingUp, color: '#1976d2' },
    { text: 'Compare expenses by categories', icon: PieChart, color: '#9c27b0' },
    { text: 'Plot time series', icon: Timeline, color: '#2e7d32' },
    { text: 'Create bar chart', icon: BarChart, color: '#ed6c02' },
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