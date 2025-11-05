import { Box } from '@mui/material';
import EChartsRenderer from './EChartsRenderer';
import ChartDetails from './ChartDetails';
import AIInsights from './AIInsights';
import FollowUpQuestions from './FollowUpQuestions';
import EmptyChartState from './EmptyChartState';

const ChartDisplay = ({ selectedChart, chartInstanceRef, onFollowUpClick }) => {
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

          <AIInsights insights={selectedChart.insights} />

          <FollowUpQuestions 
            questions={selectedChart.followUpQuestions}
            onQuestionClick={onFollowUpClick}
          />
        </Box>
      ) : (
        <EmptyChartState />
      )}
    </Box>
  );
};

export default ChartDisplay;
