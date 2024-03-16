import { Button } from '@mui/material';
import CommentEditor from './comment-editor';
import { grey } from '@mui/material/colors';
import { Comment } from '../types';
import useDisclosure from '@hooks/useDisclosure';
import AttachmentOutlinedIcon from '@mui/icons-material/AttachmentOutlined';
import { useTranslation } from '@op/i18n';

interface AddCommentProps {
  initialState?: boolean;
  onAddComment: ({ id, content }: Comment) => void;
  onToggleCommentDetail: (isComment: boolean) => void;
}

const AddComment = ({
  onAddComment,
  onToggleCommentDetail,
  initialState,
}: AddCommentProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ initialState });
  const { t } = useTranslation(['common']);

  const handleCloseComment = () => {
    onClose();
    onToggleCommentDetail(false);
  };

  return isOpen ? (
    <CommentEditor onAddComment={onAddComment} onClose={handleCloseComment} />
  ) : (
    <Button
      color='secondary'
      endIcon={<AttachmentOutlinedIcon fontSize='small' />}
      sx={{
        justifyContent: 'space-between',
        fontWeight: 'normal',
        border: '1px solid',
        borderColor: grey[100],
        borderRadius: 4,
        paddingX: 2,
        width: '100%',
      }}
      onClick={onOpen}
    >
      {t('comment.title')}
    </Button>
  );
};

export default AddComment;
