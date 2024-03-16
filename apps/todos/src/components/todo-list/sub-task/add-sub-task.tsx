import { Button } from '@mui/material';
import { TodoEditor } from '../todo-editor';
import AddIcon from '@mui/icons-material/Add';
import { Todo } from '../types';
import { useTranslation } from '@op/i18n';

interface AddSubTaskProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onAddSubTodo: (newTodo: Todo) => void;
}

const AddSubTask = ({
  isOpen,
  onOpen,
  onClose,
  onAddSubTodo,
}: AddSubTaskProps) => {
  const { t } = useTranslation(['common']);

  return isOpen ? (
    <TodoEditor onCancelAdd={onClose} onAddTodo={onAddSubTodo} />
  ) : (
    <Button
      startIcon={<AddIcon fontSize='small' sx={{ borderRadius: '50%' }} />}
      color='secondary'
      sx={{
        fontWeight: 'normal',
        placeSelf: 'flex-start',
        paddingX: 1.5,
        marginTop: 1,
      }}
      onClick={onOpen}
    >
      {t('actions.addSubTask')}
    </Button>
  );
};

export default AddSubTask;
