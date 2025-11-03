import React from 'react';
import { Box } from '@mui/material';
import MessageBubble from './MessageBubble/MessageBubble';

const MessageList = ({ messages, onChartSelect }) => {
  return (
    <Box sx={{ 
      flex: 1, 
      overflowY: 'auto', 
      px: 3, 
      py: 3,
      bgcolor: '#fafafa'
    }}>
      <Box sx={{ maxWidth: 800, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
        {messages.map((message) => (
          <MessageBubble 
            key={message.id}
            message={message} 
            onChartSelect={onChartSelect}
          />
        ))}
      </Box>
    </Box>
  );
};

export default MessageList;