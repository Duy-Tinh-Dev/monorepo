import { editTodoApi } from '@/api/todo';
import { BaseTodo, Comment, Todo } from '../types';

export const toggleCompleteSubTodo = (
  idTodo: number,
  idSubTodo: number,
  listTodo: Todo[]
) => {
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

  for (const todo of updatedListTodo) {
    editTodoApi(todo);
  }
};

export const addSubTodo = (idTodo: number, subTodo: Todo, listTodo: Todo[]) => {
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

  for (const todo of updatedListTodo) {
    editTodoApi(todo);
  }
};

export const editSubTodo = (
  id: number,
  idSubTodo: number,
  todo: BaseTodo,
  listTodo: Todo[]
) => {
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

  for (const todo of updatedListTodo) {
    editTodoApi(todo);
  }
};

export const deleteSubTodo = (
  idTodo: number,
  idSubTodo: number,
  listTodo: Todo[]
) => {
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
  for (const todo of updatedListTodo) {
    editTodoApi(todo);
  }
};

export const duplicateSubTodo = (
  idTodo: number,
  subTodo: Todo,
  listTodo: Todo[]
) => {
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
  for (const todo of updatedListTodo) {
    editTodoApi(todo);
  }
};

export const editTodoDetail = (
  idTodo: number,
  todo: BaseTodo,
  listTodo: Todo[]
) => {
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
  for (const todo of updatedListTodo) {
    editTodoApi(todo);
  }
};

export const addComment = (
  idTodo: number,
  comment: Comment,
  listTodo: Todo[]
) => {
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

  for (const todo of updatedListTodo) {
    editTodoApi(todo);
  }
};

export const editComment = (
  idTodo: number,
  newComment: Comment,
  listTodo: Todo[]
) => {
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

  for (const todo of updatedListTodo) {
    editTodoApi(todo);
  }
};

export const deleteComment = (
  idTodo: number,
  idComment: number,
  listTodo: Todo[]
) => {
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
  for (const todo of updatedListTodo) {
    editTodoApi(todo);
  }
};

export const updateSubTodos = (
  idTodo: number,
  subTasks: Todo[],
  listTodo: Todo[]
) => {
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

  for (const todo of updatedListTodo) {
    editTodoApi(todo);
  }
};

