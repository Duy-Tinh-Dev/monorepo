import React from 'react';
import { AppBar, IconButton, Toolbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';

interface HeaderProps {
  isDisabledNext: boolean;
  isDisabledPrevious: boolean;
  onNextTodoDetail: () => void;
  onPreviousTodoDetail: () => void;
  onClose: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isDisabledNext,
  isDisabledPrevious,
  onNextTodoDetail,
  onPreviousTodoDetail,
  onClose,
}) => {
  return (
    <AppBar
      position='relative'
      color='transparent'
      variant='outlined'
      sx={{
        '& .MuiToolbar-root': {
          paddingX: 1.25,
        },
      }}
      elevation={0}
    >
      <Toolbar
        sx={{
          justifyContent: 'end',
          gap: 0.75,
        }}
        variant='dense'
      >
        <IconButton
          edge='start'
          onClick={onPreviousTodoDetail}
          disabled={isDisabledPrevious}
        >
          <KeyboardArrowUpOutlinedIcon />
        </IconButton>
        <IconButton
          edge='start'
          onClick={onNextTodoDetail}
          disabled={isDisabledNext}
        >
          <KeyboardArrowDownOutlinedIcon />
        </IconButton>
        <IconButton edge='start' onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
