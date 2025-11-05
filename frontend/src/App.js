import './App.css';
import ChatbotChartUI from './components/ChatbotChartUI';

function App() {
  // Determine backend base URL
  const apiBase =
    process.env.REACT_APP_BACKEND_URL ||
    (window.location.hostname === 'localhost'
      ? `http://localhost:${process.env.REACT_APP_BACKEND_PORT || 3001}`
      : `http://backend:${process.env.REACT_APP_BACKEND_PORT || 3001}`);
  
  // Function to call /api/chat/stream endpoint with SSE
  // Returns a stream handler object for progressive updates
  const handleChartGenerate = async (userMessage) => {
    
    let accumulatedMessage = '';
    let accumulatedChart = null;
    let accumulatedInsights = [];
    let accumulatedFollowUpQuestions = [];
    
    let chunkCallback = null;
    let completeCallback = null;
    let errorCallback = null;

    // Create stream handler object
    const streamHandler = {
      onChunk: (callback) => {
        chunkCallback = callback;
      },
      onComplete: (callback) => {
        completeCallback = callback;
      },
      onError: (callback) => {
        errorCallback = callback;
      }
    };

    // Start SSE connection with POST
    try {
      fetch(`${apiBase}/api/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({ message: userMessage }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = ''; // Buffer for incomplete lines

          const readStream = () => {
            reader.read().then(({ done, value }) => {
              if (done) {
                
                // Process final data
                const result = processFinalResponse(
                  accumulatedMessage,
                  accumulatedChart,
                  accumulatedInsights,
                  accumulatedFollowUpQuestions
                );
                
                if (completeCallback) {
                  completeCallback(result);
                }
                return;
              }

              // Decode chunk and add to buffer
              const chunk = decoder.decode(value, { stream: true });
              buffer += chunk;
              
              // Process complete lines
              const lines = buffer.split('\n');
              buffer = lines.pop() || ''; // Keep incomplete line in buffer

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  try {
                    const jsonStr = line.slice(6).trim();
                    if (!jsonStr) continue;
                    
                    const data = JSON.parse(jsonStr);

                    if (data.type === 'message' || data.type === 'chunk') {
                      // Stream text chunks
                      const textChunk = data.content || data.text || '';
                      accumulatedMessage += textChunk;
                      
                      // Call chunk callback for progressive display
                      if (chunkCallback) {
                        chunkCallback({ 
                          text: textChunk, 
                          accumulated: accumulatedMessage 
                        });
                      }
                    } else if (data.type === 'chart') {
                      // Receive chart data as separate event
                      accumulatedChart = data.chart;
                    } else if (data.type === 'insights') {
                      // Receive insights
                      accumulatedInsights = data.insights || [];
                    } else if (data.type === 'followup' || data.type === 'followUpQuestions') {
                      // Receive follow-up questions
                      accumulatedFollowUpQuestions = data.questions || data.followUpQuestions || [];
                    } else if (data.type === 'complete' || data.type === 'done') {
                      // Stream complete
                      
                      // Process final data - check both event data and accumulated
                      const finalText = data.message || accumulatedMessage || 'Chart generated successfully';
                      const finalChart = data.chart || accumulatedChart;
                      const finalInsights = data.insights || accumulatedInsights;
                      const finalFollowUp = data.followUpQuestions || accumulatedFollowUpQuestions;

                      const result = processFinalResponse(
                        finalText, 
                        finalChart, 
                        finalInsights, 
                        finalFollowUp
                      );
                      
                      if (completeCallback) {
                        completeCallback(result);
                      }
                      return;
                    } else if (data.type === 'error') {
                      // Handle error from server
                      
                      if (errorCallback) {
                        errorCallback(new Error(data.error || 'Server error occurred'));
                      }
                      return;
                    } else {
                      // Unknown type - log for debugging
                    }
                  } catch (parseError) {
                  }
                }
              }

              readStream();
            }).catch(error => {
              if (errorCallback) {
                errorCallback(error);
              }
            });
          };

          readStream();
        })
        .catch(error => {
          if (errorCallback) {
            errorCallback(error);
          }
        });

    } catch (error) {
      if (errorCallback) {
        errorCallback(error);
      }
    }

    return streamHandler;
  };

  // Helper function to extract chart from JSON in message text
  const extractChartFromMessage = (message) => {
    try {
      // Try to find JSON block in message
      const jsonMatch = message.match(/```json\n?([\s\S]*?)\n?```/);
      if (jsonMatch) {
        const chartData = JSON.parse(jsonMatch[1]);
        return chartData;
      }

      // Try to parse the entire message as JSON
      if (message.trim().startsWith('{')) {
        const chartData = JSON.parse(message);
        return chartData;
      }
    } catch (error) {
      console.log('📊 [Frontend] Could not extract chart from message:', error.message);
    }
    return null;
  };

  // Helper function to process final response
  const processFinalResponse = (message, chart, insights = [], followUpQuestions = []) => {

    let textMessage = message || 'Chart generated successfully';
    let chartData = chart;

    // If no chart data was received as separate event, try to extract from message
    if (!chartData && textMessage) {
      chartData = extractChartFromMessage(textMessage);
      
      if (chartData) {
        // Remove the JSON from the message text
        textMessage = textMessage.replace(/```json\n?[\s\S]*?\n?```/g, '').trim();
        if (!textMessage || textMessage.startsWith('{')) {
          textMessage = 'Here is your chart visualization based on the data.';
        }
      }
    }

    // Clean message text
    textMessage = textMessage.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // If the message is just JSON, provide a default message
    if (textMessage.startsWith('{') || textMessage.startsWith('[')) {
      textMessage = 'Here is your chart visualization based on the data.';
    }

    // Build chart config
    const chartConfig = chartData
      ? {
          type: chartData.series?.[0]?.type || 'bar',
          title: chartData.title?.text || 'Chart',
          option: chartData,
        }
      : null;

    return {
      text: textMessage,
      chartConfig: chartConfig,
      insights: insights || [],
      followUpQuestions: followUpQuestions || []
    };
  };

  return (
    <div>
      <ChatbotChartUI 
        onChartGenerate={handleChartGenerate}
        onMessageSend={(msg) => console.log('🔵 [Frontend] User sent:', msg)}
        chatConfig={{
          title: 'Chart Assistant',
          subtitle: 'Ask me to visualize your data'
        }}
      />
    </div>
  );
}

export default App;