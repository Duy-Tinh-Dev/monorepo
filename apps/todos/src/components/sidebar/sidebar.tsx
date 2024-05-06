import {
  Avatar,
  Box,
  Button,
  Drawer,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import InboxIcon from '@mui/icons-material/Inbox';
import TodayIcon from '@mui/icons-material/Today';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import ViewComfyOutlinedIcon from '@mui/icons-material/ViewComfyOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { useTranslation } from '@op/i18n';
import { addTodoApi } from 'src/api';
import { TodoEditor } from '../todo-list/todo-editor';
import { useAuth } from '@/contexts/auth-context';
import { useDisclosure } from '@/hooks';
import { Popup } from '@/components/popup';
import { Search } from '@/components/search';
import { ROUTES } from '@/constants';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { grey } from '@mui/material/colors';
import SidebarProject from './sidebar-project/sidebar-project';
import { TypeTime } from '@/@types/typeTime';

interface SidebarProps {
  openSidebar: boolean;
  onCloseSidebar: () => void;
  onOpenSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  openSidebar,
  onCloseSidebar,
  onOpenSidebar,
}) => {
  const { t } = useTranslation(['common', 'sidebar', 'auth']);
  const { currentUser, signOut } = useAuth();
  const location = useLocation();
  const todoEditorDisclosure = useDisclosure({});
  const searchDisclosure = useDisclosure({});

  const color = 'secondary';
  const sx = {
    '&.MuiButtonBase-root': {
      minWidth: '36px',
    },
  };

  const menuSidebar = [
    {
      id: 1,
      title: t('sidebar:inbox'),
      href: ROUTES.inbox,
      icon: <InboxIcon />,
    },
    {
      id: 2,
      title: t('sidebar:today'),
      href: ROUTES.home,
      icon: <TodayIcon />,
    },
  ];

  return (
    <>
      <Drawer
        open={openSidebar}
        onClose={onCloseSidebar}
        transitionDuration={300}
        disableEnforceFocus
        sx={(theme) => ({
          [theme.breakpoints.up('md')]: { zIndex: '-1' },
          [theme.breakpoints.down('md')]: { zIndex: '1' },
          '& > .MuiBackdrop-root': {
            display: {
              md: 'none',
            },
          },
        })}
      >
        <Box
          sx={(theme) => ({
            position: 'relative',
            height: '100vh',
            padding: '12px 12px 0',
            backgroundColor: '#fcfaf8',
            [theme.breakpoints.up('md')]: { width: '420px' },
            [theme.breakpoints.down('md')]: { width: '300px' },
          })}
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
              <Button color={color} sx={sx} onClick={onCloseSidebar}>
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
            onClick={todoEditorDisclosure.onOpen}
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
          <Button
            disableRipple
            color={color}
            sx={{
              justifyContent: 'flex-start',
              width: '100%',
              paddingLeft: '2px',
            }}
            onClick={searchDisclosure.onOpen}
          >
            <SearchIcon />
            <Typography fontWeight={400} fontSize='14px' marginLeft={0.75}>
              {t('sidebar:search')}
            </Typography>
          </Button>
          {menuSidebar.map((item) => (
            <Link
              key={item.id}
              to={item.href}
              component={RouterLink}
              underline='none'
              sx={{
                display: 'flex',
                width: '100%',
                paddingX: '2px',
                paddingY: '8px',
                backgroundColor:
                  location.pathname === item.href ? '#ffefe5' : '',
                color:
                  location.pathname === item.href
                    ? 'primary.main'
                    : 'secondary.main',
                '&:hover': {
                  backgroundColor:
                    location.pathname === item.href ? '' : grey[100],
                },
              }}
            >
              {item.icon}
              <Typography
                fontWeight={400}
                fontSize='14px'
                marginLeft={0.75}
                sx={{
                  marginLeft: '6px',
                }}
              >
                {item.title}
              </Typography>
            </Link>
          ))}
          <SidebarProject />
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
      {!openSidebar && (
        <Button onClick={onOpenSidebar} sx={sx} color={color}>
          <ViewComfyOutlinedIcon fontSize='small' />
        </Button>
      )}
      {todoEditorDisclosure.isOpen && (
        <Popup>
          <TodoEditor
            onAddTodo={addTodoApi}
            onCancelAdd={todoEditorDisclosure.onClose}
            defaultTime={TypeTime.OVERDUE}
          />
        </Popup>
      )}
      {searchDisclosure.isOpen && (
        <Search
          openSearch={searchDisclosure.isOpen}
          onCloseSearch={searchDisclosure.onClose}
        />
      )}
    </>
  );
};

export default Sidebar;
