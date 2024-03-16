import { useEffect, useMemo, useState } from 'react';
import { Button, CircularProgress, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

import { getIndexTodoById } from '@utils/getIndexTodoById';
import { checkPriority } from '@utils/checkPriority';

import TodoEditor from './todo-editor/todo-editor';
import {
  BaseTodo,
  Comment,
  FilterPriority,
  GroupBy,
  LevelPriority,
  SortBy,
  Todo,
} from './types';
import TodoItem from './todo-item/todo-item';
import backgroundEmpty from '@assets/background.png';
import useDisclosure from '@hooks/useDisclosure';
import { TodoDetailModal } from './todo-detail-modal';

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { GroupPriority } from '@components/group';
import { useTranslation } from '@op/i18n';
import { ViewMenuOption } from '@components/view-menu-option';
import { handleSortingByPriority } from '@utils/handleSortingByPriority';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '@config/firebase';
import { useAuth } from '@context/auth-context';
import { useNavigate } from 'react-router-dom';

const initialFilterPriority = 'All (default)';
const levels: LevelPriority[] = ['high', 'medium', 'low'];

const handleSortingByName = (array: Todo[]): Todo[] => {
  return array.slice().sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA >= nameB) {
      return 1;
    }
    return -1;
  });
};

const handleUpdateTodo = async (todos: Todo[]) => {
  for (const todo of todos) {
    const updateTodo = async () => {
      await updateDoc(doc(db, 'todos', String(todo.id)), {
        ...todo,
      });
    };
    updateTodo();
  }
};

