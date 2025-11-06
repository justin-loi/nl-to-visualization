import { Paper, Box, Avatar, Typography } from '@mui/material';
import { SmartToy } from '@mui/icons-material';

const ChatHeader = ({ 
  title = 'Chart Assistant', 
  subtitle = 'Ask me to visualize your data',
  avatarIcon: AvatarIcon = SmartToy 
}) => {
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        px: 3, 
        py: 2, 
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        >
          <AvatarIcon />
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default ChatHeader;