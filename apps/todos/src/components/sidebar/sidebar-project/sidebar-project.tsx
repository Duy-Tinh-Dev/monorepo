import { DndContext, DragEndEvent, closestCorners } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDisclosure, useSensors } from '@/hooks';
import { Accordion } from '@/components/accordion';
import { useDispatch, useSelector } from 'react-redux';
import { listProjectSelector } from '@/redux/selectors';
import { useTranslation } from '@op/i18n';
import { Button, Dialog, Divider } from '@mui/material';
import { grey } from '@mui/material/colors';
import AddIcon from '@mui/icons-material/Add';
import ProjectItem from './project-item';
import ProjectEditor from './project-editor';
import { Project } from './types';
import { addProjectApi } from '@/api';
import { getIndexProjectById } from '@/utils';
import { initListProject } from '@/redux/slices/projectSlice';

const SidebarProject = () => {
  const { t } = useTranslation(['sidebar', 'common']);
  const { sensors } = useSensors();
  const { isOpen, onClose, onOpen } = useDisclosure({});
  const listProject = useSelector(listProjectSelector) || [];
  const dispatch = useDispatch();

  const handleAddProject = (project: Project) => {
    addProjectApi(project);
    onClose();
  };

  const handleDragProject = ({ active, over }: DragEndEvent) => {
    if (over === null || active.id === over?.id) return;

    const originalPos = getIndexProjectById(listProject, active.id);
    const newPos = getIndexProjectById(listProject, over?.id);
    const newListProject = arrayMove(listProject, originalPos, newPos);

    dispatch(initListProject(newListProject));
  };

  return (
    <Accordion
      sx={{
        '& .MuiAccordionDetails-root': {
          padding: 0,
        },
        backgroundColor: 'transparent',
      }}
      summary={t('sidebar:myProjects')}
      isDivider={false}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragProject}
      >
        <SortableContext
          items={listProject}
          strategy={verticalListSortingStrategy}
        >
          {listProject.map((project) => (
            <ProjectItem key={project.id} project={project} />
          ))}
        </SortableContext>
      </DndContext>
      <Divider
        sx={{
          marginTop: 1,
          borderColor: grey[200],
        }}
      />
      <Button
        startIcon={<AddIcon />}
        disableRipple
        onClick={onOpen}
        sx={{
          fontWeight: 400,
          width: '100%',
          justifyContent: 'flex-start',
        }}
      >
        {t('common:actions.addProject')}
      </Button>
      <Dialog
        open={isOpen}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 2.5,
            width: '350px',
          },
        }}
        maxWidth='md'
      >
        <ProjectEditor onSubmit={handleAddProject} onClose={onClose} />
      </Dialog>
    </Accordion>
  );
};

export default SidebarProject;
