import { Box, Stack } from '@mui/system';
import { useTranslation } from '@op/i18n';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { listColor } from './constants';
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Project } from './types';

interface ProjectEditorProps {
  project?: Project;
  onSubmit: (project: Project) => void;
  onClose: () => void;
}

const ProjectEditor = ({ project, onSubmit, onClose }: ProjectEditorProps) => {
  const { t } = useTranslation(['sidebar', 'common']);
  const [nameProject, setNameProject] = useState(project?.name ?? '');
  const [selectedColor, setSelectedColor] = useState(
    project?.color ?? listColor[0].color
  );
  const { currentUser } = useAuth();

  const handleChangeNameProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameProject(e.target.value);
  };

  const handleChangeColor = (event: SelectChangeEvent) => {
    setSelectedColor(event.target.value);
  };

  const handleSubmit = () => {
    if (project) {
      onSubmit({
        ...project,
        name: nameProject,
        color: selectedColor,
      });
    } else {
      onSubmit({
        id: new Date().getTime(),
        name: nameProject,
        color: selectedColor,
        listTodo: [],
        userId: currentUser?.uid,
      });
    }
  };

  return (
    <Stack
      sx={{
        padding: 2.5,
      }}
      rowGap={2}
    >
      <Typography fontWeight={500} fontSize='20px'>
        {t('common:actions.addProject')}
      </Typography>
      <FormControl
        fullWidth
        sx={{
          '& .MuiList-root': {
            overflowY: 'auto',
            maxHeight: '300px',
          },
        }}
      >
        <TextField
          label='Name'
          color={'secondary'}
          size='small'
          sx={{
            marginBottom: 2.5,
          }}
          value={nameProject}
          onChange={handleChangeNameProject}
        />
      </FormControl>
      <FormControl>
        <InputLabel
          sx={{
            display: 'flex',
            alignItems: 'center',
            top: '-6px',
          }}
        >
          {t('common:actions.color')}
        </InputLabel>
        <Select
          label='Color'
          size='small'
          value={selectedColor}
          onChange={handleChangeColor}
          sx={{
            '& .MuiSelect-select': {
              display: 'flex',
              alignItems: 'center',
            },
          }}
        >
          {listColor.map(({ id, color, name }) => (
            <MenuItem key={id} value={color}>
              <Box
                width='10px'
                height='10px'
                borderRadius='50%'
                marginRight={1.5}
                sx={{
                  backgroundColor: color,
                }}
              ></Box>
              <Typography>{name}</Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Stack
        paddingY={1}
        paddingX={1.5}
        direction='row'
        justifyContent='right'
        alignItems='center'
        gap={1}
      >
        <Button
          onClick={onClose}
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
        >
          {t('common:actions.cancel')}
        </Button>
        <Button
          sx={{
            paddingX: 1.5,
            boxShadow: 'none',
          }}
          variant='contained'
          disabled={!nameProject}
          onClick={handleSubmit}
        >
          {t('common:actions.save')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default ProjectEditor;
