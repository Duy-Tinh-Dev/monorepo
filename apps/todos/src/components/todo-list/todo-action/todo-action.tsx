import React, { useEffect } from 'react';
import { Box, Button, Popover } from '@mui/material';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import MenuActionTodo from './menu-action-todo';
import { Todo } from '../types';
import { usePopover } from '@/hooks';

interface TodoActionProps {
  todo: Todo;
  isOpenMenu: boolean;
  onToggleEditTodo: (idTodo: number) => void;
  onEditTodo: (todo: Todo) => void;
  onDeleteTodo: (idTodo: number) => void;
  onDuplicate: (todo: Todo) => void;
  setIsOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const TodoAction: React.FC<TodoActionProps> = ({
  todo,
  isOpenMenu,
  setIsOpenMenu,
  onDeleteTodo,
  onToggleEditTodo,
  onEditTodo,
  onDuplicate,
}) => {
  const { id, open, anchorEl, handleClick, handleClose } =
    usePopover('todo-action');

  useEffect(() => {
    if (anchorEl === null) {
      const idTimer = setTimeout(() => {
        setIsOpenMenu(false);
      }, 300);
      return () => clearTimeout(idTimer);
    }
  }, [anchorEl]);

  return (
    <Box position='relative'>
      <Button
        aria-describedby={id}
        color='secondary'
        sx={{
          minWidth: 2.5,
          padding: 0.75,
        }}
        onClick={(e) => {
          handleClick(e);
          setIsOpenMenu(true);
        }}
      >
        <MoreHorizOutlinedIcon fontSize='small' />
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
        {isOpenMenu && (
          <MenuActionTodo
            todo={todo}
            onDeleteTodo={onDeleteTodo}
            onEditTodo={onEditTodo}
            onToggleEditTodo={onToggleEditTodo}
            onDuplicate={onDuplicate}
            onClose={handleClose}
          />
        )}
      </Popover>
    </Box>
  );
};

export default TodoAction;
