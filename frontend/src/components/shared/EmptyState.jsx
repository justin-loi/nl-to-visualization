import { Box, Avatar, Typography } from '@mui/material';

const EmptyState = ({ icon: Icon, title, description, iconSize = 80 }) => {
  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <Box sx={{ textAlign: 'center', maxWidth: 400 }}>
        <Avatar
          sx={{
            width: iconSize,
            height: iconSize,
            bgcolor: 'grey.100',
            mx: 'auto',
            mb: 2
          }}
        >
          <Icon sx={{ fontSize: iconSize / 2, color: 'grey.400' }} />
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

export default EmptyState;