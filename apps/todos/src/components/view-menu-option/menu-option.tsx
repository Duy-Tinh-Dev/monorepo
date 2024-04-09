import { ReactElement, useState } from 'react';
import {
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Stack,
  SvgIconProps,
  Typography,
} from '@mui/material';
import ViewStreamOutlinedIcon from '@mui/icons-material/ViewStreamOutlined';
import ViewWeekOutlinedIcon from '@mui/icons-material/ViewWeekOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useTranslation } from '@op/i18n';
import { SubMenu } from './sub-menu-option';
import Sort from '@/components/view-menu-option/sort';
import FilterPriority from '@/components/view-menu-option/filter-priority';
import { useDispatch, useSelector } from 'react-redux';
import { resetFilter, setView } from '@/redux/slices/filterSlice';
import { OptionFilter, View } from '@/components/todo-list/types';
import { filterSelector } from '@/redux/selectors';

export interface MenuOptionItem {
  icon: ReactElement<SvgIconProps> | null;
  label: string;
  type: OptionFilter;
  selected: string;
  subMenu: SubMenu[];
}

const MenuOption = () => {
  const { t } = useTranslation(['common', 'option']);
  const dispatch = useDispatch();
  const { view } = useSelector(filterSelector);

  const [isReset, setIsReset] = useState(false);

  const handleReset = () => {
    setIsReset(true);
    dispatch(resetFilter());
  };

  const menuView = [
    {
      title: t('views.list'),
      icon: <ViewStreamOutlinedIcon fontSize='small' color='secondary' />,
      type: View.LIST,
    },
    {
      title: t('views.board'),
      icon: <ViewWeekOutlinedIcon fontSize='small' color='secondary' />,
      type: View.BOARD,
    },
  ];

  const handleSelectedViewOption = (option: View) => {
    dispatch(setView(option));
  };

  return (
    <Paper
      sx={{
        width: 300,
        maxWidth: '100%',
        borderRadius: '8px',
        boxShadow: 3,
        paddingX: 0.75,
      }}
    >
      <MenuList>
        <MenuItem>
          <ListItemText>
            <Typography fontWeight='bold'>{t('actions.view')}</Typography>
          </ListItemText>
          <ListItemIcon
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <HelpOutlineIcon fontSize='small' />
          </ListItemIcon>
        </MenuItem>
        <Stack
          direction='row'
          gap={0.5}
          borderRadius={2}
          padding={0.25}
          marginY={1}
          sx={{
            backgroundColor: '#f5f5f5',
          }}
        >
          {menuView.map((item) => (
            <Button
              key={item.title}
              color='secondary'
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '50%',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                ...(item.type === view && {
                  color: '#202020',
                  backgroundColor: 'secondary.100',
                  '&:hover': {
                    backgroundColor: 'secondary.100',
                  },
                }),
              }}
              onClick={() => handleSelectedViewOption(item.type)}
            >
              {item.icon}
              <Typography variant='body2' fontWeight={400}>
                {item.title}
              </Typography>
            </Button>
          ))}
        </Stack>
        <Divider />
        <MenuItem
          sx={{
            marginTop: 1,
          }}
        >
          <ListItemText>
            <Typography fontWeight='bold'>
              {t('option:sortBy.heading')}
            </Typography>
          </ListItemText>
          <ListItemIcon
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <HelpOutlineIcon fontSize='small' />
          </ListItemIcon>
        </MenuItem>
        <Sort isReset={isReset} setIsReset={setIsReset} />
        <Divider />
        <MenuItem>
          <ListItemText>
            <Typography fontWeight='bold'>
              {t('option:filterBy.title')}
            </Typography>
          </ListItemText>
          <ListItemIcon
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <HelpOutlineIcon fontSize='small' />
          </ListItemIcon>
        </MenuItem>
        <FilterPriority isReset={isReset} setIsReset={setIsReset} />
        <Divider />
        <MenuItem onClick={handleReset}>
          <ListItemText>
            <Typography fontSize='14px' color='primary'>
              {t('actions.reset')}
            </Typography>
          </ListItemText>
        </MenuItem>
      </MenuList>
    </Paper>
  );
};

export default MenuOption;
