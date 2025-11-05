import { Paper, Box, TextField, IconButton, Typography } from '@mui/material';
import { Send } from '@mui/icons-material';

const ChatInput = ({ value, onChange, onSend, disabled = false }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2, 
        borderTop: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Box sx={{ maxWidth: 800, mx: 'auto', display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder="Describe the chart you want to create..."
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
        />
        <IconButton
          onClick={onSend}
          disabled={disabled || !value.trim()}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            width: 56,
            height: 56,
            '&:hover': { bgcolor: 'primary.dark' },
            '&.Mui-disabled': { bgcolor: 'action.disabledBackground' }
          }}
        >
          <Send />
        </IconButton>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
        Press Enter to send, Shift+Enter for new line
      </Typography>
    </Paper>
  );
};

export default ChatInput;