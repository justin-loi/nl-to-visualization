import React from 'react';
import { Box } from '@mui/material';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

const ChatSection = ({ 
  messages, 
  inputValue, 
  onInputChange, 
  onSend, 
  onChartSelect,
  disabled = false,
  chatConfig = {},
  isLoading = false
}) => {
  return (
    <Box sx={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column',
      borderRight: '1px solid',
      borderColor: 'divider',
      bgcolor: 'background.paper'
    }}>
      <ChatHeader 
        title={chatConfig.title}
        subtitle={chatConfig.subtitle}
        avatarIcon={chatConfig.avatarIcon}
      />
      <MessageList 
        messages={messages} 
        onChartSelect={onChartSelect}
        isLoading={isLoading}
      />
      <ChatInput 
        value={inputValue} 
        onChange={onInputChange} 
        onSend={onSend}
        disabled={disabled}
      />
    </Box>
  );
};

export default ChatSection;