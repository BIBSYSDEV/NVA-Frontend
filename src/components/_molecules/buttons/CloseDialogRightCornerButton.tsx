import CloseIcon from '@mui/icons-material/Close';
import { Button, ButtonProps } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const CloseDialogRightCornerButton = ({ onClick, sx }: ButtonProps) => {
  const { t } = useTranslation();

  return (
    <Button onClick={onClick} endIcon={<CloseIcon />} sx={sx}>
      {t('common.close')}
    </Button>
  );
};
