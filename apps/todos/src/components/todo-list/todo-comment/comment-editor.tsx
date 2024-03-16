import { Box, Button, Input, Stack } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useTranslation } from '@op/i18n';
import { useEffect, useRef, useState } from 'react';
import { Comment } from '../types';

interface CommentProps {
  comment?: Comment;
  onAddComment?: ({ id, content }: Comment) => void;
  onEditComment?: ({ id, content }: Comment) => void;
  onClose: () => void;
}

const CommentEditor = ({
  comment,
  onAddComment,
  onEditComment,
  onClose,
}: CommentProps) => {
  const { t } = useTranslation(['common']);
  const contentRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState(comment?.content ?? '');
  const [name, setName] = useState('author');

  useEffect(() => {
    contentRef.current?.focus();
  }, []);

  const handleChangeContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  const handleAddComment = () => {
    onAddComment &&
      onAddComment({
        id: new Date().getTime(),
        name: 'default',
        content: content.trim(),
      });
    setName('');
    setContent('');
    onClose();
  };

  const handleEditComment = () => {
    if (comment) {
      onEditComment &&
        onEditComment({ id: comment.id, name, content: content.trim() });
      setName('');
      setContent('');
      onClose();
    }
  };

  const handleCloseEditor = () => {
    setName('');
    setContent('');
    onClose();
  };

  return (
    <Box
      padding={1.25}
      borderRadius={2.25}
      border={1}
      borderColor={grey[300]}
      marginY={1.5}
    >
      <Input
        inputRef={contentRef}
        placeholder='Comment'
        fullWidth
        disableUnderline
        sx={{
          fontSize: '14px',
          marginBottom: 1.5,
        }}
        onChange={handleChangeContent}
        value={content}
      />
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
          onClick={handleCloseEditor}
        >
          {t('actions.cancel')}
        </Button>
        {comment ? (
          <Button
            sx={{
              paddingX: 1.5,
              boxShadow: 'none',
            }}
            variant='contained'
            onClick={handleEditComment}
          >
            {t('actions.save')}
          </Button>
        ) : (
          <Button
            sx={{
              paddingX: 1.5,
              boxShadow: 'none',
            }}
            variant='contained'
            onClick={handleAddComment}
            disabled={content.trim() === ''}
          >
            {t('actions.save')}
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default CommentEditor;
