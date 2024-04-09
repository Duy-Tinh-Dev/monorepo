import { Box, SxProps } from '@mui/system';
import React from 'react';

interface PopupProps {
  children: React.ReactNode;
  sx?: SxProps;
}

const Popup: React.FC<PopupProps> = ({ sx, children }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        left: '50%',
        height: 174.5,
        top: '20%',
        transform: 'translateX(-50%)',
        backgroundColor: '#fff',
        ...sx,
      }}
      zIndex={1201}
      borderRadius={2.5}
      boxShadow={6}
    >
      {children}
    </Box>
  );
};

export default Popup;
