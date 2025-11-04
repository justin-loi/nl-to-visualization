import './App.css';
import ChatbotChartUI from './components/ChatbotChartUI';

function App() {
  // Determine backend base URL
  const apiBase =
  process.env.REACT_APP_BACKEND_URL ||
  (window.location.hostname === 'localhost'
    ? `http://localhost:${process.env.REACT_APP_BACKEND_PORT || 3001}`
    : `http://backend:${process.env.REACT_APP_BACKEND_PORT || 3001}`);
  
  // Function to call /api/chat endpoint and generate chart
  const handleChartGenerate = async (userMessage) => {
    try {
      // Call your API endpoint
      const response = await fetch(`${apiBase}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      // Parse the response
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Chart generation failed');
      }

      // Extract clean text message (remove markdown code blocks if present)
      let textMessage = data.message || 'Chart generated successfully';
      textMessage = textMessage.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      if (textMessage.startsWith('{') || textMessage.startsWith('[')) {
        textMessage = 'Here is your chart visualization based on the data.';
      }

      // Build the chart config from the API response
      const chartConfig = data.chart
        ? {
            type: data.chart.series?.[0]?.type || 'bar',
            title: data.chart.title?.text || 'Chart',
            option: data.chart,
          }
        : null;

      return {
        text: textMessage,
        chartConfig: chartConfig,
      };
    } catch (error) {
      console.error('Error calling /api/chat:', error);

      const errorMsg = error.message || '';
      
      // Handle specific error cases with directive messaging
      if (errorMsg.includes('Invalid chart configuration') || 
          errorMsg.includes('expected array, received undefined')) {
        return {
          text: 'I need chart details to create a visualization. Please specify: (1) chart type (bar, line, pie, etc.), (2) data values, and (3) labels. Example: "Create a bar chart showing sales: Q1=100, Q2=150, Q3=200, Q4=175"',
          chartConfig: null,
        };
      }

      if (errorMsg.includes('API error: 400')) {
        return {
          text: 'Your request format is invalid. Please provide a clear chart description including the type of chart and the data you want to visualize.',
          chartConfig: null,
        };
      }

      if (errorMsg.includes('API error: 500')) {
        return {
          text: 'The server encountered an error processing your chart. Try simplifying your request or use a different chart type (bar, line, pie, scatter, area).',
          chartConfig: null,
        };
      }

      if (errorMsg.includes('API error: 503') || errorMsg.includes('Failed to fetch')) {
        return {
          text: 'Unable to connect to the chart service. Please check your internet connection and try again in a moment.',
          chartConfig: null,
        };
      }

      // Default error with actionable guidance
      return {
        text: `Chart generation failed: ${error.message}. Please try: (1) simplifying your request, (2) specifying exact data values, or (3) choosing a standard chart type like bar, line, or pie.`,
        chartConfig: null,
      };
    }
  };

  // Function to send to record of User Message to DB
  const handleMessageSend = (message) => {
    console.log('User sent message:', message);
  };

  return (
    <div>
      <ChatbotChartUI 
        onChartGenerate={handleChartGenerate}
        onMessageSend={handleMessageSend}
        chatConfig={{
          title: 'Chart Assistant',
          subtitle: 'Ask me to visualize your data'
        }}
      />
    </div>
  );
}

export default App;