import { Sidebar } from '@components/sidebar';
import { TodoList } from '@components/todo-list';
import { Stack } from '@mui/material';

const Home = () => {
  return (
    <Stack direction='row'>
      <Sidebar />
      <TodoList />
    </Stack>
  );
};

export default Home;
