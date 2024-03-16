import {
  DialogTitle as MUIDialogTitle,
  DialogTitleProps as MUIDialogTitleProps,
  Stack,
  StackProps,
} from '@mui/material';
import { DialogCloseButton } from './dialog-close-button';

export interface DialogTitleProps extends MUIDialogTitleProps {
  onClose?: () => void;
  containerProps?: StackProps;
}

export const DialogTitle: React.FC<DialogTitleProps> = ({
  onClose,
  containerProps,
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
      <MUIDialogTitle p='0 !important' {...rest} />
      {typeof onClose === 'function' && (
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
