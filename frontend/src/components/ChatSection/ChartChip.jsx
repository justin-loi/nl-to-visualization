import React from 'react';
import { Chip } from '@mui/material';
import { BarChart } from '@mui/icons-material';

const ChartChip = ({ onClick, label = 'View Chart' }) => {
  return (
    <Chip
      icon={<BarChart />}
      label={label}
      onClick={onClick}
      size="small"
      sx={{ 
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': { bgcolor: 'action.hover' }
      }}
    />
  );
};

export default ChartChip;