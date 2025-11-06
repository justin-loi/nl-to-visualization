import { Box } from '@mui/material';
import EChartsRenderer from '../EChartsRenderer/EChartsRenderer.jsx';
import ChartDetails from '../ChartDetails/ChartDetails.jsx';
import AIInsights from '../AIInsights/AIInsights.jsx';
import FollowUpQuestions from '../FollowUpQuestions/FollowUpQuestions.jsx';
import EmptyChartState from '../EmptyChartState/EmptyChartState.jsx';

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
