import { LogoIcon } from '@components/icon';
import { Stack, SxProps } from '@mui/material';
import React from 'react';
import { NavLink } from 'react-router-dom';

interface HeaderProps {
  sx?: SxProps;
}

const Header: React.FC<HeaderProps> = ({ sx }) => {
  return (
    <Stack sx={sx}>
      <NavLink to='/'>
        <LogoIcon />
      </NavLink>
    </Stack>
  );
};

export default Header;
