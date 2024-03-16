import { useEffect, useState } from 'react';
import { Button, CircularProgress, Stack, Typography } from '@mui/material';
import { DndContext, DragEndEvent, closestCorners } from '@dnd-kit/core';
import { useNavigate } from 'react-router-dom';
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
  deleteTodoApi,
  duplicateTodoApi,
  editTodoApi,
  getAllTodoUser,
  toggleCompleteTodoApi,
} from 'src/api';
import { useAuth } from '@/contexts/auth-context';
import {
  counterTodoSelector,
  filterSelector,
  listTodoSortingSelector,
  todoListSelector,
} from '@/redux/selectors';
import { initListTodo } from '@/redux/slices/todoSlice';
import { useSensors, useDisclosure } from '@/hooks';
import { getIndexTodoById, checkPriority } from '@/utils';
import { TodoEditor } from './todo-editor';
import TodoItem from './todo-item/todo-item';
import { GroupPriority } from '../group';
import { TodoDetailModal } from './todo-detail-modal';
import { ViewMenuOption } from '../view-menu-option';
import { PriorityBy, PriorityLevels, Todo } from './types';
import backgroundEmpty from '@/assets/background.png';

const levels: PriorityLevels[] = [
  PriorityLevels.P1,
  PriorityLevels.P2,
  PriorityLevels.P3,
];

const TodoList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(['common', 'option']);
  const { currentUser } = useAuth();
  const { sensors } = useSensors();

  const listTodo = useSelector(todoListSelector);
  const { groupBy, priority } = useSelector(filterSelector);
  const totalTodoComplete = useSelector(counterTodoSelector);
  const listTodoSorting = useSelector(listTodoSortingSelector);

  const [loading, setLoading] = useState(true);
  const [isCommentModal, setIsCommentModal] = useState(false);

  const [todoDetail, setTodoDetail] = useState<Todo>();
  const [indexTodoDetail, setIndexTodoDetail] = useState(0);
  const [isAddTodo, setIsAddTodo] = useState(false);
  const [idEditTodo, setIdEditTodo] = useState(-1);
  const [isOpenEditTodo, setIsOpenEditTodo] = useState(false);

  const todoDetailModalDisclosure = useDisclosure({});

  const levelPriority: PriorityLevels | undefined =
    priority !== PriorityBy.DEFAULT ? PriorityLevels[priority] : undefined;

  const setListTodo = (todos: Todo[]) => {
    dispatch(initListTodo(todos));
    setLoading(false);
  };

  useEffect(() => {
    if (currentUser) {
      getAllTodoUser(currentUser.uid, setListTodo);
    } else {
      navigate('/auth/login');
    }
  }, [currentUser]);

  const handleToggleModalDetail = (
    todo: Todo,
    index?: number,
    isComment?: boolean
  ) => {
    setTodoDetail(todo);
    todoDetailModalDisclosure.onOpen();
    setIndexTodoDetail(index ?? 0);

    if (isComment) {
      setIsCommentModal(true);
    } else {
      setIsCommentModal(false);
    }
  };

  const handleToggleCommentDetail = (isComment: boolean) => {
    setIsCommentModal(isComment);
  };

  const handleNextDetailTodo = () => {
    const nextIndex = indexTodoDetail + 1;

    setTodoDetail(listTodoSorting[nextIndex]);
    setIndexTodoDetail(nextIndex);
  };

  const handlePreviousDetailTodo = () => {
    const preIndex = indexTodoDetail - 1;

    setTodoDetail(listTodoSorting[preIndex]);
    setIndexTodoDetail(preIndex);
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
    if (checkPriority(listTodo, originalPos, newPos)) {
      const newListTodo = arrayMove(listTodo, originalPos, newPos);
      dispatch(initListTodo(newListTodo));
    }
  };

  return (
    <Stack
      maxHeight={500}
      width='100%'
      position='relative'
      paddingX='110px'
      marginTop={6}
    >
      <Typography variant='h4' component='h1' fontWeight='bold'>
        {t('date.today')}
      </Typography>
      {!loading && listTodo.length > 0 && (
        <Stack
          direction='row'
          alignItems='center'
          marginTop={1}
          marginBottom={1.5}
          gap={0.5}
        >
          <CheckCircleOutlinedIcon fontSize='small' color='secondary' />
          <Typography paragraph fontSize='14px'>
            {totalTodoComplete} {t('task.title')}
          </Typography>
        </Stack>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragTodo}
      >
        <SortableContext
          items={listTodoSorting}
          strategy={verticalListSortingStrategy}
        >
          {groupBy === t('option:groupBy.priority') ? (
            levels.map((level, index) => (
              <GroupPriority
                key={index}
                listTodoSorting={listTodoSorting}
                level={level}
                onSeeDetailTodo={handleToggleModalDetail}
              />
            ))
          ) : (
            <>
              {!loading &&
                listTodoSorting.map((todo, index) => (
                  <TodoItem
                    key={todo.id}
                    indexTodo={index}
                    todo={todo}
                    idEditTodo={idEditTodo}
                    isOpenEditTodo={isOpenEditTodo}
                    onToggleCompleteTodo={toggleCompleteTodoApi}
                    onDeleteTodo={deleteTodoApi}
                    onToggleEditTodo={handleToggleEditTodo}
                    onEditTodo={editTodoApi}
                    onDuplicate={duplicateTodoApi}
                    onSeeDetailTodo={handleToggleModalDetail}
                  />
                ))}
              {loading && (
                <Stack alignItems='center' justifyContent='center' marginY={10}>
                  <CircularProgress />
                </Stack>
              )}
              {!isAddTodo && (
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
              {isAddTodo && idEditTodo === -1 && (
                <TodoEditor
                  onAddTodo={addTodoApi}
                  onCancelAdd={handleToggleAddTodo}
                  level={levelPriority}
                  disabledPopup={priority !== PriorityBy.DEFAULT}
                />
              )}
            </>
          )}
        </SortableContext>
      </DndContext>
      {currentUser &&
        !loading &&
        !isAddTodo &&
        (listTodoSorting.length === 0 || listTodo.length === 0) && (
          <Stack maxWidth={300} alignItems='center' marginX='auto'>
            <img src={backgroundEmpty} alt='background'></img>
            <Typography paragraph align='center'>
              {listTodo.length === 0 ? t('task.noTask') : t('task.noTaskSort')}
            </Typography>
          </Stack>
        )}
      {!loading && todoDetailModalDisclosure.isOpen && todoDetail && (
        <TodoDetailModal
          isComment={isCommentModal}
          isDisabledNextTodo={indexTodoDetail === listTodo.length - 1}
          isDisabledPreviousTodo={indexTodoDetail === 0}
          isOpen={todoDetailModalDisclosure.isOpen}
          onClose={todoDetailModalDisclosure.onClose}
          todo={todoDetail}
          onToggleCommentDetail={handleToggleCommentDetail}
          onNextTodoDetail={handleNextDetailTodo}
          onPreviousTodoDetail={handlePreviousDetailTodo}
        />
      )}
      <ViewMenuOption
        sx={{
          position: 'absolute',
          right: '70px',
          top: '0',
        }}
      />
    </Stack>
  );
};

export default TodoList;
