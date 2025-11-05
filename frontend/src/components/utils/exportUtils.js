export const copyChartAsImage = async (chartInstance) => {
  if (!chartInstance) return false;
  
  try {
    const url = chartInstance.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#fff'
    });
    
    const response = await fetch(url);
    const blob = await response.blob();
    
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ]);
    
    return true;
  } catch (error) {
    console.error('Error copying image:', error);
    return false;
  }
};

export const downloadChartAsPNG = (chartInstance, filename = 'chart') => {
  if (!chartInstance) return false;
  
  try {
    const url = chartInstance.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#fff'
    });
    
    const link = document.createElement('a');
    link.download = `${filename}-${Date.now()}.png`;
    link.href = url;
    link.click();
    
    return true;
  } catch (error) {
    console.error('Error downloading PNG:', error);
    return false;
  }
};

export const exportChartAsJSON = (chartConfig, filename = 'chart-data') => {
  if (!chartConfig) return false;
  
  try {
    const jsonString = JSON.stringify(chartConfig, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = `${filename}-${Date.now()}.json`;
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Error exporting JSON:', error);
    return false;
  }
};

export const exportChartAsCSV = (chartConfig, filename = 'chart-data') => {
  if (!chartConfig || !chartConfig.option) return false;
  
  try {
    const option = chartConfig.option;
    const series = option.series?.[0];
    const xAxisData = option.xAxis?.data || [];
    const seriesData = series?.data || [];
    
    let csv = 'Category,Value\n';
    
    if (xAxisData.length > 0) {
      xAxisData.forEach((category, index) => {
        const value = seriesData[index]?.value || seriesData[index] || '';
        csv += `"${category}",${value}\n`;
      });
    } else if (series?.type === 'pie') {
      seriesData.forEach((item) => {
        csv += `"${item.name}",${item.value}\n`;
      });
    }
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = `${filename}-${Date.now()}.csv`;
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Error exporting CSV:', error);
    return false;
  }
};