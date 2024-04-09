import React, { useEffect, useState } from 'react';
import { Box, Stack } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import { Dialog, Divider, Input } from '@mui/material';
import { useDebounce } from '@/hooks';
import { Todo, TypeSearchTodo } from '@/components/todo-list/types';
import { useDispatch, useSelector } from 'react-redux';
import { searchTodoSelector, todoListSelector } from '@/redux/selectors';
import ListTodoSearch from '@/components/search/list-todo-search';
import { saveDataToLocalStorage } from '@/utils';
import { initialListIdTodo, keyLocalStorage } from '@/constants';
import { setListIdTodoSearchCurrent } from '@/redux/slices/searchTodoSlice';
import Navigation from '@/components/search/navigation';

interface SearchProps {
  openSearch: boolean;
  onCloseSearch: () => void;
}

const getListTodoById = (todos: Todo[], listId: number[]) => {
  return todos.filter((todo) => listId.includes(todo.id));
};

const Search: React.FC<SearchProps> = ({ openSearch, onCloseSearch }) => {
  const dispatch = useDispatch();
  const listTodo = useSelector(todoListSelector);
  const { listIdTodoSearchCurrent, listIdTodoSearchHistory } =
    useSelector(searchTodoSelector);

  const [searchValue, setSearchValue] = useState('');
  const debounceSearchValue = useDebounce<string>(searchValue);
  const [searchCurrent, setSearchCurrent] = useState<Todo[]>([]);
  const [searchHistory, setSearchHistory] = useState<Todo[]>([]);

  const sxStack = {
    flexDirection: 'row',
    gap: 1,
    padding: '8px 16px',
    alignItems: 'center',
    width: '100%',
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleFilterListTodoByName = () => {
    const listIdTodo = listTodo
      ?.filter((todo) => {
        const s1 = todo.name.toLowerCase();
        const s2 = debounceSearchValue.toLowerCase();
        return s1.includes(s2);
      })
      .map((todo) => todo.id);

    dispatch(setListIdTodoSearchCurrent(listIdTodo ?? initialListIdTodo));
  };

  useEffect(() => {
    saveDataToLocalStorage(keyLocalStorage.searchTodo, {
      listIdTodoSearchCurrent,
      listIdTodoSearchHistory,
    });
    setSearchHistory(getListTodoById(listTodo ?? [], listIdTodoSearchHistory));
    setSearchCurrent(getListTodoById(listTodo ?? [], listIdTodoSearchCurrent));
  }, [listIdTodoSearchCurrent, listIdTodoSearchHistory, listTodo]);

  useEffect(() => {
    if (debounceSearchValue) {
      handleFilterListTodoByName();
    } else {
      dispatch(setListIdTodoSearchCurrent(initialListIdTodo));
    }
  }, [debounceSearchValue]);

  return (
    <Dialog
      open={openSearch}
      onClose={onCloseSearch}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          marginX: '16px',
          width: '100%',
        },
      }}
    >
      <Box
        sx={(theme) => ({
          [theme.breakpoints.up('sm')]: {
            width: '600px',
          },
          [theme.breakpoints.down('sm')]: {
            width: '100%',
          },
          maxHeight: 450,
          overflowY: 'auto',
        })}
      >
        <Stack sx={sxStack}>
          <SearchIcon color='secondary' />
          <Input
            autoFocus
            placeholder='Search or type a command...'
            fullWidth
            disableUnderline
            value={searchValue}
            onChange={handleChange}
          />
        </Stack>
        <Divider />
        {searchHistory.length > 0 && (
          <ListTodoSearch
            title='Recently searches'
            listTodo={searchHistory}
            sx={sxStack}
            type={TypeSearchTodo.HISTORY}
            onCloseSearch={onCloseSearch}
          />
        )}
        {debounceSearchValue && (
          <>
            <Divider
              sx={{
                marginBottom: '8px',
              }}
            />
            <ListTodoSearch
              title='Tasks'
              listTodo={searchCurrent}
              sx={sxStack}
              onCloseSearch={onCloseSearch}
            />
          </>
        )}
        <Divider
          sx={{
            marginBottom: '8px',
          }}
        />
        <Navigation sx={sxStack} onCloseSearch={onCloseSearch} />
      </Box>
    </Dialog>
  );
};

export default Search;
