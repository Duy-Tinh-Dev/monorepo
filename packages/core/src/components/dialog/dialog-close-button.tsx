import { IconButton, IconButtonProps } from '@mui/material';
import { useTranslation } from '@op/i18n';
import CloseIcon from '@mui/icons-material/Close';

type DialogCloseButtonProps = IconButtonProps;

export const DialogCloseButton: React.FC<DialogCloseButtonProps> = ({
  sx = {},
  ...props
}) => {
  const { t } = useTranslation(['common']);

  return (
    <IconButton
      size='small'
      aria-label={t('common:actions.close')}
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
