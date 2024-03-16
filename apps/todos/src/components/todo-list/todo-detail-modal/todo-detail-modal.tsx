import React, { useEffect, useState } from 'react';
import { Dialog, Divider, Stack } from '@mui/material';
import { grey } from '@mui/material/colors';
import TodoContent from './todo-content';
import Header from './header';
import TodoStatus from './todo-status';
import { BaseTodo, Comment, Todo } from '../types';
import { TodoComment } from '../todo-comment';
import NavigationTodo from './navigation-todo';
import { SubTasks } from '../sub-task';
import Sidebar from './sidebar';

interface TodoDetailProps {
  isComment?: boolean;
  isOpen: boolean;
  todo: Todo;
  isDisabledNextTodo: boolean;
  isDisabledPreviousTodo: boolean;
  onClose: () => void;
  onToggleCommentDetail: (isComment: boolean) => void;
  onEditTodoDetail: (idTodo: number, todo: BaseTodo) => void;
  onAddSubTodo: (idTodo: number, subTodo: Todo) => void;
  onEditSubTodo: (id: number, idSubTodo: number, todo: BaseTodo) => void;
  onDeleteSubTodo: (idTodo: number, idSubTodo: number) => void;
  onDuplicateSubTodo: (idTodo: number, subTodo: Todo) => void;
  onAddComment: (idTodo: number, comment: Comment) => void;
  onEditComment: (idTodo: number, newComment: Comment) => void;
  onDeleteComment: (idTodo: number, idComment: number) => void;
  onUpdateSubTodos: (idTodo: number, subTasks: Todo[]) => void;
  onToggleCompleteSubTodo: (idTodo: number, idSubTodo: number) => void;
  onNextTodoDetail: () => void;
  onPreviousTodoDetail: () => void;
}

const TodoDetailModal: React.FC<TodoDetailProps> = ({
  isComment,
  todo,
  isOpen,
  isDisabledNextTodo,
  isDisabledPreviousTodo,
  onClose,
  onToggleCommentDetail,
  onAddSubTodo,
  onEditSubTodo,
  onAddComment,
  onEditTodoDetail,
  onDeleteSubTodo,
  onDuplicateSubTodo,
  onEditComment,
  onDeleteComment,
  onUpdateSubTodos,
  onToggleCompleteSubTodo,
  onNextTodoDetail,
  onPreviousTodoDetail,
}) => {
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

  const handleBackDetailTodo = () => {
    setCurrentTodo((prev) => prev.slice(0, -1));
  };

  const handleToggleCompleteSubTodo = (idSubTodo: number) => {
    onToggleCompleteSubTodo(currentTodo.slice(-1)[0].id, idSubTodo);

    currentTodo.slice(-1)[0].subTasks.map((subTask) => {
      if (subTask.id === idSubTodo) {
        subTask.isComplete = !subTask.isComplete;
      }
      return subTask;
    });
  };

  const handleAddSubTodo = (newTodo: Todo) => {
    onAddSubTodo(currentTodo.slice(-1)[0].id, newTodo);

    currentTodo.slice(-1)[0].subTasks.push(newTodo);
  };

  const handleEditSubTodo = (idSubTodo: number, todo: BaseTodo) => {
    onEditSubTodo(currentTodo.slice(-1)[0].id, idSubTodo, {
      name: todo.name,
      description: todo.description,
      priority: todo.priority,
    });

    currentTodo.slice(-1)[0].subTasks.map((subTask) => {
      if (subTask.id === idSubTodo) {
        subTask.name = todo.name;
        subTask.description = todo.description;
        subTask.priority = todo.priority;
      }
      return subTask;
    });
  };

  const handleDeleteSubTodo = (idSubTodo: number) => {
    currentTodo.slice(-1)[0].subTasks = currentTodo
      .slice(-1)[0]
      .subTasks.filter((subTask) => subTask.id !== idSubTodo);

    onDeleteSubTodo(currentTodo.slice(-1)[0].id, idSubTodo);
  };

  const handleDuplicateSubTodo = (subTodo: Todo) => {
    const newTodo = {
      ...subTodo,
      id: new Date().getTime(),
    };
    currentTodo.slice(-1)[0].subTasks.push(newTodo);

    onDuplicateSubTodo(currentTodo.slice(-1)[0].id, newTodo);
  };

  const handleEditTodoDetail = (todo: Todo) => {
    const lastTodo = currentTodo[currentTodo.length - 1];
    const updatedTodo = {
      ...lastTodo,
      ...todo,
    };

    onEditTodoDetail(lastTodo.id, updatedTodo);

    const newListCurrentTodo = currentTodo.slice(0, -1).concat(updatedTodo);
    setCurrentTodo(newListCurrentTodo);
  };

  const handleAddComment = (comment: Comment) => {
    onAddComment(currentTodo.slice(-1)[0].id, comment);

    currentTodo.slice(-1)[0].comments.push(comment);
  };

  const handleEditComment = (newComment: Comment) => {
    onEditComment(currentTodo.slice(-1)[0].id, newComment);

    currentTodo.slice(-1)[0].comments.map((comment) => {
      if (comment.id === newComment.id) {
        comment.name = newComment.name;
        comment.content = newComment.content;
      }
      return comment;
    });
  };

  const handleDeleteComment = (idComment: number) => {
    onDeleteComment(currentTodo.slice(-1)[0].id, idComment);

    currentTodo.slice(-1)[0].comments = currentTodo
      .slice(-1)[0]
      .comments.filter((comment) => comment.id !== idComment);
  };

  const handleUpdateSubTodos = (subTasks: Todo[]) => {
    onUpdateSubTodos(currentTodo.slice(-1)[0].id, subTasks);
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
