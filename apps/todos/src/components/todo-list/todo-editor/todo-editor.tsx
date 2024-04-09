import {
  Box,
  Button,
  Divider,
  Input,
  Popover,
  Stack,
  SxProps,
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { green, grey } from '@mui/material/colors';
import FlagIcon from '@mui/icons-material/Flag';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { PriorityItem, PriorityLevels, Todo } from '../types';
import { PriorityList } from '../priority-list';
import { useTranslation } from '@op/i18n';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import TodoDate from './todo-date';
import { listPriority } from '@/constants';
import { useAuth } from '@/contexts/auth-context';
import { usePopover } from '@/hooks';
import { TypeTime } from '@/@types/typeTime';
import { getColorTime, getLabelTime, getTimeAddDefault } from './utils';

interface TodoEditorProps {
  defaultTime?: TypeTime;
  todo?: Todo;
  level?: PriorityLevels;
  disabledPopup?: boolean;
  onCancelAdd?: () => void;
  onCancelEdit?: (id: number) => void;
  onAddTodo?: (newTodo: Todo) => void;
  onEditTodo?: (todo: Todo) => void;
  sx?: SxProps;
}

const getPriorityItemByLevel = (level: PriorityLevels | null): PriorityItem => {
  const index = listPriority.findIndex((item) => item.level === level);
  return listPriority[index];
};

const TodoEditor: React.FC<TodoEditorProps> = ({
  defaultTime,
  todo,
  level = null,
  disabledPopup,
  onCancelAdd,
  onAddTodo,
  onCancelEdit,
  onEditTodo,
  sx,
}) => {
  const { t } = useTranslation(['common']);
  const { currentUser } = useAuth();
  const priorityPopover = usePopover('priority');
  const todoDatePopover = usePopover('todo-date');

  const initialPriorityTodo =
    getPriorityItemByLevel(level) ??
    todo?.priority ??
    listPriority[listPriority.length - 1];
  const nameRef = useRef<HTMLInputElement>(null);
  const [nameTodo, setNameTodo] = useState(todo?.name ?? '');
  const [descriptionTodo, setDescriptionTodo] = useState(
    todo?.description ?? ''
  );
  const [priorityTodo, setPriorityTodo] =
    useState<PriorityItem>(initialPriorityTodo);
  const [expireTime, setExpireTime] = useState(todo?.expireTime);

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus();
    }
  }, []);

  const handleChangeNameTodo = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNameTodo(value);
  };

  const handleChangeDescriptionTodo = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDescriptionTodo(value);
  };

  const handleAddTodo = () => {
    const time = expireTime ?? getTimeAddDefault(defaultTime);

    const newTodo = {
      id: new Date().getTime(),
      name: nameTodo.trim(),
      description: descriptionTodo.trim(),
      isComplete: false,
      priority: priorityTodo,
      comments: [],
      subTasks: [],
      userId: currentUser?.uid,
      expireTime: time,
    };

    onAddTodo && onAddTodo(newTodo);

    setNameTodo('');
    setDescriptionTodo('');
    setPriorityTodo(initialPriorityTodo);
    if (nameRef.current) {
      nameRef.current.focus();
    }
  };

  const handleEditTodo = () => {
    if (todo && onEditTodo) {
      onEditTodo({
        ...todo,
        name: nameTodo.trim(),
        description: descriptionTodo.trim(),
        priority: priorityTodo,
        expireTime: expireTime,
      });
      setNameTodo('');
      setDescriptionTodo('');
      onCancelEdit && onCancelEdit(-1);
    }
  };

  const handleCancelEdit = () => {
    if (onCancelAdd) {
      onCancelAdd();
      return;
    }

    if (onCancelEdit) {
      onCancelEdit(-1);
    }
  };

  const handleClickPriorityTodoItem = (priorityTodoItem: PriorityItem) => {
    setPriorityTodo(priorityTodoItem);
  };

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') {
      return;
    }

    if (todo) {
      handleEditTodo();
    } else {
      handleAddTodo();
    }
  };

  return (
    <Box sx={sx} borderRadius={2.5} border={1} borderColor={grey[300]}>
      <Stack paddingX={1.25}>
        <Box paddingTop={1.25} mb={1}>
          <Input
            placeholder='Task name'
            fullWidth
            disableUnderline
            sx={{
              fontWeight: '500',
              fontSize: '14px',
            }}
            inputRef={nameRef}
            value={nameTodo}
            onChange={handleChangeNameTodo}
            onKeyDown={handleEnterKey}
          />
          <Input
            placeholder='Description'
            fullWidth
            disableUnderline
            sx={{
              fontSize: '14px',
            }}
            value={descriptionTodo}
            onChange={handleChangeDescriptionTodo}
          />
        </Box>
        <Stack direction='row' alignItems='center' gap='10px' mb={1.5}>
          <Button
            aria-describedby={todoDatePopover.id}
            size='small'
            variant='outlined'
            startIcon={<EditCalendarOutlinedIcon />}
            endIcon={
              expireTime !== '' && (
                <Button
                  sx={{
                    padding: 0,
                    minWidth: 0,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpireTime('');
                  }}
                >
                  <CloseOutlinedIcon
                    sx={{
                      color: grey[400],
                    }}
                    fontSize='small'
                  />
                </Button>
              )
            }
            sx={{
              fontWeight: 'normal',
              borderColor: grey[300],
              color: expireTime
                ? green[500]
                : getColorTime(defaultTime, expireTime),
              '& .MuiButton-startIcon': {
                marginRight: 0.5,
              },
              '&:hover': {
                borderColor: grey[300],
              },
            }}
            onClick={todoDatePopover.handleClick}
          >
            {getLabelTime(defaultTime, expireTime)}
          </Button>
          <Popover
            id={priorityPopover.id}
            open={todoDatePopover.open}
            anchorEl={todoDatePopover.anchorEl}
            onClose={todoDatePopover.handleClose}
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'center',
              horizontal: 'right',
            }}
          >
            <TodoDate
              expireTime={todo?.expireTime}
              setExpireTime={setExpireTime}
              onClose={todoDatePopover.handleClose}
            />
          </Popover>
          <Button
            aria-describedby={priorityPopover.id}
            size='small'
            variant='outlined'
            startIcon={<FlagIcon />}
            sx={{
              fontWeight: 'normal',
              borderColor: grey[300],
              color: priorityTodo.color,
              '& .MuiButton-startIcon': {
                marginRight: 0.5,
              },
              '&:hover': {
                borderColor: grey[300],
              },
            }}
            onClick={priorityPopover.handleClick}
          >
            {t('priority.title')}
          </Button>
          {!disabledPopup && (
            <Popover
              id={priorityPopover.id}
              open={priorityPopover.open}
              anchorEl={priorityPopover.anchorEl}
              onClose={priorityPopover.handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <PriorityList
                id={priorityTodo.id}
                onClickPriorityItem={handleClickPriorityTodoItem}
                onClosePopover={priorityPopover.handleClose}
              />
            </Popover>
          )}
          <Button
            color='secondary'
            size='small'
            variant='outlined'
            sx={{
              minWidth: 3.75,
              borderColor: grey[300],
              '&:hover': {
                borderColor: grey[300],
              },
            }}
          >
            <MoreHorizIcon fontSize='small' />
          </Button>
        </Stack>
      </Stack>
      <Divider />
      <Stack
        paddingY={1}
        paddingX={1.5}
        direction='row'
        justifyContent='right'
        alignItems='center'
        gap={1}
      >
        <Button
          sx={{
            paddingX: 1.5,
            color: grey[700],
            backgroundColor: grey[100],
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: grey[200],
              boxShadow: 'none',
            },
          }}
          variant='contained'
          onClick={handleCancelEdit}
        >
          {t('actions.cancel')}
        </Button>
        {todo ? (
          <Button
            sx={{
              paddingX: 1.5,
              boxShadow: 'none',
            }}
            variant='contained'
            disabled={!nameTodo}
            onClick={handleEditTodo}
          >
            {t('actions.save')}
          </Button>
        ) : (
          <Button
            sx={{
              paddingX: 1.5,
              boxShadow: 'none',
            }}
            variant='contained'
            disabled={!nameTodo}
            onClick={handleAddTodo}
          >
            {t('actions.addTask')}
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default TodoEditor;
