import { DialogActionsProps } from '@mui/material';

type DialogCloseButtonProps = DialogActionsProps;

const DialogActions: React.FC<DialogCloseButtonProps> = ({
  sx = {},
  children,
  ...props
}) => {
  return (
    <DialogActions
      sx={{
        ...sx,
      }}
      {...props}
    >
      {children}
    </DialogActions>
  );
};

export default DialogActions;
