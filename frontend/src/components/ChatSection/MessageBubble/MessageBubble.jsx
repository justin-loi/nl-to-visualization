import React from 'react';
import { Box, Paper, Typography, Avatar } from '@mui/material';
import { SmartToy, Person } from '@mui/icons-material';
import ChartChip from '../ChartChip';

const MessageBubble = ({ message, onChartSelect, isStreaming }) => {
  const isUser = message.type === 'user';
  const AvatarIcon = isUser ? Person : SmartToy;

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        justifyContent: isUser ? 'flex-end' : 'flex-start'
      }}
    >
      {!isUser && (
        <Avatar
          sx={{
            width: 36,
            height: 36,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            mt: 0.5
          }}
        >
          <AvatarIcon sx={{ fontSize: 20 }} />
        </Avatar>
      )}
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 1,
        maxWidth: '70%',
        alignItems: isUser ? 'flex-end' : 'flex-start'
      }}>
        <Paper
          elevation={0}
          sx={{
            px: 2,
            py: 1.5,
            borderRadius: 2,
            bgcolor: isUser ? 'primary.main' : 'background.paper',
            color: isUser ? 'primary.contrastText' : 'text.primary',
            border: !isUser ? '1px solid' : 'none',
            borderColor: 'divider',
            position: 'relative'
          }}
        >
          <Typography variant="body2" sx={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {message.text}
            {isStreaming && (
              <Box
                component="span"
                sx={{
                  display: 'inline-block',
                  width: 8,
                  height: 16,
                  ml: 0.5,
                  bgcolor: 'primary.main',
                  animation: 'blink 1s infinite',
                  '@keyframes blink': {
                    '0%, 49%': { opacity: 1 },
                    '50%, 100%': { opacity: 0 }
                  }
                }}
              />
            )}
          </Typography>
        </Paper>
        
        {message.chartConfig && !isStreaming && (
          <ChartChip onClick={() => onChartSelect(message)} />
        )}
        
        <Typography variant="caption" color="text.secondary">
          {message.timestamp}
        </Typography>
      </Box>

      {isUser && (
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: 'grey.300',
            mt: 0.5
          }}
        >
          <AvatarIcon sx={{ fontSize: 20 }} />
        </Avatar>
      )}
    </Box>
  );
};

export default MessageBubble;