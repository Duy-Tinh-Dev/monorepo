import React, { useEffect, useState } from 'react';
import { Button, Input, Stack } from '@mui/material';
import { grey } from '@mui/material/colors';
import useDisclosure from '@hooks/useDisclosure';
import { useTranslation } from '@op/i18n';
import { Todo } from '../types';

interface TodoContentProps {
  todo: Todo;
  onEditTodo: (todo: Todo) => void;
}

const TodoContent: React.FC<TodoContentProps> = ({ todo, onEditTodo }) => {
  const { name, description } = todo;
  const { t } = useTranslation(['common']);
  const { isOpen, onOpen, onClose } = useDisclosure({});
  const [nameTodo, setNameTodo] = useState(name);
  const [descriptionTodo, setDescriptionTodo] = useState(description);

  useEffect(() => {
    setNameTodo(name);
    setDescriptionTodo(description);
  }, [name, description]);

  const handleChangeNameTodo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameTodo(event.target.value);
  };

  const handleChangeDescriptionTodo = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescriptionTodo(event.target.value);
  };

  const handleEditTodo = () => {
    const name = nameTodo.trim();
    const description = descriptionTodo.trim();
    if (name) {
      const newTodo = {
        ...todo,
        name,
        description,
      };
      onEditTodo(newTodo);
      onClose();
    }
  };

  return (
    <>
      <Stack
        paddingX={1.25}
        borderRadius={2.25}
        border={1}
        marginBottom={2}
        paddingBottom={isOpen ? 1.25 : 0}
        borderColor={isOpen ? grey[300] : 'transparent'}
      >
        <Input
          placeholder='Task name'
          fullWidth
          disableUnderline
          sx={{
            fontWeight: '500',
            fontSize: '20px',
          }}
          onFocus={onOpen}
          value={nameTodo}
          onChange={handleChangeNameTodo}
        />
        <Input
          placeholder='Description'
          fullWidth
          disableUnderline
          sx={{
            fontSize: '14px',
          }}
          onFocus={onOpen}
          value={descriptionTodo}
          onChange={handleChangeDescriptionTodo}
        />
      </Stack>
      {isOpen && (
        <Stack
          paddingY={1}
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
            onClick={onClose}
          >
            {t('actions.cancel')}
          </Button>
          <Button
            sx={{
              paddingX: 1.5,
              boxShadow: 'none',
            }}
            variant='contained'
            onClick={handleEditTodo}
          >
            {t('actions.save')}
          </Button>
        </Stack>
      )}
    </>
  );
};

export default TodoContent;
