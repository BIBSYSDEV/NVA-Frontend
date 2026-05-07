import CloseIcon from '@mui/icons-material/Close';
import { Button, ButtonProps } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const CloseButton = (props: ButtonProps) => {
  const { t } = useTranslation();

  return (
    <Button
      endIcon={<CloseIcon />}
      {...props}
      sx={[{ whiteSpace: 'nowrap', flexShrink: 0 }, ...(Array.isArray(props.sx) ? props.sx : [props.sx])]}>
      {t('common.close')}
    </Button>
  );
};
