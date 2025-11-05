import React, { useRef, useEffect } from 'react';
import { Box, Paper } from '@mui/material';
import * as echarts from 'echarts';

const EChartsRenderer = ({ chartConfig, chartInstanceRef }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current && chartConfig?.option) {
      if (chartInstanceRef?.current) {
        chartInstanceRef.current.dispose();
      }
      
      const option = {
      ...chartConfig.option,
      title: {
        ...chartConfig.option.title,
        top: chartConfig.option?.title?.top ?? 10,
      },
      legend: {
        ...chartConfig.option.legend,
        top: chartConfig.option?.legend?.top ?? 60,
      },
      grid: {
        ...chartConfig.option.grid,
        top: chartConfig.option?.grid?.top ?? 100,
      },
    };

    const instance = echarts.init(chartRef.current);
    instance.setOption(option);
      
      if (chartInstanceRef) {
        chartInstanceRef.current = instance;
      }
      
      const handleResize = () => {
        instance?.resize();
      };
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        instance?.dispose();
      };
    }
  }, [chartConfig, chartInstanceRef]);

  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        bgcolor: 'background.default',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        minHeight: 400
      }}
    >
      <Box ref={chartRef} sx={{ width: '100%', height: '100%' }} />
    </Paper>
  );
};

export default EChartsRenderer;