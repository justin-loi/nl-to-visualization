import React, { useEffect, useRef } from 'react';
import { Box, Paper, Avatar, CircularProgress } from '@mui/material';
import MessageBubble from './MessageBubble/MessageBubble';
import { SmartToy } from '@mui/icons-material';

const MessageList = ({ messages, onChartSelect, isLoading, streamingMessageId }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <Box sx={{ 
      flex: 1, 
      overflowY: 'auto', 
      px: 3, 
      py: 3,
      bgcolor: 'background.default'
    }}>
      <Box sx={{ maxWidth: 800, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
        {messages.map((message) => (
          <MessageBubble 
            key={message.id} 
            message={message} 
            onChartSelect={onChartSelect}
            isStreaming={message.id === streamingMessageId}
          />
        ))}
        
        {isLoading && !streamingMessageId && (
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'flex-start',
              animation: 'fadeIn 0.3s ease-in'
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                mt: 0.5
              }}
            >
              <SmartToy sx={{ fontSize: 20 }} />
            </Avatar>
            
            <Paper
              elevation={0}
              sx={{
                px: 3,
                py: 2,
                borderRadius: 2,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5
              }}
            >
              <CircularProgress size={16} thickness={4} />
              <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    animation: 'bounce 1.4s infinite ease-in-out both',
                    animationDelay: '-0.32s'
                  }}
                />
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    animation: 'bounce 1.4s infinite ease-in-out both',
                    animationDelay: '-0.16s'
                  }}
                />
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    animation: 'bounce 1.4s infinite ease-in-out both'
                  }}
                />
              </Box>
            </Paper>
          </Box>
        )}
        
        <div ref={messagesEndRef} />
      </Box>
      
      <style>
        {`
          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
            40% { transform: scale(1); opacity: 1; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Box>
  );
};

export default MessageList;