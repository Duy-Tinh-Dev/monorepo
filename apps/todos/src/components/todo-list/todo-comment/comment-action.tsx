import {
  Box,
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popover,
  SxProps,
  Typography,
} from '@mui/material';
import { usePopover } from '@/hooks';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {useDisclosure} from '@/hooks';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { useTranslation } from '@op/i18n';

interface CommentActionProps {
  contentComment: string;
  children: React.ReactNode;
  onToggleCommentEditor: () => void;
  onDeleteComment: () => void;
  sx?: SxProps;
}

const CommentAction = ({
  contentComment,
  children,
  onToggleCommentEditor,
  onDeleteComment,
  sx = {},
  ...props
}: CommentActionProps) => {
  const { t } = useTranslation(['common']);
  const { id, open, anchorEl, handleClick, handleClose } =
    usePopover('todo-action');
  const deleteDialogDisClosure = useDisclosure({});

  return (
    <Box
      sx={{
        ...sx,
        display: open ? 'block' : 'none',
      }}
      {...props}
    >
      <Button
        color='secondary'
        sx={{
          minWidth: 2.5,
          padding: 0.75,
        }}
        onClick={(e) => {
          handleClick(e);
        }}
        aria-describedby={id}
      >
        {children}
      </Button>
      <Popover
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
      >
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
            <MenuItem onClick={onToggleCommentEditor}>
              <ListItemIcon>
                <EditOutlinedIcon />
              </ListItemIcon>
              <ListItemText>
                <Typography fontWeight={300}>{t('actions.edit')}</Typography>
              </ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <ContentCopyIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText>
                <Typography fontWeight={300}>
                  {t('actions.copyText')}
                </Typography>
              </ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => deleteDialogDisClosure.onOpen()}>
              <ListItemIcon>
                <DeleteOutlineIcon color='primary' />
              </ListItemIcon>
              <ListItemText>
                <Typography fontWeight={300} color='primary'>
                  {t('actions.delete')}
                </Typography>
              </ListItemText>
            </MenuItem>
          </MenuList>
          <ConfirmDialog
            isOpen={deleteDialogDisClosure.isOpen}
            title={t('actions.confirmDeleteComment')}
            handleClose={deleteDialogDisClosure.onClose}
            handleConfirm={onDeleteComment}
          ></ConfirmDialog>
        </Paper>
      </Popover>
    </Box>
  );
};

export default CommentAction;
