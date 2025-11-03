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
          // Add any other data your API expects
          // timestamp: new Date().toISOString(),
          // userId: 'user123',
        }),
      });

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      // Parse the response
      const data = await response.json();

      // Expected API response format:
      // {
      //   text: "Here's your chart description...",
      //   chartConfig: {
      //     type: "bar",
      //     title: "Chart Title",
      //     option: { /* ECharts options */ }
      //   }
      // }

      // Return the data in the format expected by ChatbotChartUI
      return {
        text: data.text || data.message || 'Chart generated successfully',
        chartConfig: data.chartConfig || data.chart || null
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
    // You can add analytics tracking here
    // analytics.track('message_sent', { message });
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