import { Button, ButtonBaseProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';

export const CloseDialogRightCornerButton = ({ onClick, sx }: ButtonBaseProps) => {
  const { t } = useTranslation();

  return (
    <Button aria-label={t('common.close')} onClick={onClick} endIcon={<CloseIcon />} sx={sx}>
      {t('common.close')}
    </Button>
  );
};
