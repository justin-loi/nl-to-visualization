import React from 'react';
import { Box } from '@mui/material';
import ChartPanelHeader from './ChartPanelHeader';
import ChartDisplay from './ChartDisplay';

const ChartPanel = ({ 
  selectedChart, 
  onDownload, 
  onRefresh, 
  onFullscreen,
  chartInstanceRef
}) => {
  return (
    <Box sx={{ 
      width: '40%', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: 'background.paper'
    }}>
      <ChartPanelHeader
        onRefresh={onRefresh}
        onDownload={onDownload}
        onFullscreen={onFullscreen}
        disabled={!selectedChart}
      />
      <ChartDisplay 
        selectedChart={selectedChart}
        chartInstanceRef={chartInstanceRef}
      />
    </Box>
  );
};

export default ChartPanel;