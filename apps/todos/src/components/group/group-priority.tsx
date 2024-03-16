import React, { useState } from 'react';
import { Box, Button, Divider, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { TodoEditor } from '@/components/todo-list/todo-editor';
import { PriorityLevels, Todo } from '@/components/todo-list/types';
import { TodoItem } from '@/components/todo-list/todo-item';
import { useTranslation } from '@op/i18n';
import {
  addTodoApi,
  deleteTodoApi,
  duplicateTodoApi,
  toggleCompleteTodoApi,
} from 'src/api';

interface GroupPriorityProps {
  level: PriorityLevels;
  listTodoSorting: Todo[];
  onSeeDetailTodo: (todo: Todo, index?: number) => void;
}

const GroupPriority: React.FC<GroupPriorityProps> = ({
  listTodoSorting,
  level,
  onSeeDetailTodo,
}) => {
  const { t } = useTranslation(['common']);
  const [isAddTodo, setIsAddTodo] = useState(false);
  const [idEditTodo, setIdEditTodo] = useState(-1);
  const [isOpenEditTodo, setIsOpenEditTodo] = useState(false);

  const filterListTodo = listTodoSorting.filter(
    (todo) => todo.priority.level === level
  );

  const handleToggleAddTodo = () => {
    setIsAddTodo(!isAddTodo);
    setIdEditTodo(-1);
  };

  const handleToggleEditTodo = (idTodo: number) => {
    setIsOpenEditTodo(true);
    setIsAddTodo(false);
    setIdEditTodo(idTodo);
  };

  const getValueLevel = (level: PriorityLevels) => {
    switch (level) {
      case PriorityLevels.P3:
        return 3;
      case PriorityLevels.P2:
        return 2;
      case PriorityLevels.P1:
        return 1;
      default:
        return 1;
    }
  };

  return (
    <>
      {filterListTodo.length > 0 && (
        <Box marginBottom={4}>
          <Typography fontWeight='bold' fontSize='18px' marginBottom={1.5}>
            {t('priority.title')} {getValueLevel(level)}
          </Typography>
          <Divider
            sx={{
              marginBottom: 1.5,
            }}
          />
          {filterListTodo.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              idEditTodo={idEditTodo}
              isOpenEditTodo={isOpenEditTodo}
              onToggleCompleteTodo={toggleCompleteTodoApi}
              onDeleteTodo={deleteTodoApi}
              onToggleEditTodo={handleToggleEditTodo}
              onEditTodo={addTodoApi}
              onDuplicate={duplicateTodoApi}
              onSeeDetailTodo={onSeeDetailTodo}
            />
          ))}
          {!isAddTodo && (
            <Button
              disableRipple
              onClick={handleToggleAddTodo}
              startIcon={
                <AddIcon
                  fontSize='small'
                  color='primary'
                  sx={{ borderRadius: '50%' }}
                />
              }
              color='secondary'
              sx={{
                justifyContent: 'flex-start',
                fontWeight: 'normal',
                '&.MuiButton-root:hover .MuiSvgIcon-root': {
                  color: 'white',
                  backgroundColor: 'primary.main',
                },
                '&:hover': {
                  color: 'primary.main',
                  backgroundColor: 'transparent',
                  transition: 'none',
                },
              }}
            >
              {t('actions.addTask')}
            </Button>
          )}

          {isAddTodo && idEditTodo === -1 && (
            <TodoEditor
              type='edit'
              onCancelAdd={handleToggleAddTodo}
              level={level}
              disabledPopup
              onAddTodo={addTodoApi}
            />
          )}
        </Box>
      )}
    </>
  );
};

export default GroupPriority;
