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
  listTodoProjectSelector,
  listProjectSelector,
  todoListSelector,
  filterSelector,
  listTodoProjectTodaySelector,
  listTodoProjectOverdueSelector,
  listTodoProjectGroupDateSelector,
  listTodoProjectGroupPrioritySelector,
  counterTodoProjectSelector,
} from '@/redux/selectors';
import { initListProject, selectProject } from '@/redux/slices/projectSlice';
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

const Projects = () => {
  const { t } = useTranslation(['common']);
  const { currentUser } = useAuth();
  const dispatchEvent = useDispatch();
  const listTodo = useSelector(todoListSelector);
  const listTodoProjectToday = useSelector(listTodoProjectTodaySelector);
  const listTodoProjectOverdue = useSelector(listTodoProjectOverdueSelector);
  const totalTaskProjectComplete = useSelector(counterTodoProjectSelector);
  const listTodoProjectGroupDate = useSelector(
    listTodoProjectGroupDateSelector
  );
  const listTodoProjectGroupPriority = useSelector(
    listTodoProjectGroupPrioritySelector
  );
  const listProject = useSelector(listProjectSelector);
  const listTodoProject = useSelector(listTodoProjectSelector);
  const { priority, groupBy } = useSelector(filterSelector);

  const [loading, setLoading] = useState(!listTodo || !listProject);

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

    return () => {
      dispatchEvent(selectProject(null));
    };
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
                  totalTaskComplete={totalTaskProjectComplete}
                  listTodoSorting={listTodoProjectOverdue}
                  type={TypeTime.OVERDUE}
                />
                <TodoList
                  heading={t('date.today')}
                  totalTaskComplete={totalTaskProjectComplete}
                  listTodoSorting={listTodoProjectToday}
                  type={TypeTime.TODAY}
                />
              </>
            )}
            {priority !== PriorityBy.DEFAULT && (
              <TodoList
                heading={titlePriority}
                totalTaskComplete={1}
                level={level}
                listTodoSorting={getListTodoByLevelPriority(
                  listTodoProjectGroupPriority,
                  priority
                )}
              />
            )}
          </>
        );
      case GroupBy.DATE:
        return (
          <>
            {listTodoProjectGroupDate.map((todos, index) => (
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
              listTodoProjectGroupPriority.map((todos, index) => (
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
                  listTodoProjectGroupPriority,
                  priority
                )}
                totalTaskComplete={
                  getListTodoByLevelPriority(
                    listTodoProjectGroupPriority,
                    priority
                  ).length
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

  return (
    <>{loading ? <Loading /> : <>{listTodoProject && renderTodo(groupBy)}</>}</>
  );
};

export default Projects;
