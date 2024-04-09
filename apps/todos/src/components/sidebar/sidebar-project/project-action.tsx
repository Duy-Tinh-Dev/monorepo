import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Typography,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { useTranslation } from '@op/i18n';

interface ProjectActionProps {
  onDuplicate: () => void;
  onOpenEdit: () => void;
  onOpenDelete: () => void;
}

const ProjectAction = ({
  onDuplicate,
  onOpenEdit,
  onOpenDelete,
}: ProjectActionProps) => {
  const { t } = useTranslation(['common']);

  return (
    <Paper
      sx={{
        width: 250,
        maxWidth: '100%',
        borderRadius: '8px',
        boxShadow: 3,
        paddingX: 0.75,
      }}
    >
      <MenuList>
        <MenuItem onClick={onOpenEdit}>
          <ListItemIcon>
            <EditOutlinedIcon />
          </ListItemIcon>
          <ListItemText>
            <Typography fontWeight={300}>{t('common:actions.edit')}</Typography>
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={onDuplicate}>
          <ListItemIcon>
            <AddToPhotosIcon />
          </ListItemIcon>
          <ListItemText>
            <Typography fontWeight={300}>
              {t('common:actions.duplicate')}
            </Typography>
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={onOpenDelete}>
          <ListItemIcon>
            <DeleteOutlinedIcon color='primary' />
          </ListItemIcon>
          <ListItemText>
            <Typography color='primary' fontWeight={300}>
              {t('common:actions.delete')}
            </Typography>
          </ListItemText>
        </MenuItem>
      </MenuList>
    </Paper>
  );
};

export default ProjectAction;
