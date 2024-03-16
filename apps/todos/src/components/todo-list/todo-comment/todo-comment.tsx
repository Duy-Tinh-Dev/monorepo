import { Accordion } from '@components/accordion';
import { Comment } from '../types';
import { useState } from 'react';
import CommentItem from './comment-item';
import AddComment from './add-comment';

interface TodoCommentProps {
  isComment?: boolean;
  comments: Comment[];
  onAddComment: ({ id, content }: Comment) => void;
  onEditComment: (newComment: Comment) => void;
  onDeleteComment: (idComment: number) => void;
  onToggleCommentDetail: (isComment: boolean) => void;
}

const TodoComment: React.FC<TodoCommentProps> = ({
  isComment,
  comments,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onToggleCommentDetail,
}) => {
  const [idEditComment, setIdEditComment] = useState(-1);

  const handleOpenEditor = (id: number) => {
    setIdEditComment(id);
  };

  const handleCloseEditor = () => {
    setIdEditComment(-1);
  };

  if (comments.length > 0) {
    return (
      <Accordion summary='Comment'>
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            idEditComment={idEditComment}
            onOpenEditor={handleOpenEditor}
            onCloseEditor={handleCloseEditor}
            onEditComment={onEditComment}
            onDeleteComment={onDeleteComment}
          />
        ))}
        <AddComment
          initialState={isComment}
          onAddComment={onAddComment}
          onToggleCommentDetail={onToggleCommentDetail}
        />
      </Accordion>
    );
  }

  return (
    <AddComment
      initialState={isComment}
      onAddComment={onAddComment}
      onToggleCommentDetail={onToggleCommentDetail}
    />
  );
};

export default TodoComment;
