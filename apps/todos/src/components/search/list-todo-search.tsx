import SearchTodoItem from '@/components/search/search-todo-item';
import { Todo, TypeSearchTodo } from '@/components/todo-list/types';
import { setListIdTodoSearchHistory } from '@/redux/slices/searchTodoSlice';
import { toggleModalDetail } from '@/redux/slices/todoDetailSlice';
import { Button, Typography } from '@mui/material';
import { Box, Stack, SxProps } from '@mui/system';
import React from 'react';
import { useDispatch } from 'react-redux';

interface ListTodoSearchProps {
  title: string;
  listTodo: Todo[];
  type?: TypeSearchTodo;
  sx?: SxProps;
  onCloseSearch: () => void;
}

const ListTodoSearch: React.FC<ListTodoSearchProps> = ({
  title,
  listTodo,
  type,
  sx,
  onCloseSearch,
}) => {
  const dispatch = useDispatch();

  const handleToggleModalDetail = (
    todo: Todo,
    index?: number,
    isComment?: boolean
  ) => {
    dispatch(toggleModalDetail({ todo, index, isComment }));
  };

  const handleClearSearchHistory = () => {
    dispatch(setListIdTodoSearchHistory([]));
  };

  return (
    <>
      <Box>
        <Stack
          sx={{
            ...sx,
            justifyContent: 'space-between',
            padding: '2px 10px',
          }}
        >
          <Typography variant='body2' fontSize='14px' color='secondary'>
            {title}
          </Typography>
          {type === TypeSearchTodo.HISTORY && (
            <Button
              color='secondary'
              sx={{
                '&.MuiButtonBase-root': {
                  minWidth: 36,
                },
              }}
              onClick={handleClearSearchHistory}
            >
              Clear
            </Button>
          )}
        </Stack>
      </Box>
      <Box marginBottom={2}>
        {listTodo.length > 0 &&
          listTodo.map((todo, index) => (
            <SearchTodoItem
              key={todo.id}
              todo={todo}
              sx={sx}
              type={type}
              indexTodo={index}
              listTodo={listTodo}
              onSeeDetailTodo={handleToggleModalDetail}
              onCloseSearch={onCloseSearch}
            />
          ))}
      </Box>

      {listTodo.length === 0 && (
        <Typography
          marginBottom={2}
          textAlign='center'
          fontSize='16px'
          fontWeight='500'
          color='secondary'
        >
          No matching tasks found
        </Typography>
      )}
    </>
  );
};

export default ListTodoSearch;
