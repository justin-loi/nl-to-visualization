import React from 'react';
import { Box } from '@mui/material';
import { ActionButton } from '../shared/ActionButton';

export const ChartActions = ({ actions }) => {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      {actions.map((action, index) => (
        <ActionButton
          key={index}
          icon={action.icon}
          onClick={action.onClick}
          tooltip={action.tooltip}
          disabled={action.disabled}
        />
      ))}
    </Box>
  );
};