const TodoList = () => {
  const { t } = useTranslation(['common', 'option']);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [listTodo, setListTodo] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const todoDetailModalDisclosure = useDisclosure({});
  const [isCommentModal, setIsCommentModal] = useState(false);
  const [groupBy, setGroupBy] = useState<GroupBy>('None (default)');
  const [sortBy, setSortBy] = useState<SortBy>('Smart (default)');
  const [filterPriority, setFilterPriority] = useState<FilterPriority>(
    initialFilterPriority
  );

  const [todoDetail, setTodoDetail] = useState<Todo>();
  const [indexTodoDetail, setIndexTodoDetail] = useState(0);
  const [isAddTodo, setIsAddTodo] = useState(false);

  const [idEditTodo, setIdEditTodo] = useState(-1);
  const [isOpenEditTodo, setIsOpenEditTodo] = useState(false);
  const [listTodoSorting, setListTodoSorting] = useState<Todo[]>(
    handleSortingByPriority(listTodo)
  );

  const levelFilterPriority: LevelPriority | undefined =
    filterPriority !== initialFilterPriority
      ? (t(`priority.levels.${filterPriority}`) as LevelPriority)
      : undefined;

  const totalTodoComplete = useMemo(() => {
    return listTodo.filter((todo) => !todo.isComplete).length;
  }, [listTodo]);

  useEffect(() => {
    if (filterPriority !== initialFilterPriority) {
      const newListTodoSorting = listTodo.filter((todo) => {
        return todo.priority.level === t(`priority.levels.${filterPriority}`);
      });

      if (sortBy === 'Name') {
        setListTodoSorting(handleSortingByName(newListTodoSorting));
        return;
      }
      setListTodoSorting(handleSortingByPriority(newListTodoSorting));
      return;
    }

    if (sortBy === 'Name') {
      setListTodoSorting(handleSortingByName(listTodo));
      return;
    }

    setListTodoSorting(handleSortingByPriority(listTodo));
  }, [listTodo, groupBy, sortBy, filterPriority]);

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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleToggleAddTodo = () => {
    setIsAddTodo(!isAddTodo);
    setIdEditTodo(-1);
  };

  const handleToggleEditTodo = (idTodo: number) => {
    setIsOpenEditTodo(true);
    setIsAddTodo(false);
    setIdEditTodo(idTodo);
  };

  const handleToggleCompleteTodo = (idTodo: number) => {
    const toggleCompleteTodo = async () => {
      const docSnap = await getDoc(doc(db, 'todos', String(idTodo)));
      if (docSnap.exists()) {
        const todo: Todo = {
          ...(docSnap.data() as Todo),
          id: idTodo,
        };
        await updateDoc(doc(db, 'todos', String(idTodo)), {
          isComplete: !todo.isComplete,
        });
      }
    };

    toggleCompleteTodo();
  };

  const handleEditTodo = (todo: BaseTodo, idEdit?: number) => {
    const id = idEdit ?? idEditTodo;
    const editTodo = async () => {
      await updateDoc(doc(db, 'todos', String(id)), {
        ...todo,
      });
    };
    editTodo();
  };

  const handleDeleteTodo = (idTodo: number) => {
    const deleteTodo = async () => {
      await deleteDoc(doc(db, 'todos', String(idTodo)));
    };
    deleteTodo();
  };

  const handleDuplicate = (todo: Todo) => {
    const idNewTodo = new Date().getTime();
    const { id, ...rest } = todo;
    const duplicateTodo = async () => {
      await setDoc(doc(db, 'todos', String(idNewTodo)), {
        ...rest,
      });
    };
    duplicateTodo();
  };

  const handleToggleCompleteSubTodo = (idTodo: number, idSubTodo: number) => {
    const updatedListTodo = listTodo.map(function iter(todoItem): Todo {
      if (todoItem.id === idTodo) {
        return {
          ...todoItem,
          subTasks: todoItem.subTasks.map((subTask) => {
            if (subTask.id === idSubTodo) {
              return {
                ...subTask,
                isComplete: !subTask.isComplete,
              };
            }
            return subTask;
          }),
        };
      }
      if (Array.isArray(todoItem.subTasks)) {
        return {
          ...todoItem,
          subTasks: todoItem.subTasks.map(iter),
        };
      }
      return todoItem;
    });

    handleUpdateTodo(updatedListTodo);
  };

  const handleAddSubTodo = (idTodo: number, subTodo: Todo) => {
    const updatedListTodo = listTodo.map(function iter(todoItem): Todo {
      if (todoItem.id === idTodo) {
        return {
          ...todoItem,
          subTasks: [...todoItem.subTasks, subTodo],
        };
      }
      if (Array.isArray(todoItem.subTasks)) {
        return {
          ...todoItem,
          subTasks: todoItem.subTasks.map(iter),
        };
      }
      return todoItem;
    });
    handleUpdateTodo(updatedListTodo);
  };

  const handleEditSubTodo = (id: number, idSubTodo: number, todo: BaseTodo) => {
    const updatedListTodo = listTodo.map(function iter(todoItem): Todo {
      if (todoItem.id === id) {
        return {
          ...todoItem,
          subTasks: todoItem.subTasks.map((subTask) => {
            if (subTask.id === idSubTodo) {
              return {
                ...subTask,
                name: todo.name,
                description: todo.description,
                priority: todo.priority,
              };
            }
            return subTask;
          }),
        };
      }
      if (Array.isArray(todoItem.subTasks)) {
        return {
          ...todoItem,
          subTasks: todoItem.subTasks.map(iter),
        };
      }
      return todoItem;
    });
    handleUpdateTodo(updatedListTodo);
  };

  const handleDeleteSubTodo = (idTodo: number, idSubTodo: number) => {
    const updatedListTodo = listTodo.map(function iter(todoItem): Todo {
      if (todoItem.id === idTodo) {
        return {
          ...todoItem,
          subTasks: todoItem.subTasks.filter(
            (subTask) => subTask.id !== idSubTodo
          ),
        };
      }
      if (Array.isArray(todoItem.subTasks)) {
        return {
          ...todoItem,
          subTasks: todoItem.subTasks.map(iter),
        };
      }
      return todoItem;
    });
    handleUpdateTodo(updatedListTodo);
  };

  const handleDuplicateSubTodo = (idTodo: number, subTodo: Todo) => {
    const updatedListTodo = listTodo.map(function iter(todoItem): Todo {
      if (todoItem.id === idTodo) {
        return {
          ...todoItem,
          subTasks: [...todoItem.subTasks, subTodo],
        };
      }
      if (Array.isArray(todoItem.subTasks)) {
        return {
          ...todoItem,
          subTasks: todoItem.subTasks.map(iter),
        };
      }
      return todoItem;
    });
    handleUpdateTodo(updatedListTodo);
  };

  const handleEditTodoDetail = (idTodo: number, todo: BaseTodo) => {
    const updatedListTodo = listTodo.map(function iter(todoItem): Todo {
      if (todoItem.id === idTodo) {
        return {
          ...todoItem,
          ...todo,
        };
      }
      if (Array.isArray(todoItem.subTasks)) {
        return {
          ...todoItem,
          subTasks: todoItem.subTasks.map(iter),
        };
      }
      return todoItem;
    });
    handleUpdateTodo(updatedListTodo);
  };

  const handleAddComment = (idTodo: number, comment: Comment) => {
    const updatedListTodo = listTodo.map(function iter(todoItem): Todo {
      if (todoItem.id === idTodo) {
        return {
          ...todoItem,
          comments: [...todoItem.comments, comment],
        };
      }
      if (Array.isArray(todoItem.subTasks)) {
        return {
          ...todoItem,
          subTasks: todoItem.subTasks.map(iter),
        };
      }
      return todoItem;
    });

    setListTodo(updatedListTodo);
  };

  const handleEditComment = (idTodo: number, newComment: Comment) => {
    const updatedListTodo = listTodo.map(function iter(todoItem): Todo {
      if (todoItem.id === idTodo) {
        return {
          ...todoItem,
          comments: todoItem.comments.map((comment) => {
            if (comment.id === newComment.id) {
              return newComment;
            }
            return comment;
          }),
        };
      }
      if (Array.isArray(todoItem.subTasks)) {
        return {
          ...todoItem,
          subTasks: todoItem.subTasks.map(iter),
        };
      }
      return todoItem;
    });
    handleUpdateTodo(updatedListTodo);
  };

  const handleDeleteComment = (idTodo: number, idComment: number) => {
    const updatedListTodo = listTodo.map(function iter(todoItem): Todo {
      if (todoItem.id === idTodo) {
        return {
          ...todoItem,
          comments: todoItem.comments.filter(
            (comment) => comment.id !== idComment
          ),
        };
      }
      if (Array.isArray(todoItem.subTasks)) {
        return {
          ...todoItem,
          subTasks: todoItem.subTasks.map(iter),
        };
      }
      return todoItem;
    });
    handleUpdateTodo(updatedListTodo);
  };

  const handleUpdateSubTodos = (idTodo: number, subTasks: Todo[]) => {
    const updatedListTodo = listTodo.map(function iter(todoItem): Todo {
      if (todoItem.id === idTodo) {
        return {
          ...todoItem,
          subTasks,
        };
      }
      if (Array.isArray(todoItem.subTasks)) {
        return {
          ...todoItem,
          subTasks: todoItem.subTasks.map(iter),
        };
      }
      return todoItem;
    });
    handleUpdateTodo(updatedListTodo);
  };

  const handleSetGroup = (type: GroupBy) => {
    setGroupBy(type);
  };

  const handleSetSort = (type: SortBy) => {
    setSortBy(type);
  };

  const handleSetFilterPriority = (type: FilterPriority) => {
    setFilterPriority(type);
  };

  useEffect(() => {
    const getListTodo = async () => {
      const q = query(
        collection(db, 'todos'),
        where('userId', '==', currentUser?.uid)
      );
      onSnapshot(q, (querySnapshot) => {
        const todos: Todo[] = [];
        querySnapshot.forEach((doc) => {
          todos.push({
            ...(doc.data() as Todo),
            id: Number(doc.id),
          });
        });
        setListTodo(todos);
        setLoading(false);
      });
    };
    if (currentUser) {
      getListTodo();
    } else {
      navigate('/auth/login');
    }
  }, [currentUser]);

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
        onDragEnd={({ active, over }) => {
          if (over !== null && active.id !== over?.id) {
            const originalPos = getIndexTodoById(listTodo, active.id);
            const newPos = getIndexTodoById(listTodo, over?.id);
            if (checkPriority(listTodo, originalPos, newPos)) {
              setListTodo((listTodo) => {
                return arrayMove(listTodo, originalPos, newPos);
              });
            }
          }
        }}
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
                onToggleCompleteTodo={handleToggleCompleteTodo}
                onDeleteTodo={handleDeleteTodo}
                onEditTodo={handleEditTodo}
                onDuplicate={handleDuplicate}
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
                    onToggleCompleteTodo={handleToggleCompleteTodo}
                    onDeleteTodo={handleDeleteTodo}
                    onToggleEditTodo={handleToggleEditTodo}
                    onEditTodo={handleEditTodo}
                    onDuplicate={handleDuplicate}
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
                  onCancelAdd={handleToggleAddTodo}
                  level={levelFilterPriority}
                  disabledPopup={filterPriority !== initialFilterPriority}
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
          onAddComment={handleAddComment}
          onEditComment={handleEditComment}
          onDeleteComment={handleDeleteComment}
          onAddSubTodo={handleAddSubTodo}
          onEditSubTodo={handleEditSubTodo}
          onEditTodoDetail={handleEditTodoDetail}
          onDeleteSubTodo={handleDeleteSubTodo}
          onDuplicateSubTodo={handleDuplicateSubTodo}
          onUpdateSubTodos={handleUpdateSubTodos}
          onToggleCompleteSubTodo={handleToggleCompleteSubTodo}
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
        groupBy={groupBy}
        sortBy={sortBy}
        filterPriority={filterPriority}
        onSetGroup={handleSetGroup}
        onSetSort={handleSetSort}
        onSetFilterSort={handleSetFilterPriority}
      />
    </Stack>
  );
};

export default TodoList;
