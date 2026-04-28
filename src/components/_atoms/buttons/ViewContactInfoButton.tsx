import { Button, ButtonProps } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const ViewContactInfoButton = (props: ButtonProps) => {
  const { t } = useTranslation();

  return (
    <Button color="tertiary" variant="contained" type="button" {...props}>
      {t('view_contact_info_short')}
    </Button>
  );
};
