import { useCallback } from 'react';

const useChartDownload = (chartInstanceRef) => {
  const downloadChart = useCallback(() => {
    if (chartInstanceRef.current) {
      const url = chartInstanceRef.current.getDataURL({
        type: 'png',
        backgroundColor: '#fff'
      });
      const link = document.createElement('a');
      link.download = `chart-${Date.now()}.png`;
      link.href = url;
      link.click();
    }
  }, [chartInstanceRef]);

  return downloadChart;
};

export default useChartDownload;