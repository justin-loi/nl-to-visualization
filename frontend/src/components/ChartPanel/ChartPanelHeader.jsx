import React, { useState } from 'react';
import { Paper, Box, Typography, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Divider, Snackbar, Alert } from '@mui/material';
import { Fullscreen, MoreVert, ContentCopy, Download, DataObject, TableChart, Brightness4, Brightness7 } from '@mui/icons-material';
import { useThemeMode } from '../theme/ThemeProvider';
import { copyChartAsImage, downloadChartAsPNG, exportChartAsJSON, exportChartAsCSV } from '../utils/exportUtils';

const ChartPanelHeader = ({
  onFullscreen, 
  disabled,
  chartInstanceRef,
  chartConfig
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { mode, toggleTheme } = useThemeMode();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCopyImage = async () => {
    console.log(chartInstanceRef)
    const success = await copyChartAsImage(chartInstanceRef?.current);
    handleMenuClose();
    showSnackbar(
      success ? 'Chart copied to clipboard!' : 'Failed to copy chart',
      success ? 'success' : 'error'
    );
  };

  const handleDownloadPNG = () => {
    const success = downloadChartAsPNG(chartInstanceRef?.current);
    handleMenuClose();
    showSnackbar(
      success ? 'Chart downloaded successfully!' : 'Failed to download chart',
      success ? 'success' : 'error'
    );
  };

  const handleExportJSON = () => {
    const success = exportChartAsJSON(chartConfig);
    handleMenuClose();
    showSnackbar(
      success ? 'Data exported as JSON!' : 'Failed to export JSON',
      success ? 'success' : 'error'
    );
  };

  const handleExportCSV = () => {
    const success = exportChartAsCSV(chartConfig);
    handleMenuClose();
    showSnackbar(
      success ? 'Data exported as CSV!' : 'Failed to export CSV',
      success ? 'success' : 'error'
    );
  };

  return (
    <>
      <Paper 
        elevation={0} 
        sx={{ 
          px: 3, 
          py: 2, 
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Chart Visualization
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton size="small" onClick={toggleTheme}>
              {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            <IconButton size="small" onClick={onFullscreen} disabled={disabled}>
              <Fullscreen />
            </IconButton>
            <IconButton size="small" onClick={handleMenuOpen} disabled={disabled}>
              <MoreVert />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleCopyImage}>
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy as Image</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDownloadPNG}>
          <ListItemIcon>
            <Download fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download PNG</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleExportJSON}>
          <ListItemIcon>
            <DataObject fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as JSON</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleExportCSV}>
          <ListItemIcon>
            <TableChart fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as CSV</ListItemText>
        </MenuItem>
      </Menu>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ChartPanelHeader;
