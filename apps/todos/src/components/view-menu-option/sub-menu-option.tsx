import React, { ReactElement } from 'react';
import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popover,
  Stack,
  SvgIconProps,
  Typography,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { usePopover } from '@/hooks';
import { PriorityBy, GroupBy, SortBy } from '@/components/todo-list/types';
import { useDispatch, useSelector } from 'react-redux';
import { filterSelector } from '@/redux/selectors';
import {
  setPriorityBy,
  setGroupBy,
  setSortBy,
} from '@/redux/slices/filterSlice';

export interface SubMenu {
  id: number;
  option: GroupBy | SortBy | PriorityBy;
}

interface SubMenuOptionProps {
  idName: string;
  icon: ReactElement<SvgIconProps>;
  label: string;
  type: 'group' | 'sort' | 'priority';
  selected: string;
  subMenu: SubMenu[];
  onChangeMenu: (idMenu: number, idSubMenu: number) => void;
}

const SubMenuOption: React.FC<SubMenuOptionProps> = ({
  idName,
  icon,
  label,
  type,
  selected,
  subMenu,
  onChangeMenu,
}) => {
  const { id, open, anchorEl, handleClick, handleClose } = usePopover(idName);
  const { groupBy, sortBy, priority } = useSelector(filterSelector);
  const dispatch = useDispatch();

  const selectedOption = (() => {
    switch (type) {
      case 'group':
        return groupBy;
      case 'sort':
        return sortBy;
      case 'priority':
        return priority;
      default:
        return selected;
    }
  })();

  const handleSortTodo = (item: SubMenu, index: number) => {
    onChangeMenu(Number(idName), index);
    if (type === 'group') {
      dispatch(setGroupBy(item.option as GroupBy));
    }
    if (type === 'sort') {
      dispatch(setSortBy(item.option as SortBy));
    }
    if (type === 'priority') {
      dispatch(setPriorityBy(item.option as PriorityBy));
    }
    handleClose();
  };

  return (
    <>
      <MenuItem onClick={handleClick}>
        <ListItemIcon
          sx={{
            '&.MuiListItemIcon-root': {
              minWidth: '26px',
              display: 'flex',
              justifyContent: 'flex-start',
            },
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText>
          <Typography fontWeight={400} fontSize='14px'>
            {label}
          </Typography>
        </ListItemText>
        <Stack direction='row' justifyContent='flex-end' alignItems='center'>
          <Typography variant='body2' fontSize='14px' fontWeight={300}>
            {selectedOption}
          </Typography>
          <KeyboardArrowDownOutlinedIcon fontSize='small' color='secondary' />
        </Stack>
      </MenuItem>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
      >
        <Paper
          sx={{
            width: 220,
            maxWidth: '100%',
            borderRadius: '8px',
            boxShadow: 2,
          }}
        >
          <MenuList>
            {subMenu.map((item: SubMenu, index: number) => (
              <MenuItem
                key={item.id}
                onClick={() => handleSortTodo(item, index)}
              >
                <ListItemText>
                  <Typography variant='body2' fontWeight={400} fontSize='13px'>
                    {item.option}
                  </Typography>
                </ListItemText>
                {item.option === selectedOption && (
                  <ListItemIcon
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <CheckIcon fontSize='small' />
                  </ListItemIcon>
                )}
              </MenuItem>
            ))}
          </MenuList>
        </Paper>
      </Popover>
    </>
  );
};

export default SubMenuOption;
