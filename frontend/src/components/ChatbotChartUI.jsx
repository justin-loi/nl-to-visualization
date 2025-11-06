import { useState, useRef } from 'react';
import { Box } from '@mui/material';
import ChartPanel from './ChartPanel/ChartPanel/ChartPanel';
import ChatSection from './ChatSection/ChatSection/ChatSection';
import useChatMessages from '../hooks/useChatMessages';
import CustomThemeProvider from './theme/ThemeProvider';
/**
 * ChatbotChartUI - Enhanced main container with SSE streaming support
 * 
 * @param {Object} props
 * @param {Array} props.initialMessages - Initial messages (optional)
 * @param {Function} props.onMessageSend - Callback when user sends message
 * @param {Function} props.onChartGenerate - Callback to generate chart (should handle SSE)
 * @param {Object} props.chatConfig - Chat header configuration
 * @param {Object} props.containerStyle - Custom container styles
 */
const ChatbotChartUI = ({ 
  initialMessages = [],
  onMessageSend,
  onChartGenerate,
  chatConfig = {
    title: 'Chart Assistant',
    subtitle: 'Ask me to visualize your data'
  },
  containerStyle = {}
}) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedChart, setSelectedChart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState(null);
  const chartInstanceRef = useRef(null);
  
  const { messages, addUserMessage, addAssistantMessage, updateMessageText } = useChatMessages(initialMessages);

  const handleSend = async (messageText = null) => {
    const textToSend = messageText || inputValue.trim();
    
    if (textToSend && !isLoading) {
      if (!messageText) {
        setInputValue('');
      }
      
      addUserMessage(textToSend);
      setIsLoading(true);

      if (onMessageSend) {
        try {
          onMessageSend(textToSend);
        } catch (error) {
          console.error('Error in onMessageSend callback:', error);
        }
      }

      // Add placeholder assistant message for streaming
      const assistantMessageId = addAssistantMessage('', null);
      setStreamingMessageId(assistantMessageId);

      try {
        if (onChartGenerate) {
          // onChartGenerate should now return a stream handler
          const streamHandler = await onChartGenerate(textToSend);
          
          if (streamHandler && typeof streamHandler.onChunk === 'function') {
            // Handle streaming response
            let accumulatedText = '';
            let finalChartConfig = null;
            let finalInsights = [];
            let finalFollowUpQuestions = [];

            streamHandler.onChunk((chunk) => {
              // Update message text as chunks arrive
              if (chunk.text) {
                accumulatedText += chunk.text;
                updateMessageText(assistantMessageId, accumulatedText);
              }
            });

            streamHandler.onComplete((finalData) => {
              // Stream complete
              finalChartConfig = finalData.chartConfig || null;
              finalInsights = finalData.insights || [];
              finalFollowUpQuestions = finalData.followUpQuestions || [];

              // Update final message with complete data
              updateMessageText(assistantMessageId, finalData.text || accumulatedText, finalChartConfig);

              // Select chart if available
              if (finalChartConfig) {
                setTimeout(() => {
                  setSelectedChart({
                    text: finalData.text || accumulatedText,
                    chartConfig: finalChartConfig,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    insights: finalInsights,
                    followUpQuestions: finalFollowUpQuestions
                  });
                }, 100);
              }

              setStreamingMessageId(null);
              setIsLoading(false);
            });

            streamHandler.onError((error) => {
              console.error('Streaming error:', error);

              // Handle specific error case from backend
              if (error.message?.includes('This request does not appear to be asking for a chart or visualization')) {
                updateMessageText(
                  assistantMessageId,
                  'Please input a question that can be visualized. For example, "Show me monthly sales trends" or "Compare expenses by category".'
                );
              } else {
                // Default fallback for other errors
                updateMessageText(
                  assistantMessageId,
                  'Sorry, I encountered an error while processing your request. Please try again.'
                );
              }

              setStreamingMessageId(null);
              setIsLoading(false);
            });

          } else {
            // Fallback for non-streaming responses (backward compatibility)
            const response = streamHandler;
            
            if (response) {
              const responseText = response.text || 'Here is your chart visualization.';
              const responseChartConfig = response.chartConfig || null;
              
              updateMessageText(assistantMessageId, responseText, responseChartConfig);
              
              if (responseChartConfig) {
                setTimeout(() => {
                  setSelectedChart({
                    text: responseText,
                    chartConfig: responseChartConfig,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    insights: response.insights || [],
                    followUpQuestions: response.followUpQuestions || []
                  });
                }, 100);
              }
            } else {
              updateMessageText(
                assistantMessageId,
                'I received your message but encountered an issue generating a response. Please try again.'
              );
            }
            
            setStreamingMessageId(null);
            setIsLoading(false);
          }
        } else {
          updateMessageText(
            assistantMessageId,
            `I received your request: "${textToSend}". Please provide an onChartGenerate function to generate actual charts.`
          );
          setStreamingMessageId(null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error generating chart:', error);
        updateMessageText(
          assistantMessageId,
          'Sorry, I encountered an error while processing your request. Please try again.'
        );
        setStreamingMessageId(null);
        setIsLoading(false);
      }
    }
  };
  
  const handlePromptClick = (promptText) => {
    handleSend(promptText);
  };

  const handleFollowUpClick = (question) => {
    handleSend(question);
  };

  const handleChartSelect = (message) => {
    if (message && message.chartConfig) {
      setSelectedChart({
        ...message,
        insights: message.insights || [],
        followUpQuestions: message.followUpQuestions || []
      });
    }
  };

  const handleRefresh = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.resize();
    }
  };

  const handleFullscreen = () => {
    if (chartInstanceRef.current) {
      const chartElement = chartInstanceRef.current.getDom();
      if (chartElement) {
        if (chartElement.requestFullscreen) {
          chartElement.requestFullscreen();
        } else if (chartElement.webkitRequestFullscreen) {
          chartElement.webkitRequestFullscreen();
        } else if (chartElement.msRequestFullscreen) {
          chartElement.msRequestFullscreen();
        }
      }
    }
  };

  return (
    <CustomThemeProvider>
    <Box sx={{ 
      display: 'flex', 
      height: '100vh', 
      bgcolor: 'background.default',
      ...containerStyle 
    }}>
      <ChatSection
        messages={messages}
        inputValue={inputValue}
        onInputChange={(e) => setInputValue(e.target.value)}
        onSend={() => handleSend()}
        onChartSelect={handleChartSelect}
        disabled={isLoading}
        chatConfig={chatConfig}
        isLoading={isLoading}
        onPromptClick={handlePromptClick}
        showQuickStart={true}
        streamingMessageId={streamingMessageId}
      />
      <ChartPanel
        selectedChart={selectedChart}
        onRefresh={handleRefresh}
        onFullscreen={handleFullscreen}
        chartInstanceRef={chartInstanceRef}
        onFollowUpClick={handleFollowUpClick}
      />
    </Box>
    </CustomThemeProvider>
  );
};

export default ChatbotChartUI;