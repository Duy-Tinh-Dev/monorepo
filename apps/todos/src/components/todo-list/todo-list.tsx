import { useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { DndContext, DragEndEvent, closestCorners } from '@dnd-kit/core';
import { useSelector, useDispatch } from 'react-redux';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { useTranslation } from '@op/i18n';
import {
  addTodoApi,
  addProjectApi,
  deleteTodoApi,
  duplicateTodoApi,
  editTodoApi,
  toggleCompleteTodoApi,
  editProjectApi,
} from 'src/api';
import {
  filterSelector,
  listTodoProjectSelector,
  projectSelectedSelector,
  todoListSelector,
} from '@/redux/selectors';
import { initListTodo } from '@/redux/slices/todoSlice';
import { useSensors } from '@/hooks';
import { getIndexTodoById, checkPriority } from '@/utils';
import { TodoEditor } from './todo-editor';
import TodoItem from './todo-item/todo-item';
import { GroupBy, PriorityBy, PriorityLevels, Todo, View } from './types';
import backgroundEmpty from '@/assets/background.png';
import { styleScrollbar } from '@/constants';
import { TypeTime } from '@/@types/typeTime';
import { toggleModalDetail } from '@/redux/slices/todoDetailSlice';
import { updateProject } from '@/redux/slices/projectSlice';

interface TodoListProps {
  type?: TypeTime;
  heading?: string;
  totalTaskComplete?: number;
  listTodoSorting: Todo[];
  level?: PriorityLevels;
  isHidden?: boolean;
}

const TodoList: React.FC<TodoListProps> = ({
  type = TypeTime.TODAY,
  heading,
  totalTaskComplete,
  listTodoSorting,
  level,
  isHidden,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(['common', 'option']);
  const { sensors } = useSensors();
  const isOverdue = type === TypeTime.OVERDUE;

  const listTodo = useSelector(todoListSelector) ?? [];
  const { priority, groupBy, view } = useSelector(filterSelector);
  const projectSelected = useSelector(projectSelectedSelector);
  const listTodoProject = useSelector(listTodoProjectSelector) ?? [];

  const [isAddTodo, setIsAddTodo] = useState(false);
  const [idEditTodo, setIdEditTodo] = useState(-1);
  const [isOpenEditTodo, setIsOpenEditTodo] = useState(false);

  const disabledPopup =
    priority !== PriorityBy.DEFAULT && groupBy !== GroupBy.DATE;

  const checkViewBoard = view === View.BOARD;

  const handleToggleModalDetail = (
    todo: Todo,
    index?: number,
    isComment?: boolean
  ) => {
    dispatch(toggleModalDetail({ todo, index, isComment }));
  };

  const handleToggleAddTodo = () => {
    setIsAddTodo(!isAddTodo);
    setIdEditTodo(-1);
  };

  const handleToggleEditTodo = (idTodo: number) => {
    setIsOpenEditTodo(true);
    setIsAddTodo(false);
    setIdEditTodo(idTodo);
  };

  const handleDragTodo = ({ active, over }: DragEndEvent) => {
    if (over === null || active.id === over?.id) return;

    const originalPos = getIndexTodoById(listTodo, active.id);
    const newPos = getIndexTodoById(listTodo, over?.id);

    if (!checkPriority(listTodo, originalPos, newPos)) {
      return;
    }

    const newListTodo = arrayMove(listTodo, originalPos, newPos);
    dispatch(initListTodo(newListTodo));
  };

  const handleDragTodoProject = async ({ active, over }: DragEndEvent) => {
    if (over === null || active.id === over?.id) return;

    const originalPos = getIndexTodoById(listTodoProject, active.id);
    const newPos = getIndexTodoById(listTodoProject, over?.id);
    const newListTodo = arrayMove(listTodoProject, originalPos, newPos);

    if (projectSelected) {
      const newProject = {
        ...projectSelected,
        listTodo: newListTodo,
      };

      dispatch(updateProject(newProject));
      await editProjectApi(newProject);
    }
  };

  if (isHidden || (listTodoSorting.length === 0 && isOverdue)) {
    return;
  }

  const handleToggleTodo = (todo: Todo) => {
    if (projectSelected) {
      const updateProject = {
        ...projectSelected,
        listTodo: listTodoProject.map((item) =>
          item.id === todo.id
            ? {
                ...item,
                isComplete: !item.isComplete,
              }
            : item
        ),
      };
      editProjectApi(updateProject);
    } else {
      toggleCompleteTodoApi(todo);
    }
  };

  const handleAddTodo = (newTodo: Todo) => {
    if (projectSelected) {
      const updateProject = {
        ...projectSelected,
        listTodo: [...listTodoProject, newTodo],
      };

      addProjectApi(updateProject);
    } else {
      addTodoApi(newTodo);
    }
  };

  const handleEditTodo = (todo: Todo) => {
    if (projectSelected) {
      const updateProject = {
        ...projectSelected,
        listTodo: listTodoProject.map((item) =>
          item.id === todo.id ? todo : item
        ),
      };
      editProjectApi(updateProject);
    } else {
      editTodoApi(todo);
    }
  };

  const handleDeleteTodo = (id: number) => {
    if (projectSelected) {
      const updateProject = {
        ...projectSelected,
        listTodo: listTodoProject.filter((item) => item.id !== id),
      };
      editProjectApi(updateProject);
    } else {
      deleteTodoApi(id);
    }
  };

  const handleDuplicateTodo = (todo: Todo) => {
    if (projectSelected) {
      const updateProject = {
        ...projectSelected,
        listTodo: [...listTodoProject, todo],
      };
      addProjectApi(updateProject);
    } else {
      duplicateTodoApi(todo);
    }
  };

  return (
    <Stack
      width='100%'
      position='relative'
      sx={{
        flex: checkViewBoard ? '1 0 250px' : '1',
      }}
      paddingBottom='70px'
    >
      <Typography
        variant='h4'
        component='h1'
        fontWeight='bold'
        fontSize={checkViewBoard ? '18px' : '24px'}
        marginBottom={checkViewBoard ? '10px' : '0'}
      >
        {heading}
        {checkViewBoard && (
          <Typography
            component='span'
            color='secondary'
            sx={{
              marginLeft: '6px',
              fontWeight: '500',
            }}
          >
            {listTodoSorting.length}
          </Typography>
        )}
      </Typography>
      {!checkViewBoard && totalTaskComplete !== 0 && !isOverdue && (
        <Stack
          direction='row'
          alignItems='center'
          marginTop={1}
          marginBottom={1.5}
          gap={0.5}
        >
          <CheckCircleOutlinedIcon fontSize='small' color='secondary' />
          <Typography paragraph fontSize='14px'>
            {totalTaskComplete} {t('task.title')}
          </Typography>
        </Stack>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={projectSelected ? handleDragTodoProject : handleDragTodo}
      >
        <SortableContext
          items={listTodoSorting}
          strategy={verticalListSortingStrategy}
        >
          <Box
            sx={
              checkViewBoard
                ? {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    overflowY: 'auto',
                    maxHeight: 'calc(100vh - 200px)',
                    ...styleScrollbar,
                  }
                : {}
            }
          >
            {listTodoSorting.map((todo, index) => (
              <TodoItem
                key={todo.id}
                indexTodo={index}
                todo={todo}
                idEditTodo={idEditTodo}
                isOpenEditTodo={isOpenEditTodo}
                listTodoCurrent={listTodoSorting}
                onToggleCompleteTodo={handleToggleTodo}
                onDeleteTodo={handleDeleteTodo}
                onToggleEditTodo={handleToggleEditTodo}
                onEditTodo={handleEditTodo}
                onDuplicate={handleDuplicateTodo}
                onSeeDetailTodo={handleToggleModalDetail}
              />
            ))}
            {!isOverdue && !isAddTodo && (
              <Button
                disableRipple
                onClick={handleToggleAddTodo}
                startIcon={
                  <AddIcon
                    fontSize='small'
                    color='primary'
                    sx={{ borderRadius: '50%' }}
                  />
                }
                color='secondary'
                sx={{
                  marginTop: 2.5,
                  justifyContent: 'flex-start',
                  fontWeight: 'normal',
                  '&.MuiButton-root:hover .MuiSvgIcon-root': {
                    color: 'white',
                    backgroundColor: 'primary.main',
                  },
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'transparent',
                    transition: 'none',
                  },
                }}
              >
                {t('actions.addTask')}
              </Button>
            )}
            {!isOverdue && isAddTodo && idEditTodo === -1 && (
              <TodoEditor
                onAddTodo={handleAddTodo}
                onCancelAdd={handleToggleAddTodo}
                level={level}
                disabledPopup={disabledPopup}
                defaultTime={type}
              />
            )}
          </Box>
        </SortableContext>
      </DndContext>
      {!isAddTodo &&
        (listTodoSorting.length === 0 || listTodo.length === 0) && (
          <Stack maxWidth={300} alignItems='center' marginX='auto'>
            <img src={backgroundEmpty} alt='background'></img>
            <Typography paragraph align='center'>
              {listTodo.length === 0 ? t('task.noTask') : t('task.noTaskSort')}
            </Typography>
          </Stack>
        )}
    </Stack>
  );
};

export default TodoList;
