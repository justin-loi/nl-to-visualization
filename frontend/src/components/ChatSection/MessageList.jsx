import React, { useEffect, useRef } from 'react';
import { Box, Paper, Avatar, CircularProgress } from '@mui/material';
import MessageBubble from './MessageBubble/MessageBubble';
import { SmartToy } from '@mui/icons-material';

const MessageList = ({ messages, onChartSelect, isLoading }) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <Box sx={{ 
      flex: 1, 
      overflowY: 'auto', 
      px: 3, 
      py: 3,
      bgcolor: '#fafafa'
    }}>
      <Box sx={{ maxWidth: 800, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
        {messages.map((message, index) => (
          <MessageBubble 
            key={index} 
            message={message} 
            onChartSelect={onChartSelect}
          />
        ))}
        
        {/* Loading Bubble */}
        {isLoading && (
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
        
        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </Box>
      
      {/* CSS Animations */}
      <style>
        {`
          @keyframes bounce {
            0%, 80%, 100% {
              transform: scale(0);
              opacity: 0.5;
            }
            40% {
              transform: scale(1);
              opacity: 1;
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </Box>
  );
};

export default MessageList;