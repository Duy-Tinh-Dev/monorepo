import React from 'react';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Stack, SxProps } from '@mui/system';
import { Todo, TypeSearchTodo } from '@/components/todo-list/types';
import { useDispatch } from 'react-redux';
import {
  addIdTodoHistory,
  deleteIdTodoHistory,
} from '@/redux/slices/searchTodoSlice';
import { Typography } from '@mui/material';
import { setListTodoModal } from '@/redux/slices/todoDetailSlice';

interface SearchTodoItemProps {
  type?: TypeSearchTodo;
  todo: Todo;
  sx?: SxProps;
  indexTodo: number;
  listTodo: Todo[];
  onSeeDetailTodo: (
    nextTodo: Todo,
    index?: number,
    isComment?: boolean
  ) => void;
  onCloseSearch: () => void;
}

const SearchTodoItem: React.FC<SearchTodoItemProps> = ({
  todo,
  type = TypeSearchTodo.CURRENT,
  sx,
  indexTodo,
  listTodo,
  onSeeDetailTodo,
  onCloseSearch,
}) => {
  const dispatch = useDispatch();
  const fontWeight = type === TypeSearchTodo.CURRENT ? 700 : 400;

  const handleClickTodo = () => {
    dispatch(setListTodoModal(listTodo));
    onCloseSearch();
    onSeeDetailTodo(todo, indexTodo);
    if (type === TypeSearchTodo.CURRENT) {
      dispatch(addIdTodoHistory(todo.id));
    }
  };

  const handleDeleteSearchHistory = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    dispatch(deleteIdTodoHistory(todo.id));
  };

  return (
    <Stack
      sx={{
        ...sx,
        height: 42,
        cursor: 'pointer',
        justifyContent: 'space-between',
        position: 'relative',
        '&:hover': {
          backgroundColor: '#eee',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            height: '100%',
            width: 2,
            borderRadius: 999,
            backgroundColor: 'primary.main',
          },
        },
      }}
      onClick={handleClickTodo}
    >
      <Stack direction='row' alignItems='center' gap={1}>
        {type === TypeSearchTodo.HISTORY && (
          <HistoryIcon fontSize='small' color='secondary' />
        )}
        {type === TypeSearchTodo.CURRENT && (
          <RadioButtonUncheckedIcon
            fontSize='small'
            sx={{
              color: todo.priority.color,
            }}
          />
        )}
        <Typography variant='body2' fontWeight={fontWeight}>
          {todo.name}
        </Typography>
      </Stack>
      {type === TypeSearchTodo.HISTORY && (
        <Box onClick={handleDeleteSearchHistory}>
          <CloseIcon fontSize='small' color='secondary' />
        </Box>
      )}
    </Stack>
  );
};

export default SearchTodoItem;
