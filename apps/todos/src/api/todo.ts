import { Todo } from '@/components/todo-list/types';
import { db } from '@/config/firebase';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

export const toggleCompleteTodoApi = async (todo: Todo) => {
  await updateDoc(doc(db, 'todos', String(todo.id)), {
    isComplete: !todo.isComplete,
  });
};

export const addTodoApi = async (todo: Todo) => {
  await setDoc(doc(db, 'todos', String(todo.id)), {
    ...todo,
  });
};

export const editTodoApi = async (todo: Todo) => {
  await updateDoc(doc(db, 'todos', String(todo.id)), {
    ...todo,
  });
};

export const deleteTodoApi = async (id: number) => {
  await deleteDoc(doc(db, 'todos', String(id)));
};

export const duplicateTodoApi = async (todo: Todo) => {
  await setDoc(doc(db, 'todos', String(todo.id)), {
    ...todo,
  });
};

export const getAllTodoUser = (
  userId: string,
  cb: (listTodo: Todo[]) => void
) => {
  const q = query(collection(db, 'todos'), where('userId', '==', userId));
  onSnapshot(q, (querySnapshot) => {
    const todos: Todo[] = [];
    querySnapshot.forEach((doc) => {
      todos.push({
        ...(doc.data() as Todo),
        id: Number(doc.id),
      });
    });
    cb(todos);
  });
};
