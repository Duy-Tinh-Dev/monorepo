import React from 'react';
import { Typography } from '@mui/material';
import { Box, Stack, SxProps } from '@mui/system';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';

interface NavigationProps {
  onCloseSearch: () => void;
  sx?: SxProps;
}

const Navigation: React.FC<NavigationProps> = ({ sx, onCloseSearch }) => {
  const navigate = useNavigate();
  const menuNavigation = [
    {
      title: 'Go to home',
      icon: <HomeOutlinedIcon color='secondary' />,
      path: ROUTES.home,
    },
    {
      title: 'Go to inbox',
      icon: <InboxOutlinedIcon color='secondary' />,
      path: ROUTES.inbox,
    },
    {
      title: 'Go to today',
      icon: <TodayOutlinedIcon color='secondary' />,
      path: ROUTES.inbox,
    }
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    onCloseSearch();
  };

  return (
    <Box>
      <Stack
        sx={{
          ...sx,
          justifyContent: 'space-between',
          padding: '2px 10px',
        }}
      >
        <Typography variant='body2' fontSize='14px' color='secondary'>
          Navigation
        </Typography>
      </Stack>
      {menuNavigation.map((nav) => (
        <Stack
          key={nav.title}
          sx={{
            ...sx,
            height: 42,
            cursor: 'pointer',
            justifyContent: 'space-between',
            position: 'relative',
            '&:hover': {
              backgroundColor: '#eee',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                height: '100%',
                width: 2,
                borderRadius: 999,
                backgroundColor: 'primary.main',
              },
            },
          }}
          onClick={() => handleNavigate(nav.path)}
        >
          <Stack direction='row' alignItems='center' gap={1}>
            {nav.icon}
            <Typography variant='body2' fontWeight='400'>
              {nav.title}
            </Typography>
          </Stack>
        </Stack>
      ))}
    </Box>
  );
};

export default Navigation;
