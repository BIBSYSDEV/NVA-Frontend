import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const ViewContactInfoButton = () => {
  const { t } = useTranslation();

  return (
    <Button color="tertiary" variant="contained" type="submit">
      {t('view_contact_info_short')}
    </Button>
  );
};
