import React from 'react';
import { Box, Button, Popover, SxProps } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import usePopover from '@hooks/usePopover';
import MenuOption from './menu-option';
import { useTranslation } from '@op/i18n';
import { FilterPriority, GroupBy, SortBy } from '@components/todo-list/types';

interface ViewMenuOptionProps {
  groupBy?: GroupBy;
  sortBy?: SortBy;
  filterPriority?: FilterPriority;
  onSetGroup?: (type: GroupBy) => void;
  onSetSort?: (type: SortBy) => void;
  onSetFilterSort?: (type: FilterPriority) => void;
  sx?: SxProps;
}

const ViewMenuOption: React.FC<ViewMenuOptionProps> = ({
  groupBy,
  sortBy,
  filterPriority,
  onSetSort,
  onSetFilterSort,
  onSetGroup,
  sx,
}) => {
  const { t } = useTranslation(['common']);
  const { id, open, anchorEl, handleClick, handleClose } =
    usePopover('view-menu-option');

  const handleCountOption = () => {
    let count = 0;
    if (groupBy !== 'None (default)') {
      count++;
    }
    if (sortBy !== 'Smart (default)') {
      count++;
    }
    if (filterPriority !== 'All (default)') {
      count++;
    }
    return count;
  };

  const countOption = handleCountOption();

  return (
    <Box sx={sx}>
      <Button
        startIcon={<TuneIcon />}
        color='secondary'
        onClick={handleClick}
        sx={{
          '&.MuiButtonBase-root': {
            minWidth: '100px',
          },
        }}
      >
        {t('actions.view')} {countOption > 0 ? `: ${countOption}` : ''}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MenuOption
          groupBy={groupBy}
          sortBy={sortBy}
          filterPriority={filterPriority}
          onSetSort={onSetSort}
          onSetFilterSort={onSetFilterSort}
          onSetGroup={onSetGroup}
        />
      </Popover>
    </Box>
  );
};

export default ViewMenuOption;
