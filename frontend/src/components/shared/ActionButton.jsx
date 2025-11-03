// shared/ActionButton.jsx
import React from 'react';
import { IconButton, Tooltip } from '@mui/material';

const ActionButton = ({ icon: Icon, onClick, tooltip, disabled = false, size = 'small', ...props }) => {
  return (
    <Tooltip title={tooltip}>
      <span>
        <IconButton size={size} onClick={onClick} disabled={disabled} {...props}>
          <Icon />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default ActionButton;