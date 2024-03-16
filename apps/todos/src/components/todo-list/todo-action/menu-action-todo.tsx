import {
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FlagIcon from '@mui/icons-material/Flag';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { grey } from '@mui/material/colors';
import useDisclosure from '@hooks/useDisclosure';
import { ConfirmDialog } from '@components/confirm-dialog';
import { listPriority } from '@constants/constants';
import { BaseTodo, PriorityItem, Todo } from '../types';
import { useTranslation } from '@op/i18n';

interface MenuActionTodoProps {
  todo: Todo;
  onDeleteTodo: (idTodo: number) => void;
  onToggleEditTodo: (idTodo: number) => void;
  onEditTodo: (todo: BaseTodo, id: number) => void;
  onDuplicate: (todo: Todo) => void;
  onClose: () => void;
}

const MenuActionTodo: React.FC<MenuActionTodoProps> = ({
  todo,
  onDeleteTodo,
  onToggleEditTodo,
  onEditTodo,
  onDuplicate,
  onClose,
}) => {
  const deleteDialogDisClosure = useDisclosure({});
  const { t } = useTranslation(['common']);

  return (
    <Paper
      sx={{
        width: 250,
        maxWidth: '100%',
        borderRadius: '8px',
        boxShadow: 3,
        paddingX: 0.75,
      }}
    >
      <MenuList>
        <MenuItem onClick={() => onToggleEditTodo(todo.id)}>
          <ListItemIcon>
            <EditOutlinedIcon />
          </ListItemIcon>
          <ListItemText>
            <Typography fontWeight={300}>{t('actions.edit')}</Typography>
          </ListItemText>
          <Typography variant='body2' fontWeight={200}>
            Ctrl E
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemText>
            <Typography fontWeight='bold'>{t('priority.title')}</Typography>
          </ListItemText>
          <Typography variant='body2'>Y</Typography>
        </MenuItem>
        <MenuItem
          sx={{
            '&:hover': {
              backgroundColor: 'transparent',
            },
          }}
        >
          <Stack direction='row' alignItems='center' gap='8px'>
            {listPriority.map((item: PriorityItem) => (
              <Box
                key={item.id}
                border={item.level === todo.priority.level ? 1 : 0}
                borderColor={grey[300]}
                padding={0.75}
                borderRadius={1}
                display='flex'
                alignItems='center'
                justifyContent='center'
                sx={{
                  '&:hover': {
                    backgroundColor: grey[300],
                    transition: '0.3s all ease',
                  },
                }}
                onClick={() => {
                  const baseTodo: BaseTodo = {
                    name: todo.name,
                    description: todo.description,
                    priority: item,
                  };
                  onEditTodo(baseTodo, todo.id);
                  onClose();
                }}
              >
                <FlagIcon
                  sx={{
                    color: item.color,
                  }}
                />
              </Box>
            ))}
          </Stack>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            onDuplicate(todo);
            onClose();
          }}
        >
          <ListItemIcon>
            <AddToPhotosIcon />
          </ListItemIcon>
          <ListItemText>
            <Typography fontWeight={300}>{t('actions.duplicate')}</Typography>
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={() => deleteDialogDisClosure.onOpen()}>
          <ListItemIcon>
            <DeleteOutlinedIcon color='primary' />
          </ListItemIcon>
          <ListItemText>
            <Typography color='primary' fontWeight={300}>
              {t('actions.delete')}
            </Typography>
          </ListItemText>
          <Typography variant='body2' fontWeight={200}>
            ⌘ {t('actions.delete')}
          </Typography>
        </MenuItem>
      </MenuList>
      <ConfirmDialog
        isOpen={deleteDialogDisClosure.isOpen}
        title={t('actions.confirmDelete')}
        handleClose={deleteDialogDisClosure.onClose}
        handleConfirm={() => {
          onDeleteTodo(todo.id);
        }}
      />
    </Paper>
  );
};

export default MenuActionTodo;
