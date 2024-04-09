import React from 'react';
import { Box, Button, Popover, SxProps } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import { usePopover } from '@/hooks';
import MenuOption from './menu-option';
import { useTranslation } from '@op/i18n';
import { filterSelector } from '@/redux/selectors';
import { useSelector } from 'react-redux';
import { GroupBy, PriorityBy, SortBy } from '@/components/todo-list/types';
import { Theme } from '@mui/system';

interface ViewMenuOptionProps {
  sx?: SxProps<Theme>;
}

const ViewMenuOption: React.FC<ViewMenuOptionProps> = ({ sx }) => {
  const { t } = useTranslation(['common']);
  const { id, open, anchorEl, handleClick, handleClose } =
    usePopover('view-menu-option');
  const { groupBy, sortBy, priority } = useSelector(filterSelector);

  const handleCountOption = () => {
    let count = 0;
    if (groupBy !== GroupBy.DEFAULT) {
      count++;
    }
    if (sortBy !== SortBy.DEFAULT) {
      count++;
    }
    if (priority !== PriorityBy.DEFAULT) {
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
        <MenuOption />
      </Popover>
    </Box>
  );
};

export default ViewMenuOption;
