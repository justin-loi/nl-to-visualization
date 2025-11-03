import React from 'react';
import { Box } from '@mui/material';
import EChartsRenderer from './EChartsRenderer';
import ChartDetails from './ChartDetails';
import EmptyChartState from './EmptyChartState';

const ChartDisplay = ({ selectedChart, chartInstanceRef }) => {
  return (
    <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
      {selectedChart?.chartConfig ? (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <EChartsRenderer 
            chartConfig={selectedChart.chartConfig}
            chartInstanceRef={chartInstanceRef}
          />
          <ChartDetails 
            type={selectedChart.chartConfig.type}
            title={selectedChart.chartConfig.title}
            timestamp={selectedChart.timestamp}
          />
        </Box>
      ) : (
        <EmptyChartState />
      )}
    </Box>
  );
};

export default ChartDisplay;
