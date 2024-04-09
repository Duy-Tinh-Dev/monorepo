import { useState } from 'react';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import { grey, red } from '@mui/material/colors';
import { Todo, View } from '../types';
import TodoEditor from '../todo-editor/todo-editor';
import { TodoAction } from '../todo-action';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { checkExpiredTime, formatDay } from '@/utils/day';
import { useSelector, useDispatch } from 'react-redux';
import { filterSelector } from '@/redux/selectors';
import { setListTodoModal } from '@/redux/slices/todoDetailSlice';

interface ItemTodoProps {
  indexTodo?: number;
  idEditTodo: number;
  todo: Todo;
  isOpenEditTodo: boolean;
  listTodoCurrent?: Todo[];
  allowViewBoard?: boolean;
  onToggleCompleteTodo: (todo: Todo) => void;
  onToggleEditTodo: (idTodo: number) => void;
  onEditTodo: (todo: Todo) => void;
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
  listTodoCurrent,
  allowViewBoard = true,
  onToggleCompleteTodo,
  onToggleEditTodo,
  onEditTodo,
  onDeleteTodo,
  onDuplicate,
  onSeeDetailTodo,
}) => {
  const { view } = useSelector(filterSelector);
  const dispatch = useDispatch();
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

  const checkViewBoard = view === View.BOARD && allowViewBoard;

  const style = {
    opacity: isDragging ? 0.25 : 1,
    transition,
    transform: CSS.Transform.toString(transform),
    border: checkViewBoard ? '1px solid #ccc' : 'none',
    borderRadius: checkViewBoard ? '8px' : '0',
    padding: checkViewBoard ? '6px' : '0',
  };

  const handleSeeDetailTodo = () => {
    listTodoCurrent && dispatch(setListTodoModal(listTodoCurrent));
    onSeeDetailTodo && onSeeDetailTodo(todo, indexTodo);
  };

  if (idEditTodo === todo.id && isOpenEditTodo) {
    return (
      <TodoEditor
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
              alignSelf: 'flex-start',
            }}
            onClick={() => onToggleCompleteTodo(todo)}
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
          <Stack
            sx={{
              flexGrow: 1,
            }}
          >
            <Button
              onClick={handleSeeDetailTodo}
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
            {todo.expireTime && (
              <Button
                startIcon={
                  <AccessTimeIcon
                    sx={{
                      color: checkExpiredTime(todo.expireTime)
                        ? red[500]
                        : grey[600],
                    }}
                  />
                }
                onClick={handleSeeDetailTodo}
                sx={{
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                  justifyContent: 'flex-start',
                  fontSize: '12px',
                  padding: '2px 8px',
                }}
                disableRipple
              >
                <Typography
                  fontSize={14}
                  paragraph
                  sx={{
                    textDecoration: todo.isComplete ? 'line-through' : 'none',
                    color: checkExpiredTime(todo.expireTime)
                      ? red[500]
                      : grey[600],
                  }}
                >
                  {formatDay(todo.expireTime, 'inbox')}
                </Typography>
              </Button>
            )}
          </Stack>
        </Stack>
        <Stack
          direction='row'
          alignItems='center'
          sx={{
            display: isOpenMenu ? 'flex' : 'none',
          }}
        >
          {!checkViewBoard && (
            <>
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
                onClick={() => {
                  listTodoCurrent &&
                    dispatch(setListTodoModal(listTodoCurrent));
                  onSeeDetailTodo && onSeeDetailTodo(todo, indexTodo, true);
                }}
              >
                <ChatBubbleOutlineOutlinedIcon fontSize='small' />
              </Button>
            </>
          )}

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
      {!checkViewBoard && (
        <Divider
          sx={{
            margin: 1,
            backgroundColor: grey[100],
            opacity: 0.3,
          }}
        />
      )}
    </Box>
  );
};

export default TodoItem;
