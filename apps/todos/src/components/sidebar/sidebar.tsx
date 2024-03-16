import React, { useState } from 'react';
import { Avatar, Box, Button, Drawer, Stack, Typography } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import InboxIcon from '@mui/icons-material/Inbox';
import TodayIcon from '@mui/icons-material/Today';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import ViewComfyOutlinedIcon from '@mui/icons-material/ViewComfyOutlined';
import TableViewIcon from '@mui/icons-material/TableView';
import GridViewIcon from '@mui/icons-material/GridView';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import { useTranslation } from '@op/i18n';
import { TodoEditor } from '@components/todo-list/todo-editor';
import { useAuth } from '@context/auth-context';

interface PopupTodoEditorProps {
  onClosePopup: () => void;
}

const PopupTodoEditor: React.FC<PopupTodoEditorProps> = ({ onClosePopup }) => {
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
      }}
      zIndex={99999}
      borderRadius={2.5}
      boxShadow={6}
    >
      <TodoEditor onCancelEdit={onClosePopup} />
    </Box>
  );
};

const Sidebar = () => {
  const { t } = useTranslation(['common', 'sidebar', 'auth']);
  const { currentUser, signOut } = useAuth();
  const [active, setActive] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(true);

  const color = 'secondary';
  const sx = {
    '&.MuiButtonBase-root': {
      minWidth: '36px',
    },
  };

  const menuSidebar = [
    {
      id: 1,
      title: t('sidebar:search'),
      icon: <SearchIcon />,
    },
    {
      id: 2,
      title: t('sidebar:inbox'),
      icon: <InboxIcon />,
    },
    {
      id: 3,
      title: t('sidebar:today'),
      icon: <TodayIcon />,
    },
    {
      id: 4,
      title: t('sidebar:upcoming'),
      icon: <TableViewIcon />,
    },
    {
      id: 5,
      title: t('sidebar:filterLabel'),
      icon: <GridViewIcon />,
    },
  ];

  const handleClosePopup = () => {
    setIsOpen(false);
  };

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpenSidebar(newOpen);
  };

  return (
    <Box
      sx={{
        minWidth: openSidebar ? 420 : 200,
        transition: 'all 0.3s ease',
        padding: '12px 12px 0',
      }}
    >
      <Drawer
        open={openSidebar}
        onClose={toggleDrawer(false)}
        variant='persistent'
        transitionDuration={300}
      >
        <Box
          sx={{
            position: 'relative',
            width: 420,
            height: '100vh',
            padding: '12px 12px 0',
            backgroundColor: '#fcfaf8',
          }}
        >
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            marginBottom={1}
          >
            <Button
              color={color}
              sx={{
                '&.MuiButtonBase-root': {
                  padding: 0,
                },
              }}
            >
              <Avatar
                src={String(currentUser?.photoURL)}
                alt='logo user'
                sx={{
                  width: 26,
                  height: 26,
                }}
              />
              <Typography fontWeight={500} fontSize='14px' marginLeft={1}>
                {String(currentUser?.displayName)}
              </Typography>
              <ExpandMoreIcon />
            </Button>
            <Stack direction='row' gap={1.5}>
              <Button color={color} sx={sx}>
                <NotificationsOutlinedIcon fontSize='small' />
              </Button>
              <Button color={color} sx={sx} onClick={toggleDrawer(false)}>
                <ViewComfyOutlinedIcon fontSize='small' />
              </Button>
            </Stack>
          </Stack>
          <Button
            disableRipple
            color='secondary'
            sx={{
              justifyContent: 'flex-start',
              width: '100%',
              paddingLeft: '2px',
            }}
            onClick={() => {
              setIsOpen(true);
            }}
          >
            <AddCircleIcon color='primary' />
            <Typography
              fontWeight={500}
              fontSize='14px'
              color='primary'
              marginLeft={0.75}
            >
              {t('common:actions.addTask')}
            </Typography>
          </Button>
          {menuSidebar.map((item) => (
            <Button
              key={item.id}
              disableRipple
              color={active === item.id ? 'primary' : 'secondary'}
              sx={{
                justifyContent: 'flex-start',
                width: '100%',
                paddingLeft: '2px',
                backgroundColor: active === item.id ? '#ffefe5' : '',
              }}
              onClick={() => setActive(item.id)}
            >
              {item.icon}
              <Typography fontWeight={400} fontSize='14px' marginLeft={0.75}>
                {item.title}
              </Typography>
            </Button>
          ))}
          <Button
            startIcon={<AddIcon />}
            color='secondary'
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-start',
            }}
          >
            <Typography fontWeight={500} fontSize='14px' marginRight={1}>
              {t('sidebar:addTeam')}
            </Typography>
            <Button
              color='success'
              sx={{
                '&.MuiButtonBase-root': {
                  backgroundColor: '#e6f3e9',
                  minWidth: '24px',
                  padding: '4px 6px',
                  fontSize: '10px',
                },
              }}
            >
              {t('sidebar:new')}
            </Button>
          </Button>
          <Button
            startIcon={<LogoutIcon />}
            variant='outlined'
            sx={{
              position: 'absolute',
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'calc(100% - 24px)',
            }}
            onClick={signOut}
          >
            {t('auth:actions.signout')}
          </Button>
        </Box>
      </Drawer>
      <Button onClick={toggleDrawer(true)} sx={sx} color={color}>
        <ViewComfyOutlinedIcon fontSize='small' />
      </Button>
      {isOpen && <PopupTodoEditor onClosePopup={handleClosePopup} />}
    </Box>
  );
};

export default Sidebar;
