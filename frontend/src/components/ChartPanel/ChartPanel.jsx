import React from 'react';
import { Box } from '@mui/material';
import ChartPanelHeader from './ChartPanelHeader';
import ChartDisplay from './ChartDisplay';

const ChartPanel = ({ 
  selectedChart, 
  onDownload, 
  onFullscreen,
  chartInstanceRef,
  onFollowUpClick
}) => {
  return (
    <Box sx={{ 
      width: '40%', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: 'background.paper'
    }}>
      <ChartPanelHeader
        onDownload={onDownload}
        onFullscreen={onFullscreen}
        chartInstanceRef={chartInstanceRef}
        chartConfig={selectedChart?.chartConfig}
        disabled={!selectedChart}
      />
      <ChartDisplay 
        selectedChart={selectedChart}
        chartInstanceRef={chartInstanceRef}
        onFollowUpClick={onFollowUpClick}
      />
    </Box>
  );
};

export default ChartPanel;