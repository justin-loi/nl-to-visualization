import React, { useState, useRef } from 'react';
import { Box } from '@mui/material';

import ChatSection from './ChatSection/ChatSection'
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
  
  const { messages, addUserMessage, addAssistantMessage } = useChatMessages(initialMessages);
  const downloadChart = useChartDownload(chartInstanceRef);

  const handleSend = async () => {
    if (inputValue.trim() && !isLoading) {
      const userMessageText = inputValue;
      addUserMessage(userMessageText);
      setInputValue('');
      setIsLoading(true);

      // Call onMessageSend callback if provided
      if (onMessageSend) {
        onMessageSend(userMessageText);
      }

      try {
        // If onChartGenerate is provided, use it to generate response
        if (onChartGenerate) {
          const response = await onChartGenerate(userMessageText);
          
          if (response) {
            const assistantMessage = {
              text: response.text || 'Here is your chart visualization.',
              chartConfig: response.chartConfig,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            
            addAssistantMessage(assistantMessage.text, assistantMessage.chartConfig);
            
            if (assistantMessage.chartConfig) {
              setSelectedChart(assistantMessage);
            }
          }
        } else {
          // Default fallback behavior - simple echo with sample chart
          const assistantMessage = {
            text: `I received your request: "${userMessageText}". Please provide an onChartGenerate function to generate actual charts.`,
            chartConfig: null
          };
          
          addAssistantMessage(assistantMessage.text, assistantMessage.chartConfig);
        }
      } catch (error) {
        console.error('Error generating chart:', error);
        addAssistantMessage(
          'Sorry, I encountered an error while processing your request. Please try again.',
          null
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChartSelect = (message) => {
    if (message.chartConfig) {
      setSelectedChart(message);
    }
  };

  const handleRefresh = () => {
    chartInstanceRef.current?.resize();
  };

  const handleFullscreen = () => {
    if (chartInstanceRef.current) {
      const chartElement = chartInstanceRef.current.getDom();
      if (chartElement.requestFullscreen) {
        chartElement.requestFullscreen();
      } else if (chartElement.webkitRequestFullscreen) {
        chartElement.webkitRequestFullscreen();
      } else if (chartElement.msRequestFullscreen) {
        chartElement.msRequestFullscreen();
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