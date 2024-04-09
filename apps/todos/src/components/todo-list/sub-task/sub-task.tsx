import { useEffect, useState } from 'react';
import { DndContext, DragEndEvent, closestCorners } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDisclosure, useSensors } from '@/hooks';
import { Accordion } from '@/components/accordion';
import {
  handleSortingByPriority,
  getIndexTodoById,
  checkPriority,
} from '@/utils';
import TodoItem from '../todo-item/todo-item';
import AddSubTask from './add-sub-task';
import { Todo } from '../types';

interface SubTaskProps {
  subTasks: Todo[];
  onSeeDetailTodo: (nextTodo: Todo) => void;
  onToggleCompleteSubTodo: (todo: Todo) => void;
  onAddSubTodo: (newTodo: Todo) => void;
  onEditSubTodo: (todo: Todo) => void;
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

  const { sensors } = useSensors();

  const handleToggleEditTodo = (idTodo: number) => {
    setIdEditTodo(idTodo);
    onClose();
    setIsOpenEditTodo(!isOpenEditTodo);
  };

  const handleDragTodo = ({ active, over }: DragEndEvent) => {
    if (over === null || active.id === over?.id) return;

    const originalPos = getIndexTodoById(listTodoSorting, active.id);
    const newPos = getIndexTodoById(listTodoSorting, over?.id);
    if (checkPriority(listTodoSorting, originalPos, newPos)) {
      setListTodoSorting((listTodo) => {
        const newListTodo = arrayMove(listTodo, originalPos, newPos);
        onUpdateSubTodos(newListTodo);

        return newListTodo;
      });
    }
  };

  if (listTodoSorting.length > 0) {
    return (
      <Accordion summary='Sub task'>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragTodo}
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
                allowViewBoard={false}
                onToggleCompleteTodo={onToggleCompleteSubTodo}
                onToggleEditTodo={handleToggleEditTodo}
                onEditTodo={onEditSubTodo}
                onDeleteTodo={onDeleteSubTodo}
                onDuplicate={onDuplicateSubTodo}
                onSeeDetailTodo={onSeeDetailTodo}
              />
            ))}
            <AddSubTask
              isOpen={isOpen}
              onOpen={onOpen}
              onClose={onClose}
              onAddSubTodo={onAddSubTodo}
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
      onAddSubTodo={onAddSubTodo}
    />
  );
};

export default SubTasks;
