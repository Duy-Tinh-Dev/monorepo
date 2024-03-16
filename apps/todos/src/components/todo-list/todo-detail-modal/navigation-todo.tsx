import { Button, Divider, Stack } from '@mui/material';
import { Todo } from '../types';
import { grey } from '@mui/material/colors';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import VoicemailSharpIcon from '@mui/icons-material/VoicemailSharp';
import NavigateNextSharpIcon from '@mui/icons-material/NavigateNextSharp';

interface NavigationTodoProps {
  currentTodo: Todo[];
  onBackDetailTodo: () => void;
}

const NavigationTodo = ({
  currentTodo,
  onBackDetailTodo,
}: NavigationTodoProps) => {
  return (
    <Stack
      direction='row'
      sx={{
        width: 'fit-content',
      }}
      border='1px solid'
      borderColor={grey[100]}
      borderRadius={2}
      marginBottom={2}
    >
      <Button
        startIcon={
          <CheckCircleOutlinedIcon fontSize='small' color='secondary' />
        }
        color='secondary'
        sx={{
          lineHeight: 0,
          paddingX: 1.5,
          fontSize: '13px',
        }}
        disableRipple
        onClick={onBackDetailTodo}
      >
        {currentTodo.slice(-2)[0].name}
      </Button>
      <Divider orientation='vertical' />
      <Button
        startIcon={<VoicemailSharpIcon fontSize='small' color='secondary' />}
        endIcon={<NavigateNextSharpIcon fontSize='small' color='secondary' />}
        color='secondary'
        sx={{
          lineHeight: 0,
          paddingX: 1.5,
          fontSize: '13px',
        }}
        disableRipple
      >
        {currentTodo.slice(-1)[0].subTasks.length}
      </Button>
    </Stack>
  );
};

export default NavigationTodo;
