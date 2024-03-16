import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Typography,
} from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import CheckIcon from '@mui/icons-material/Check';
import { PriorityItem } from '@components/todo-list/types';
import { listPriority } from '@constants/constants';
import { useTranslation } from '@op/i18n';

interface IPriorityListProps {
  id: number;
  onClickPriorityItem: (priority: PriorityItem) => void;
  onClosePopover: () => void;
}

const PriorityList: React.FC<IPriorityListProps> = ({
  id,
  onClickPriorityItem,
  onClosePopover,
}) => {
  const { t } = useTranslation(['common']);

  return (
    <Paper
      sx={{ width: 125.5, maxWidth: '100%', borderRadius: '8px', boxShadow: 3 }}
    >
      <MenuList
        sx={{
          padding: 0,
        }}
      >
        {listPriority.map((item: PriorityItem) => (
          <MenuItem
            key={item.id}
            sx={{
              padding: '4px 8px',
            }}
            onClick={() => {
              onClickPriorityItem(item);
              onClosePopover();
            }}
          >
            <ListItemIcon
              sx={{
                '&.MuiListItemIcon-root': {
                  minWidth: '26px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              }}
            >
              <FlagIcon
                fontSize='small'
                sx={{
                  color: item.color,
                }}
              />
            </ListItemIcon>
            <ListItemText>
              <Typography fontSize='14px' fontWeight={300}>
                {t('priority.title')} {item.id}
              </Typography>
            </ListItemText>
            {item.id === id && (
              <ListItemIcon
                sx={{
                  '&.MuiListItemIcon-root': {
                    minWidth: '26px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                }}
              >
                <CheckIcon fontSize='small' />
              </ListItemIcon>
            )}
          </MenuItem>
        ))}
      </MenuList>
    </Paper>
  );
};

export default PriorityList;
