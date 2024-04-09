import React, { useEffect, useState } from 'react';
import { Dialog, Divider, Stack } from '@mui/material';
import { grey } from '@mui/material/colors';
import TodoContent from './todo-content';
import Header from './header';
import TodoStatus from './todo-status';
import { Comment, Todo } from '../types';
import { TodoComment } from '../todo-comment';
import NavigationTodo from './navigation-todo';
import { SubTasks } from '../sub-task';
import Sidebar from './sidebar';
import {
  toggleCompleteSubTodo,
  addSubTodo,
  deleteSubTodo,
  duplicateSubTodo,
  editTodoDetail,
  editSubTodo,
  addComment,
  editComment,
  deleteComment,
  updateSubTodos,
} from './utils';
import { useSelector } from 'react-redux';
import {
  listTodoProjectSelector,
  projectSelectedSelector,
  todoListSelector,
} from '@/redux/selectors';

interface TodoDetailProps {
  isComment?: boolean;
  isOpen: boolean;
  isDisabledNextTodo: boolean;
  isDisabledPreviousTodo: boolean;
  todo: Todo;
  onClose: () => void;
  onToggleCommentDetail: (isComment: boolean) => void;
  onNextTodoDetail: () => void;
  onPreviousTodoDetail: () => void;
}

const TodoDetailModal: React.FC<TodoDetailProps> = ({
  isComment,
  isOpen,
  isDisabledNextTodo,
  isDisabledPreviousTodo,
  todo,
  onClose,
  onToggleCommentDetail,
  onNextTodoDetail,
  onPreviousTodoDetail,
}) => {
  const listTodo = useSelector(todoListSelector) ?? [];
  const [currentTodo, setCurrentTodo] = useState<Todo[]>([todo]);
  const listTodoProject = useSelector(listTodoProjectSelector) ?? [];
  const projectSelected = useSelector(projectSelectedSelector);

  useEffect(() => {
    setCurrentTodo([todo]);
  }, [todo]);

  const handleNextDetailTodo = () => {
    if (currentTodo.length > 1) {
      setCurrentTodo((prev) => prev.slice(0, 1));
    } else {
      onNextTodoDetail();
    }
  };

  const handleBackDetailTodo = () => {
    const lastTodo = currentTodo.slice(-1)[0];
    const prevCurrentTodo = currentTodo.slice(0, -1);
    const updateCurrentTodo = [
      ...prevCurrentTodo.slice(0, -1),
      {
        ...prevCurrentTodo.slice(-1)[0],
        subTasks: prevCurrentTodo.slice(-1)[0].subTasks.map((subTask) => {
          if (subTask.id === lastTodo.id) {
            return lastTodo;
          }
          return subTask;
        }),
      },
    ];

    setCurrentTodo(updateCurrentTodo);
  };

  const handleSeeDetailTodo = (
    nextTodo: Todo,
    _indexTodo?: number,
    isComment?: boolean
  ) => {
    setCurrentTodo((prev) => [...prev, nextTodo]);

    if (isComment) {
      onToggleCommentDetail(true);
    } else {
      onToggleCommentDetail(false);
    }
  };

  const handleToggleCompleteSubTodo = (todo: Todo) => {
    const updatedSubTasks = currentTodo.slice(-1)[0].subTasks.map((subTask) => {
      if (subTask.id === todo.id) {
        return {
          ...subTask,
          isComplete: !subTask.isComplete,
        };
      }
      return subTask;
    });

    setCurrentTodo((prev) => {
      return [
        ...prev.slice(0, -1),
        {
          ...prev.slice(-1)[0],
          subTasks: updatedSubTasks,
        },
      ];
    });

    if (projectSelected) {
      toggleCompleteSubTodo(
        currentTodo.slice(-1)[0].id,
        todo.id,
        listTodoProject,
        projectSelected
      );
    } else {
      toggleCompleteSubTodo(currentTodo.slice(-1)[0].id, todo.id, listTodo);
    }
  };

  const handleAddSubTodo = (newTodo: Todo) => {
    setCurrentTodo((prev) => {
      return [
        ...prev.slice(0, -1),
        {
          ...prev.slice(-1)[0],
          subTasks: [...prev.slice(-1)[0].subTasks, newTodo],
        },
      ];
    });

    if (projectSelected) {
      addSubTodo(
        currentTodo.slice(-1)[0].id,
        newTodo,
        listTodoProject,
        projectSelected
      );
    } else {
      addSubTodo(currentTodo.slice(-1)[0].id, newTodo, listTodo);
    }
  };

  const handleEditSubTodo = (todo: Todo) => {
    const updatedSubTasks = currentTodo.slice(-1)[0].subTasks.map((subTask) => {
      if (subTask.id === todo.id) {
        return {
          ...subTask,
          ...todo,
        };
      }
      return subTask;
    });

    setCurrentTodo((prev) => {
      return [
        ...prev.slice(0, -1),
        {
          ...prev.slice(-1)[0],
          subTasks: updatedSubTasks,
        },
      ];
    });

    if (projectSelected) {
      editSubTodo(
        currentTodo.slice(-1)[0].id,
        todo.id,
        todo,
        listTodoProject,
        projectSelected
      );
    } else {
      editSubTodo(currentTodo.slice(-1)[0].id, todo.id, todo, listTodo);
    }
  };

  const handleDeleteSubTodo = (idSubTodo: number) => {
    setCurrentTodo((prev) => {
      return [
        ...prev.slice(0, -1),
        {
          ...prev.slice(-1)[0],
          subTasks: currentTodo
            .slice(-1)[0]
            .subTasks.filter((subTask) => subTask.id !== idSubTodo),
        },
      ];
    });

    if (projectSelected) {
      deleteSubTodo(
        currentTodo.slice(-1)[0].id,
        idSubTodo,
        listTodoProject,
        projectSelected
      );
    } else {
      deleteSubTodo(currentTodo.slice(-1)[0].id, idSubTodo, listTodo);
    }
  };

  const handleDuplicateSubTodo = (todo: Todo) => {
    setCurrentTodo((prev) => {
      return [
        ...prev.slice(0, -1),
        {
          ...prev.slice(-1)[0],
          subTasks: [...prev.slice(-1)[0].subTasks, todo],
        },
      ];
    });

    if (projectSelected) {
      duplicateSubTodo(
        currentTodo.slice(-1)[0].id,
        todo,
        listTodoProject,
        projectSelected
      );
    } else {
      duplicateSubTodo(currentTodo.slice(-1)[0].id, todo, listTodo);
    }
  };

  const handleEditTodoDetail = (todo: Todo) => {
    setCurrentTodo((pre) => {
      return [
        ...pre.slice(0, -1),
        {
          ...pre.slice(-1)[0],
          ...todo,
        },
      ];
    });

    if (projectSelected) {
      editTodoDetail(todo.id, todo, listTodoProject, projectSelected);
    } else {
      editTodoDetail(todo.id, todo, listTodo);
    }
  };

  const handleAddComment = (comment: Comment) => {
    setCurrentTodo((prev) => {
      return [
        ...prev.slice(0, -1),
        {
          ...prev.slice(-1)[0],
          comments: [...prev.slice(-1)[0].comments, comment],
        },
      ];
    });

    if (projectSelected) {
      addComment(
        currentTodo.slice(-1)[0].id,
        comment,
        listTodoProject,
        projectSelected
      );
    } else {
      addComment(currentTodo.slice(-1)[0].id, comment, listTodo);
    }
  };

  const handleEditComment = (comment: Comment) => {
    const newComments = currentTodo.slice(-1)[0].comments.map((itemComment) => {
      if (itemComment.id === comment.id) {
        return {
          ...itemComment,
          ...comment,
        };
      }
      return itemComment;
    });

    setCurrentTodo((prev) => {
      return [
        ...prev.slice(0, -1),
        {
          ...prev.slice(-1)[0],
          comments: newComments,
        },
      ];
    });

    if (projectSelected) {
      editComment(
        currentTodo.slice(-1)[0].id,
        comment,
        listTodoProject,
        projectSelected
      );
    } else {
      editComment(currentTodo.slice(-1)[0].id, comment, listTodo);
    }
  };

  const handleDeleteComment = (idComment: number) => {
    setCurrentTodo((prev) => {
      return [
        ...prev.slice(0, -1),
        {
          ...prev.slice(-1)[0],
          comments: currentTodo
            .slice(-1)[0]
            .comments.filter((comment) => comment.id !== idComment),
        },
      ];
    });

    if (projectSelected) {
      deleteComment(
        currentTodo.slice(-1)[0].id,
        idComment,
        listTodoProject,
        projectSelected
      );
    } else {
      deleteComment(currentTodo.slice(-1)[0].id, idComment, listTodo);
    }
  };

  const handleUpdateSubTodos = (subTasks: Todo[]) => {
    if (projectSelected) {
      updateSubTodos(
        currentTodo.slice(-1)[0].id,
        subTasks,
        listTodoProject,
        projectSelected
      );
    } else {
      updateSubTodos(currentTodo.slice(-1)[0].id, subTasks, listTodo);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      sx={(theme) => ({
        '& .MuiDialog-paper': {
          borderRadius: 2.5,
          width: '100%',
          height: '80%',
        },
        '& > .MuiDialog-container > .MuiPaper-elevation': {
          [theme.breakpoints.up('sm')]: {
            margin: '32px',
          },
          [theme.breakpoints.down('sm')]: {
            margin: '16px',
          },
        },
      })}
    >
      <Header
        isDisabledNext={isDisabledNextTodo}
        isDisabledPrevious={isDisabledPreviousTodo || currentTodo.length > 1}
        onNextTodoDetail={handleNextDetailTodo}
        onPreviousTodoDetail={onPreviousTodoDetail}
        onClose={onClose}
      />
      <Divider />
      <Stack
        height='100%'
        sx={(theme) => ({
          [theme.breakpoints.up('sm')]: {
            flexDirection: 'row',
          },
          [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
          },
        })}
      >
        <Stack
          sx={(theme) => ({
            [theme.breakpoints.up('sm')]: {
              width: '70%',
            },
            [theme.breakpoints.down('sm')]: {
              width: '100%',
            },
          })}
          paddingX={2}
          paddingY={1.5}
        >
          {currentTodo.length > 1 && (
            <NavigationTodo
              currentTodo={currentTodo}
              onBackDetailTodo={handleBackDetailTodo}
            />
          )}
          <TodoContent
            onEditTodo={handleEditTodoDetail}
            todo={currentTodo.slice(-1)[0]}
          />
          <Stack
            sx={(theme) => ({
              [theme.breakpoints.up('sm')]: {
                marginLeft: '32px',
              },
              [theme.breakpoints.down('sm')]: {
                marginLeft: '0',
              },
            })}
          >
            <SubTasks
              subTasks={currentTodo.slice(-1)[0].subTasks}
              onSeeDetailTodo={handleSeeDetailTodo}
              onAddSubTodo={handleAddSubTodo}
              onEditSubTodo={handleEditSubTodo}
              onDeleteSubTodo={handleDeleteSubTodo}
              onDuplicateSubTodo={handleDuplicateSubTodo}
              onUpdateSubTodos={handleUpdateSubTodos}
              onToggleCompleteSubTodo={handleToggleCompleteSubTodo}
            />
            {currentTodo.slice(-1)[0].subTasks.length === 0 && (
              <Divider
                sx={{
                  backgroundColor: grey[100],
                  opacity: 0.3,
                  marginTop: 1.25,
                  marginBottom: 2,
                }}
              />
            )}
            <TodoComment
              isComment={isComment}
              comments={currentTodo.slice(-1)[0].comments}
              onAddComment={handleAddComment}
              onEditComment={handleEditComment}
              onDeleteComment={handleDeleteComment}
              onToggleCommentDetail={onToggleCommentDetail}
            />
          </Stack>
        </Stack>
        <Stack
          sx={(theme) => ({
            backgroundColor: {
              sm: 'grey.100',
            },
            [theme.breakpoints.up('sm')]: {
              width: '30%',
            },
            [theme.breakpoints.down('sm')]: {
              width: '100%',
            },
          })}
          paddingX={2}
          paddingY={1.5}
        >
          <Sidebar
            todo={currentTodo.slice(-1)[0]}
            onEditPriority={handleEditTodoDetail}
          />
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default TodoDetailModal;
