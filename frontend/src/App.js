import './App.css';
import ChatbotChartUI from './components/ChatbotChartUI';

function App() {
  
  // Function to call /api/chat endpoint and generate chart
  const handleChartGenerate = async (userMessage) => {
    try {
      // Call your API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      // Parse the response
      const data = await response.json();

      // Your API response format:
      // {
      //   "success": true,
      //   "chart": { /* ECharts option object */ },
      //   "message": "Text explanation",
      //   "metadata": { ... }
      // }

      // Check if the request was successful
      if (!data.success) {
        throw new Error(data.message || 'Chart generation failed');
      }

      // Extract clean text message (remove markdown code blocks if present)
      let textMessage = data.message || 'Chart generated successfully';
      
      // Remove markdown code blocks (```json ... ```)
      textMessage = textMessage.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      // If the message is just JSON, provide a default message
      if (textMessage.startsWith('{') || textMessage.startsWith('[')) {
        textMessage = 'Here is your chart visualization based on the data.';
      }

      // Build the chart config from the API response
      const chartConfig = data.chart ? {
        type: data.chart.series?.[0]?.type || 'bar',
        title: data.chart.title?.text || 'Chart',
        option: data.chart // The entire chart object is the ECharts option
      } : null;

      // Return the data in the format expected by ChatbotChartUI
      return {
        text: textMessage,
        chartConfig: chartConfig
      };

    } catch (error) {
      console.error('Error calling /api/chat:', error);
      
      // Return error message to display in chat
      return {
        text: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        chartConfig: null
      };
    }
  };

  // Optional: Callback when user sends a message (for logging, analytics, etc.)
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