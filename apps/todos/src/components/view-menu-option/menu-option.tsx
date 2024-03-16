import React, { ReactElement, useState } from 'react';
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
import { FilterPriority, GroupBy, SortBy } from '@components/todo-list/types';
import Sort from '@components/view-menu-option/sort';
import Filter from '@components/view-menu-option/filter';

export interface MenuOptionItem {
  icon: ReactElement<SvgIconProps>;
  label: string;
  type: 'group' | 'sort' | 'priority';
  selected: string;
  subMenu: SubMenu[];
}

export interface MenuOptionProps {
  groupBy?: GroupBy;
  sortBy?: SortBy;
  filterPriority?: FilterPriority;
  onSetGroup?: (type: GroupBy) => void;
  onSetSort?: (type: SortBy) => void;
  onSetFilterSort?: (type: FilterPriority) => void;
}

const MenuOption: React.FC<MenuOptionProps> = ({
  groupBy,
  sortBy,
  filterPriority,
  onSetSort,
  onSetFilterSort,
  onSetGroup,
}) => {
  const { t } = useTranslation(['common', 'option']);
  const [isReset, setIsReset] = useState(false);

  const handleReset = () => {
    setIsReset(true);
    if (onSetGroup) {
      onSetGroup('None (default)');
    }
    if (onSetSort) {
      onSetSort('Smart (default)');
    }
    if (onSetFilterSort) {
      onSetFilterSort('All (default)');
    }
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
          <Button
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '50%',
              color: '#202020',
              backgroundColor: 'secondary.100',
              borderRadius: '8px',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: 'secondary.100',
                boxShadow: 'none',
              },
            }}
          >
            <ViewStreamOutlinedIcon fontSize='small' color='secondary' />
            <Typography variant='body2' fontWeight={400}>
              {t('views.list')}
            </Typography>
          </Button>
          <Button
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '50%',
              borderRadius: '8px',
            }}
            color='secondary'
          >
            <ViewWeekOutlinedIcon fontSize='small' color='secondary' />
            <Typography variant='body2' fontWeight={400}>
              {t('views.board')}
            </Typography>
          </Button>
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
        <Sort
          isReset={isReset}
          groupBy={groupBy}
          sortBy={sortBy}
          filterPriority={filterPriority}
          onSetSort={onSetSort}
          onSetFilterSort={onSetFilterSort}
          onSetGroup={onSetGroup}
          setIsReset={setIsReset}
        />
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
        <Filter
          isReset={isReset}
          setIsReset={setIsReset}
          groupBy={groupBy}
          sortBy={sortBy}
          filterPriority={filterPriority}
          onSetSort={onSetSort}
          onSetFilterSort={onSetFilterSort}
          onSetGroup={onSetGroup}
        />
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
