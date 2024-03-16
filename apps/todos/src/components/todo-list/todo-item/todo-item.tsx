import { useState } from 'react';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import { grey } from '@mui/material/colors';
import { BaseTodo, Todo } from '../types';
import TodoEditor from '../todo-editor/todo-editor';
import { TodoAction } from '../todo-action';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ItemTodoProps {
  indexTodo?: number;
  idEditTodo: number;
  todo: Todo;
  isOpenEditTodo: boolean;
  onToggleCompleteTodo: (idTodo: number) => void;
  onToggleEditTodo: (idTodo: number) => void;
  onEditTodo: (todo: BaseTodo, id?: number) => void;
  onDeleteTodo: (idTodo: number) => void;
  onDuplicate: (todo: Todo) => void;
  onSeeDetailTodo?: (
    nextTodo: Todo,
    index?: number,
    isComment?: boolean
  ) => void;
}

const TodoItem: React.FC<ItemTodoProps> = ({
  indexTodo,
  idEditTodo,
  todo,
  isOpenEditTodo,
  onToggleCompleteTodo,
  onToggleEditTodo,
  onEditTodo,
  onDeleteTodo,
  onDuplicate,
  onSeeDetailTodo,
}) => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: todo.id,
  });

  const style = {
    opacity: isDragging ? 0.5 : undefined,
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (idEditTodo === todo.id && isOpenEditTodo) {
    return (
      <TodoEditor
        type='edit'
        todo={todo}
        onCancelEdit={onToggleEditTodo}
        onEditTodo={onEditTodo}
        sx={{
          marginY: 0.5,
        }}
      />
    );
  }

  return (
    <Box
      component='div'
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      sx={{
        opacity: isDragging ? 0.25 : 1,
      }}
    >
      <Stack
        direction='row'
        justifyContent='space-between'
        sx={{
          position: 'relative',
          marginX: -5,
          width: 'calc(100% + 40px)',
          paddingLeft: 4,
          '&:hover > .MuiButtonBase-root': {
            display: 'block',
          },
          '&:hover > .MuiStack-root': {
            display: 'flex',
          },
          cursor: 'pointer',
        }}
      >
        <Button
          sx={{
            position: 'absolute',
            left: '10px',
            display: 'none',
            minWidth: 2.5,
            cursor: 'move',
            paddingX: 0.25,
            height: '36px',
          }}
          color='secondary'
        >
          <DragIndicatorIcon />
        </Button>
        <Stack direction='row' alignItems='center' width='100%'>
          <Button
            sx={{
              minWidth: 2.5,
              borderRadius: '50%',
              '&:hover': {
                backgroundColor: 'transparent',
              },
              '&:hover .MuiSvgIcon-root': {
                display: 'block',
              },
              color: todo.priority.color,
            }}
            onClick={() => onToggleCompleteTodo(todo.id)}
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
          <Button
            onClick={() => onSeeDetailTodo && onSeeDetailTodo(todo, indexTodo)}
            fullWidth
            sx={{
              '&:hover': {
                backgroundColor: 'transparent',
              },
              justifyContent: 'flex-start',
            }}
            disableRipple
          >
            <Typography
              fontSize={14}
              paragraph
              sx={{
                textDecoration: todo.isComplete ? 'line-through' : 'none',
                color: todo.isComplete ? 'grey.500' : 'black',
              }}
            >
              {todo.name}
            </Typography>
          </Button>
        </Stack>
        <Stack
          direction='row'
          alignItems='center'
          sx={{
            display: isOpenMenu ? 'flex' : 'none',
          }}
        >
          <Button
            color='secondary'
            sx={{
              minWidth: 2.5,
              padding: 0.75,
            }}
            onClick={() => {
              onToggleEditTodo(todo.id);
            }}
          >
            <EditOutlinedIcon fontSize='small' />
          </Button>
          <Button
            color='secondary'
            sx={{
              minWidth: 2.5,
              padding: 0.75,
            }}
            onClick={() =>
              onSeeDetailTodo && onSeeDetailTodo(todo, indexTodo, true)
            }
          >
            <ChatBubbleOutlineOutlinedIcon fontSize='small' />
          </Button>
          <TodoAction
            todo={todo}
            isOpenMenu={isOpenMenu}
            setIsOpenMenu={setIsOpenMenu}
            onDeleteTodo={onDeleteTodo}
            onToggleEditTodo={onToggleEditTodo}
            onEditTodo={onEditTodo}
            onDuplicate={onDuplicate}
          />
        </Stack>
      </Stack>
      <Divider
        sx={{
          margin: 1,
          backgroundColor: grey[100],
          opacity: 0.3,
        }}
      />
    </Box>
  );
};

export default TodoItem;
