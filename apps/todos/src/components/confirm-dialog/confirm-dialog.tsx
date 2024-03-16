import { Button, Dialog, DialogActions } from '@mui/material';
import { DialogTitle } from './dialog-title';

import { useTranslation } from '@op/i18n';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  handleClose: () => void;
  handleConfirm: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  handleClose,
  handleConfirm,
}) => {
  const { t } = useTranslation(['common']);

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle title={title} onClose={handleClose} />
      <DialogActions>
        <Button onClick={handleClose}>{t('actions.disagree')}</Button>
        <Button onClick={handleConfirm} autoFocus>
          {t('actions.agree')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
