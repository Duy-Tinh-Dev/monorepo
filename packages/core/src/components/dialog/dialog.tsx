import {
  Dialog as MUIDialog,
  DialogProps as MUIDialogProps,
} from '@mui/material';

export interface DialogProps extends MUIDialogProps {
  onClose?: ((event: {}, reason: 'escapeKeyDown') => void) | undefined;
}

export const Dialog: React.FC<DialogProps> = ({ onClose, ...rest }) => {
  return (
    <MUIDialog
      {...rest}
      onClose={(event, reason) => {
        if (reason === 'backdropClick') return;
        onClose?.(event, reason);
      }}
    />
  );
};
