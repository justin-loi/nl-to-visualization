import React from 'react';
import { BarChart } from '@mui/icons-material';
import EmptyState from '../shared/EmptyState';

const EmptyChartState = () => {
  return (
    <EmptyState
      icon={BarChart}
      title="No Chart Selected"
      description="Start a conversation and request a chart visualization. Your charts will appear here."
    />
  );
};

export default EmptyChartState;