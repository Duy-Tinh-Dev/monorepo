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
import { todoListSelector } from '@/redux/selectors';

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
  const listTodo = useSelector(todoListSelector);
  const [currentTodo, setCurrentTodo] = useState<Todo[]>([todo]);

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

    toggleCompleteSubTodo(currentTodo.slice(-1)[0].id, todo.id, listTodo);
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

    addSubTodo(currentTodo.slice(-1)[0].id, newTodo, listTodo);
  };

  const handleEditSubTodo = (todo: Todo) => {
    editSubTodo(currentTodo.slice(-1)[0].id, todo.id, todo, listTodo);

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
    deleteSubTodo(currentTodo.slice(-1)[0].id, idSubTodo, listTodo);
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

    duplicateSubTodo(currentTodo.slice(-1)[0].id, todo, listTodo);
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
    editTodoDetail(todo.id, todo, listTodo);
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
    addComment(currentTodo.slice(-1)[0].id, comment, listTodo);
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
    editComment(currentTodo.slice(-1)[0].id, comment, listTodo);
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
    deleteComment(currentTodo.slice(-1)[0].id, idComment, listTodo);
  };

  const handleUpdateSubTodos = (subTasks: Todo[]) => {
    updateSubTodos(currentTodo.slice(-1)[0].id, subTasks, listTodo);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2.5,
          width: '100%',
          height: '80%',
        },
      }}
      maxWidth='md'
    >
      <Header
        isDisabledNext={isDisabledNextTodo}
        isDisabledPrevious={isDisabledPreviousTodo || currentTodo.length > 1}
        onNextTodoDetail={handleNextDetailTodo}
        onPreviousTodoDetail={onPreviousTodoDetail}
        onClose={onClose}
      />
      <Divider />
      <Stack direction='row' height='100%'>
        <Stack width='70%' paddingX={2} paddingY={1.5}>
          {currentTodo.length > 1 && (
            <NavigationTodo
              currentTodo={currentTodo}
              onBackDetailTodo={handleBackDetailTodo}
            />
          )}
          <Stack direction='row'>
            <TodoStatus
              onEditTodo={handleEditTodoDetail}
              todo={currentTodo.slice(-1)[0]}
            />
            <Stack flexGrow='1'>
              <TodoContent
                onEditTodo={handleEditTodoDetail}
                todo={currentTodo.slice(-1)[0]}
              />
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
        </Stack>
        <Stack
          width='30%'
          paddingX={2}
          paddingY={1.5}
          sx={{
            backgroundColor: 'grey.100',
          }}
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
