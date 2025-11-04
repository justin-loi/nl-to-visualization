import React, { useState, useRef } from 'react';
import { Box } from '@mui/material';
import ChatSection from './ChatSection/ChatSection';
import ChartPanel from './ChartPanel/ChartPanel';
import useChatMessages from '../hooks/useChatMessages';
import useChartDownload from '../hooks/downloadChart';
/**
 * ChatbotChartUI - Main container component for the chatbot with chart visualization
 * 
 * @param {Object} props
 * @param {Array} props.initialMessages - Initial messages to populate the chat (optional)
 * @param {Function} props.onMessageSend - Callback when user sends a message (receives message text)
 * @param {Function} props.onChartGenerate - Callback to generate chart based on user input (receives message text, should return { text, chartConfig })
 * @param {Object} props.chatConfig - Configuration for chat header
 * @param {string} props.chatConfig.title - Chat header title
 * @param {string} props.chatConfig.subtitle - Chat header subtitle
 * @param {Object} props.containerStyle - Custom styles for the main container
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
  const chartInstanceRef = useRef(null);
  
  // FIXED: Pass initialMessages only once, not on every render
  const { messages, addUserMessage, addAssistantMessage } = useChatMessages(initialMessages);
  const downloadChart = useChartDownload(chartInstanceRef);

  const handleSend = async () => {
    if (inputValue.trim() && !isLoading) {
      const userMessageText = inputValue.trim();
      
      // Clear input immediately
      setInputValue('');
      
      // Add user message
      addUserMessage(userMessageText);
      
      setIsLoading(true);

      // Call onMessageSend callback if provided
      if (onMessageSend) {
        try {
          onMessageSend(userMessageText);
        } catch (error) {
          console.error('Error in onMessageSend callback:', error);
        }
      }

      try {
        // If onChartGenerate is provided, use it to generate response
        if (onChartGenerate) {
          const response = await onChartGenerate(userMessageText);
          
          if (response) {
            // Ensure we have a valid text response
            const responseText = response.text || 'Here is your chart visualization.';
            const responseChartConfig = response.chartConfig || null;
            
            // Add assistant message
            addAssistantMessage(responseText, responseChartConfig);
            
            // If there's a chart, select it automatically
            if (responseChartConfig) {
              // Wait for the message to be added before selecting
              setTimeout(() => {
                setSelectedChart({
                  text: responseText,
                  chartConfig: responseChartConfig,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                });
              }, 100);
            }
          } else {
            // Handle case where response is null/undefined
            addAssistantMessage('I received your message but encountered an issue generating a response. Please try again.');
          }
        } else {
          // Default fallback behavior
          addAssistantMessage(
            `I received your request: "${userMessageText}". Please provide an onChartGenerate function to generate actual charts.`
          );
        }
      } catch (error) {
        console.error('Error generating chart:', error);
        addAssistantMessage(
          'Sorry, I encountered an error while processing your request. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChartSelect = (message) => {
    if (message && message.chartConfig) {
      setSelectedChart(message);
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
    <Box sx={{ 
      display: 'flex', 
      height: '100vh', 
      bgcolor: '#f5f5f5',
      ...containerStyle 
    }}>
      <ChatSection
        messages={messages}
        inputValue={inputValue}
        onInputChange={(e) => setInputValue(e.target.value)}
        onSend={handleSend}
        onChartSelect={handleChartSelect}
        disabled={isLoading}
        chatConfig={chatConfig}
        isLoading={isLoading}
      />
      <ChartPanel
        selectedChart={selectedChart}
        onDownload={downloadChart}
        onRefresh={handleRefresh}
        onFullscreen={handleFullscreen}
        chartInstanceRef={chartInstanceRef}
      />
    </Box>
  );
};

export default ChatbotChartUI;