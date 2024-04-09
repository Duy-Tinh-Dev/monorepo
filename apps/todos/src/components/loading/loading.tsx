import { Box } from '@mui/system';
import { LogoIcon } from '../icon';
import { CircularProgress } from '@mui/material';

const Loading = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 3,
        position: 'fixed',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 1500,
        backgroundColor: 'white',
      }}
    >
      <LogoIcon />
      <CircularProgress />
    </Box>
  );
};

export default Loading;
