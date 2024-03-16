import { Avatar, Stack, Typography } from '@mui/material';
import CommentAction from '../todo-comment/comment-action';
import { Comment } from '../types';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import avatar from '@assets/background.png';
import CommentEditor from '../todo-comment/comment-editor';

interface CommentItemProps {
  idEditComment: number;
  comment: Comment;
  onOpenEditor: (id: number) => void;
  onCloseEditor: () => void;
  onEditComment: (newComment: Comment) => void;
  onDeleteComment: (idComment: number) => void;
}

const CommentItem = ({
  idEditComment,
  comment,
  onOpenEditor,
  onCloseEditor,
  onEditComment,
  onDeleteComment,
}: CommentItemProps) => {
  const { id, name, content } = comment;

  if (idEditComment === id) {
    return (
      <CommentEditor
        onClose={onCloseEditor}
        comment={comment}
        onEditComment={onEditComment}
      />
    );
  }

  return (
    <Stack
      direction='row'
      columnGap='15px'
      marginBottom={2}
      position='relative'
      sx={{
        '&:hover > .MuiBox-root': {
          display: 'block',
        },
      }}
    >
      <Avatar alt='Cindy Baker' src={avatar} />
      <Stack>
        <Typography fontSize='14px' fontWeight='500'>
          {name}
        </Typography>
        <Typography fontSize='14px'>{content}</Typography>
      </Stack>
      <CommentAction
        contentComment={content}
        onToggleCommentEditor={() => onOpenEditor(id)}
        onDeleteComment={() => onDeleteComment(id)}
        sx={{
          position: 'absolute',
          right: 0,
          top: 0,
          display: 'none',
          backgroundColor: 'white',
          color: 'black',
        }}
      >
        <MoreHorizOutlinedIcon fontSize='small' />
      </CommentAction>
    </Stack>
  );
};

export default CommentItem;
