import Grid3x3Icon from '@mui/icons-material/Grid3x3';
import { Button, Dialog, Popover, Typography } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { grey } from '@mui/material/colors';
import { Project } from '@/components/sidebar/sidebar-project/types';
import { useDisclosure, usePopover } from '@/hooks';
import ProjectAction from './project-action';
import { useDispatch, useSelector } from 'react-redux';
import { selectProject } from '@/redux/slices/projectSlice';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { projectSelectedSelector } from '@/redux/selectors';
import { deleteProjectApi, duplicateProjectApi, editProjectApi } from '@/api';
import ProjectEditor from './project-editor';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { useTranslation } from '@op/i18n';
import { Stack } from '@mui/system';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ProjectItemProps {
  project: Project;
}

const ProjectItem = ({ project }: ProjectItemProps) => {
  const { t } = useTranslation(['common']);
  const projectPopover = usePopover('project-item-action');
  const projectDialog = useDisclosure({});
  const projectDeleteConfirm = useDisclosure({});

  const projectSelected = useSelector(projectSelectedSelector);
  const dispatchEvent = useDispatch();
  const navigate = useNavigate();

  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: project.id,
  });

  const style = {
    opacity: isDragging ? 0.25 : 1,
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const handleSelectProject = () => {
    dispatchEvent(selectProject(project));
    navigate(ROUTES.project);
  };

  const handleOpenEditProject = () => {
    projectDialog.onOpen();
    projectPopover.handleClose();
  };

  const handleOpenDeleteProject = () => {
    projectDeleteConfirm.onOpen();
    projectPopover.handleClose();
  };

  const handleEditProject = (project: Project) => {
    editProjectApi(project);
    projectDialog.onClose();
  };

  const handleDuplicateProject = () => {
    duplicateProjectApi(project);
    projectDialog.onClose();
    projectPopover.handleClose();
  };

  const handleDeleteProject = () => {
    deleteProjectApi(project.id);
  };

  return (
    <>
      <Stack
        key={project.id}
        flexDirection='row'
        sx={{
          '&:hover': {
            backgroundColor:
              projectSelected?.id === project.id ? '' : grey[100],
          },
          '&:hover .MuiSvgIcon-root': {
            opacity: 1,
          },
          backgroundColor: projectSelected?.id === project.id ? '#ffefe5' : '',
        }}
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
      >
        <Button
          startIcon={
            <Grid3x3Icon
              sx={{
                color: project.color,
              }}
            />
          }
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            '&:hover': {
              backgroundColor: 'transparent',
            },
            color:
              projectSelected?.id === project.id
                ? 'primary.main'
                : 'secondary.main',
          }}
          disableRipple
          onClick={handleSelectProject}
        >
          <Typography
            fontSize='14px'
            flex={1}
            sx={{
              textAlign: 'left',
            }}
          >
            {project.name}
          </Typography>
        </Button>
        <Button
          disableRipple
          onClick={projectPopover.handleClick}
          sx={{
            '&:hover': {
              backgroundColor: 'transparent',
            },
          }}
          color='secondary'
        >
          <MoreHorizIcon
            sx={{
              opacity: 0,
            }}
          />
        </Button>
      </Stack>
      <Popover
        open={projectPopover.open}
        anchorEl={projectPopover.anchorEl}
        onClose={projectPopover.handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
      >
        <ProjectAction
          onOpenEdit={handleOpenEditProject}
          onDuplicate={handleDuplicateProject}
          onOpenDelete={handleOpenDeleteProject}
        />
      </Popover>
      <Dialog
        open={projectDialog.isOpen}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 2.5,
            width: '350px',
          },
        }}
        maxWidth='md'
      >
        <ProjectEditor
          project={project}
          onSubmit={handleEditProject}
          onClose={projectDialog.onClose}
        />
      </Dialog>
      <ConfirmDialog
        isOpen={projectDeleteConfirm.isOpen}
        title={t('actions.confirmDeleteProject')}
        handleClose={projectDeleteConfirm.onClose}
        handleConfirm={handleDeleteProject}
      />
    </>
  );
};

export default ProjectItem;
