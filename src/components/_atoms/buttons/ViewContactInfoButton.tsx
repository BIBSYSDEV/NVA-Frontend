import { Button, ButtonProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../../utils/dataTestIds';

export const ViewContactInfoButton = (props: ButtonProps) => {
  const { t } = useTranslation();

  return (
    <Button
      color="tertiary"
      variant="contained"
      data-testid={dataTestId.basicData.nvi.viewContactInfoButton}
      {...props}>
      {t('view_contact_info_short')}
    </Button>
  );
};
