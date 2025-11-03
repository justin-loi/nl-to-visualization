import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { Refresh, Download, Fullscreen } from '@mui/icons-material';
import ChartActions from './ChartActions';

const ChartPanelHeader = ({ 
  onRefresh, 
  onDownload, 
  onFullscreen, 
  disabled = false 
}) => {
  const actions = [
    { icon: Refresh, onClick: onRefresh, tooltip: 'Refresh', disabled: false },
    { icon: Download, onClick: onDownload, tooltip: 'Download', disabled },
    { icon: Fullscreen, onClick: onFullscreen, tooltip: 'Fullscreen', disabled }
  ];

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        px: 3, 
        py: 2, 
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Chart Visualization
        </Typography>
        <ChartActions actions={actions} />
      </Box>
    </Paper>
  );
};

export default ChartPanelHeader;
