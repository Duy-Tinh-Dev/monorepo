import {
  DialogTitle as MUIDialogTitle,
  DialogTitleProps as MUIDialogTitleProps,
  Stack,
  StackProps,
} from '@mui/material';
import DialogCloseButton from './dialog-close-button';

export interface DialogTitleProps extends MUIDialogTitleProps {
  containerProps?: StackProps;
  onClose?: () => void;
}

export const DialogTitle: React.FC<DialogTitleProps> = ({
  title,
  containerProps,
  onClose,
  ...rest
}) => {
  return (
    <Stack
      direction='row'
      p={3}
      pr={onClose ? 8 : 3}
      alignItems='center'
      justifyContent='space-between'
      position='relative'
      {...containerProps}
    >
      <MUIDialogTitle
        sx={{
          padding: '0',
        }}
        {...rest}
      >
        {title}
      </MUIDialogTitle>
      {onClose && (
        <DialogCloseButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 24,
          }}
        />
      )}
    </Stack>
  );
};
