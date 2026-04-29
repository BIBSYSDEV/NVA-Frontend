import CloseIcon from '@mui/icons-material/Close';
import { Button, ButtonProps } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const CloseTextAndIconButton = (props: ButtonProps) => {
  const { t } = useTranslation();

  return (
    <Button endIcon={<CloseIcon />} {...props}>
      {t('common.close')}
    </Button>
  );
};
