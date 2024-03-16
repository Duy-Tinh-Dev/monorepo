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
import { grey } from '@mui/material/colors';
import FlagIcon from '@mui/icons-material/Flag';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { BaseTodo, LevelPriority, PriorityItem, Todo } from '../types';
import { PriorityList } from '../priority-list';
import { listPriority } from '@constants/constants';
import usePopover from '@hooks/usePopover';
import { useTranslation } from '@op/i18n';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@config/firebase';
import { useAuth } from '@context/auth-context';

interface TodoEditorProps {
  todo?: Todo;
  level?: LevelPriority;
  disabledPopup?: boolean;
  type?: 'add' | 'edit';
  onCancelAdd?: () => void;
  onCancelEdit?: (id: number) => void;
  onAddTodo?: (newTodo: Todo) => void;
  onEditTodo?: (todo: BaseTodo, id?: number) => void;
  sx?: SxProps;
}

const getPriorityItemByLevel = (level: LevelPriority | null): PriorityItem => {
  const index = listPriority.findIndex((item) => item.level === level);
  return listPriority[index];
};

const TodoEditor: React.FC<TodoEditorProps> = ({
  todo,
  level = null,
  type = 'add',
  disabledPopup,
  onCancelAdd,
  onAddTodo,
  onCancelEdit,
  onEditTodo,
  sx,
}) => {
  const { t } = useTranslation(['common']);
  const { currentUser } = useAuth();
  const { id, open, anchorEl, handleClick, handleClose } =
    usePopover('priority');

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
    const nameTodoTrim = nameTodo.trim();
    if (nameTodoTrim !== '') {
      const newTodo = {
        id: new Date().getTime(),
        name: nameTodoTrim,
        description: descriptionTodo.trim(),
        isComplete: false,
        priority: priorityTodo,
        comments: [],
        subTasks: [],
        userId: currentUser?.uid,
      };

      if (onAddTodo) {
        onAddTodo(newTodo);
      } else {
        const setListTodo = async () => {
          const { id, ...rest } = newTodo;
          const docRef = doc(db, 'todos', String(id));
          await setDoc(docRef, {
            ...rest,
          });
        };
        setListTodo();
      }
    }

    setNameTodo('');
    setDescriptionTodo('');
    setPriorityTodo(initialPriorityTodo);
    if (nameRef.current) {
      nameRef.current.focus();
    }
  };

  const handleEditTodo = () => {
    const contentTrim = nameTodo.trim();
    if (todo && contentTrim !== '') {
      onEditTodo &&
        onEditTodo(
          {
            name: nameTodo,
            description: descriptionTodo,
            priority: priorityTodo,
          },
          todo.id
        );
      setNameTodo('');
      setDescriptionTodo('');
      onCancelEdit && onCancelEdit(-1);
      return;
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (type === 'add') {
                  handleAddTodo();
                } else {
                  handleEditTodo();
                }
              }
            }}
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
            aria-describedby={id}
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
            onClick={handleClick}
          >
            {t('priority.title')}
          </Button>
          {!disabledPopup && (
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
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
                onClosePopover={handleClose}
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
