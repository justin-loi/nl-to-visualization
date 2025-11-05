import { Paper, Typography, Box } from '@mui/material';

const ChartDetails = ({ type, title, timestamp }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        bgcolor: '#e3f2fd',
        border: '1px solid #90caf9',
        borderRadius: 2
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1565c0', mb: 1 }}>
        Chart Details
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography variant="body2" sx={{ color: '#1976d2' }}>
          <strong>Type:</strong> {type}
        </Typography>
        <Typography variant="body2" sx={{ color: '#1976d2' }}>
          <strong>Title:</strong> {title}
        </Typography>
        <Typography variant="body2" sx={{ color: '#1976d2' }}>
          <strong>Generated:</strong> {timestamp}
        </Typography>
      </Box>
    </Paper>
  );
};

export default ChartDetails;