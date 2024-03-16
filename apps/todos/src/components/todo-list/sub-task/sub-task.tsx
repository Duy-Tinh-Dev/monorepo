import useDisclosure from '@hooks/useDisclosure';
import { Accordion } from '@components/accordion';
import TodoItem from '../todo-item/todo-item';
import { BaseTodo, Todo } from '../types';
import { useEffect, useState } from 'react';
import AddSubTask from './add-sub-task';
import { handleSortingByPriority } from '@utils/handleSortingByPriority';
import {
  DndContext,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { getIndexTodoById } from '@utils/getIndexTodoById';
import { checkPriority } from '@utils/checkPriority';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface SubTaskProps {
  subTasks: Todo[];
  onSeeDetailTodo: (nextTodo: Todo) => void;
  onToggleCompleteSubTodo: (idSubTodo: number) => void;
  onAddSubTodo: (newTodo: Todo) => void;
  onEditSubTodo: (idSubTodo: number, todo: BaseTodo) => void;
  onDeleteSubTodo: (idSubTodo: number) => void;
  onDuplicateSubTodo: (subTodo: Todo) => void;
  onUpdateSubTodos: (subTasks: Todo[]) => void;
}

const SubTasks: React.FC<SubTaskProps> = ({
  subTasks,
  onSeeDetailTodo,
  onToggleCompleteSubTodo,
  onAddSubTodo,
  onEditSubTodo,
  onDeleteSubTodo,
  onDuplicateSubTodo,
  onUpdateSubTodos,
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure({});
  const [idEditTodo, setIdEditTodo] = useState(-1);
  const [isOpenEditTodo, setIsOpenEditTodo] = useState(false);
  const [listTodoSorting, setListTodoSorting] = useState<Todo[]>([]);

  useEffect(() => {
    setListTodoSorting(handleSortingByPriority(subTasks));
  }, [subTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const handleToggleEditTodo = (idTodo: number) => {
    setIdEditTodo(idTodo);
    onClose();
    setIsOpenEditTodo(!isOpenEditTodo);
  };

  const handleToggleCompleteSubTodo = (idSubTodo: number) => {
    const newListTodo = listTodoSorting.map((subTask) => {
      if (subTask.id === idSubTodo) {
        return {
          ...subTask,
          isComplete: !subTask.isComplete,
        };
      }
      return subTask;
    });

    setListTodoSorting(newListTodo);
    onToggleCompleteSubTodo(idSubTodo);
  };

  const handleAddSubTodo = (newTodo: Todo) => {
    const newListTodo = [...listTodoSorting, newTodo];

    onAddSubTodo(newTodo);
    setListTodoSorting(handleSortingByPriority(newListTodo));
  };

  const handleEditSubTodo = (todo: BaseTodo, id?: number) => {
    if (id) {
      onEditSubTodo(id, {
        name: todo.name,
        description: todo.description,
        priority: todo.priority,
      });
    }

    const newListTodo = listTodoSorting.map((subTask) => {
      if (subTask.id === id) {
        return {
          ...subTask,
          name: todo.name,
          description: todo.description,
          priority: todo.priority,
        };
      }

      return subTask;
    });

    setListTodoSorting(handleSortingByPriority(newListTodo));
  };

  const handleDeleteSubTodo = (idSubTodo: number) => {
    const newListTodo = listTodoSorting.filter(
      (subTask) => subTask.id !== idSubTodo
    );
    setListTodoSorting(handleSortingByPriority(newListTodo));
    onDeleteSubTodo(idSubTodo);
  };

  const handleDuplicateTodo = (subTodo: Todo) => {
    const newTodo = {
      ...subTodo,
      id: new Date().getTime(),
    };

    const newListTodo = [...listTodoSorting, newTodo];

    setListTodoSorting(handleSortingByPriority(newListTodo));
    onDuplicateSubTodo(subTodo);
  };

  if (listTodoSorting.length > 0) {
    return (
      <Accordion summary='Sub task'>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={({ active, over }) => {
            if (over !== null && active.id !== over?.id) {
              const originalPos = getIndexTodoById(listTodoSorting, active.id);
              const newPos = getIndexTodoById(listTodoSorting, over?.id);
              if (checkPriority(listTodoSorting, originalPos, newPos)) {
                setListTodoSorting((listTodo) => {
                  const newListTodo = arrayMove(listTodo, originalPos, newPos);
                  onUpdateSubTodos(newListTodo);

                  return newListTodo;
                });
              }
            }
          }}
        >
          <SortableContext
            items={listTodoSorting}
            strategy={verticalListSortingStrategy}
          >
            {listTodoSorting.map((subTask) => (
              <TodoItem
                key={subTask.id}
                idEditTodo={idEditTodo}
                todo={subTask}
                isOpenEditTodo={isOpenEditTodo}
                onToggleCompleteTodo={handleToggleCompleteSubTodo}
                onToggleEditTodo={handleToggleEditTodo}
                onEditTodo={handleEditSubTodo}
                onDeleteTodo={handleDeleteSubTodo}
                onDuplicate={handleDuplicateTodo}
                onSeeDetailTodo={onSeeDetailTodo}
              />
            ))}
            <AddSubTask
              isOpen={isOpen}
              onOpen={onOpen}
              onClose={onClose}
              onAddSubTodo={handleAddSubTodo}
            />
          </SortableContext>
        </DndContext>
      </Accordion>
    );
  }

  return (
    <AddSubTask
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      onAddSubTodo={handleAddSubTodo}
    />
  );
};

export default SubTasks;
