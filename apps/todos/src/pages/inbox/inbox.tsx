import { TypeTime } from '@/@types/typeTime';
import { getAllProjectUser, getAllTodoUser } from '@/api';
import { Loading } from '@/components/loading';
import { Project } from '@/components/sidebar/sidebar-project/types';
import { TodoList } from '@/components/todo-list';
import {
  GroupBy,
  PriorityBy,
  PriorityLevels,
  Todo,
} from '@/components/todo-list/types';
import { useAuth } from '@/contexts/auth-context';
import {
  filterSelector,
  listProjectSelector,
  listTodoGroupDateSelector,
  listTodoGroupPrioritySelector,
  listTodoInboxSelector,
  todoListSelector,
} from '@/redux/selectors';
import { initListProject } from '@/redux/slices/projectSlice';
import { initListTodo } from '@/redux/slices/todoSlice';
import {
  formatHeaderDate,
  getIndexPriority,
  getLevelPriority,
  getListTodoByLevelPriority,
} from '@/utils';
import { useTranslation } from '@op/i18n';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Inbox = () => {
  const { t } = useTranslation(['common']);
  const { currentUser } = useAuth();
  const dispatchEvent = useDispatch();

  const { priority, groupBy } = useSelector(filterSelector);
  const listTodoGroupDate = useSelector(listTodoGroupDateSelector);
  const listTodoInbox = useSelector(listTodoInboxSelector);
  const listTodoGroupPriority = useSelector(listTodoGroupPrioritySelector);
  const listTodo = useSelector(todoListSelector);
  const listProject = useSelector(listProjectSelector);
  const [loading, setLoading] = useState(!listTodo);
  const level = getLevelPriority(priority);

  const setListProject = (projects: Project[]) => {
    dispatchEvent(initListProject(projects));
  };

  const setListTodo = (todos: Todo[]) => {
    dispatchEvent(initListTodo(todos));
    setLoading(false);
  };

  useEffect(() => {
    if (!currentUser) return;

    if (!listTodo) {
      getAllTodoUser(currentUser.uid, setListTodo);
    }

    if (!listProject) {
      getAllProjectUser(currentUser.uid, setListProject);
    }
  }, [currentUser]);

  const renderTodo = (type: GroupBy) => {
    switch (type) {
      case GroupBy.DEFAULT:
        return (
          <TodoList
            heading={t('date.inbox')}
            listTodoSorting={listTodoInbox}
            type={TypeTime.INBOX}
            totalTaskComplete={0}
          />
        );

      case GroupBy.DATE:
        return (
          <>
            {listTodoGroupDate.map((todo, index) => (
              <TodoList
                key={index}
                heading={formatHeaderDate(todo[0].expireTime)}
                totalTaskComplete={todo?.length}
                listTodoSorting={todo}
                type={TypeTime.TODAY}
              />
            ))}
          </>
        );
      case GroupBy.PRIORITY:
        return (
          <>
            {priority === PriorityBy.DEFAULT &&
              listTodoGroupPriority.map((todos, index) => (
                <TodoList
                  key={index}
                  heading={`${t('priority.title')} ${index + 1}`}
                  listTodoSorting={todos}
                  totalTaskComplete={todos?.length}
                  level={checkLevelPriority(todos[0])}
                  type={TypeTime.INBOX}
                />
              ))}
            {priority !== PriorityBy.DEFAULT && (
              <TodoList
                heading={`${t('priority.title')} ${getIndexPriority(priority)}`}
                listTodoSorting={getListTodoByLevelPriority(
                  listTodoGroupPriority,
                  priority
                )}
                totalTaskComplete={
                  getListTodoByLevelPriority(listTodoGroupPriority, priority)
                    .length
                }
                level={level}
                type={TypeTime.INBOX}
              />
            )}
          </>
        );

      default:
        return;
    }
  };

  const checkLevelPriority = (todo: Todo) => {
    if (level === PriorityLevels.All) {
      return todo?.priority.level;
    }
  };

  return <>{loading ? <Loading /> : renderTodo(groupBy)}</>;
};

export default Inbox;
