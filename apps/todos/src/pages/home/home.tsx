import { TypeTime } from '@/@types/typeTime';
import { getAllProjectUser, getAllTodoUser } from '@/api';
import { TodoList } from '@/components/todo-list';
import {
  GroupBy,
  PriorityBy,
  PriorityLevels,
  Todo,
} from '@/components/todo-list/types';
import { useAuth } from '@/contexts/auth-context';
import {
  counterTodoSelector,
  filterSelector,
  listProjectSelector,
  listTodoGroupDateSelector,
  listTodoGroupPrioritySelector,
  listTodoOverdueSelector,
  listTodoTodaySelector,
  todoListSelector,
} from '@/redux/selectors';
import { initListTodo } from '@/redux/slices/todoSlice';
import { useTranslation } from '@op/i18n';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  formatHeaderDate,
  getIndexPriority,
  getLevelPriority,
  getListTodoByLevelPriority,
} from '@/utils';
import { Loading } from '@/components/loading';
import { initListProject } from '@/redux/slices/projectSlice';
import { Project } from '@/components/sidebar/sidebar-project/types';

const Home = () => {
  const { t } = useTranslation(['common']);
  const { currentUser } = useAuth();
  const { priority, groupBy } = useSelector(filterSelector);
  const dispatchEvent = useDispatch();

  const totalTaskComplete = useSelector(counterTodoSelector);
  const listTodoToday = useSelector(listTodoTodaySelector);
  const listTodoOverdue = useSelector(listTodoOverdueSelector);
  const listTodoGroupDate = useSelector(listTodoGroupDateSelector);
  const listTodoGroupPriority = useSelector(listTodoGroupPrioritySelector);
  const listTodo = useSelector(todoListSelector);
  const listProject = useSelector(listProjectSelector);
  const [loading, setLoading] = useState(!listTodo);

  const setListProject = (projects: Project[]) => {
    dispatchEvent(initListProject(projects));
  };

  const setListTodo = (todos: Todo[]) => {
    dispatchEvent(initListTodo(todos));
    setLoading(false);
  };

  const titlePriority = `${t('priority.title')} ${getIndexPriority(priority)}`;
  const level = getLevelPriority(priority);

  const checkLevelPriority = (todo: Todo) => {
    if (level === PriorityLevels.All) {
      return todo?.priority.level;
    }
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
          <>
            {priority === PriorityBy.DEFAULT && (
              <>
                <TodoList
                  heading='OverDue'
                  totalTaskComplete={totalTaskComplete}
                  listTodoSorting={listTodoOverdue}
                  type={TypeTime.OVERDUE}
                />
                <TodoList
                  heading={t('date.today')}
                  totalTaskComplete={totalTaskComplete}
                  listTodoSorting={listTodoToday}
                  type={TypeTime.TODAY}
                />
              </>
            )}
            {priority !== PriorityBy.DEFAULT && (
              <TodoList
                heading={titlePriority}
                totalTaskComplete={totalTaskComplete}
                level={level}
                listTodoSorting={getListTodoByLevelPriority(
                  listTodoGroupPriority,
                  priority
                )}
              />
            )}
          </>
        );
      case GroupBy.DATE:
        return (
          <>
            {listTodoGroupDate.map((todos, index) => (
              <TodoList
                key={index}
                heading={formatHeaderDate(todos[0]?.expireTime)}
                totalTaskComplete={todos?.length}
                listTodoSorting={todos}
                type={TypeTime.TODAY}
                isHidden={todos.length === 0}
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
              />
            )}
          </>
        );
      default:
        return;
    }
  };

  return <>{loading ? <Loading /> : renderTodo(groupBy)}</>;
};

export default Home;
