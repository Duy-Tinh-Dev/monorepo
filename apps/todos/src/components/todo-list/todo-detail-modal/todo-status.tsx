import { Button } from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import { Todo } from '../types';

interface TodoStatusProps {
  todo: Todo;
  onEditTodo: (todo: Todo) => void;
}

const TodoStatus = ({ todo, onEditTodo }: TodoStatusProps) => {
  const handleToggleComplete = () => {
    const newTodo = {
      ...todo,
      isComplete: !todo.isComplete,
    };
    onEditTodo(newTodo);
  };

  return (
    <Button
      sx={{
        minWidth: 2.5,
        borderRadius: '50%',
        alignSelf: 'flex-start',
        '&:hover': {
          backgroundColor: 'transparent',
        },
        '&:hover .MuiSvgIcon-root': {
          display: 'block',
        },
        color: todo.priority.color,
      }}
      onClick={handleToggleComplete}
    >
      <RadioButtonUncheckedIcon />
      <CheckOutlinedIcon
        sx={{
          display: todo.isComplete ? 'block' : 'none',
          fontSize: '16px',
          position: 'absolute',
        }}
      />
    </Button>
  );
};

export default TodoStatus;
