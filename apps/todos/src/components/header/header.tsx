import { Stack, SxProps } from '@mui/material';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LogoIcon } from '../icon';
import { ROUTES } from '@/constants';

interface HeaderProps {
  sx?: SxProps;
}

const Header: React.FC<HeaderProps> = ({ sx }) => {
  return (
    <Stack sx={sx}>
      <NavLink to={ROUTES.home}>
        <LogoIcon />
      </NavLink>
    </Stack>
  );
};

export default Header;
