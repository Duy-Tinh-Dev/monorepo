import CloseIcon from '@mui/icons-material/Close';
import { IconButton, IconButtonProps } from '@mui/material';

type DialogCloseButton = IconButtonProps;

const DialogCloseButton: React.FC<DialogCloseButton> = ({
  sx = {},
  ...props
}) => {
  return (
    <IconButton
      size='small'
      {...props}
      sx={{
        width: 30,
        height: 30,
        backgroundColor: 'slate.100',
        '&:hover': {
          backgroundColor: 'slate.200',
        },
        ...sx,
      }}
    >
      <CloseIcon
        sx={{
          color: 'slate.500',
        }}
      />
    </IconButton>
  );
};

export default DialogCloseButton;
