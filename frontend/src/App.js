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

      // Check for specific invalid chart configuration error
      const errorMsg = error.message || '';
      if (
        errorMsg.includes('Invalid chart configuration') ||
        errorMsg.includes('expected array, received undefined')
      ) {
        return {
          text: 'Please enter a chart prompt so I can generate a visualization.',
          chartConfig: null,
        };
      }

      // Default error handling
      return {
        text: `Sorry, I encountered an error: ${error.message}. Please try again.`,
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