import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { Button, ButtonProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../../utils/dataTestIds';

export const ViewContactInfoButton = (props: ButtonProps) => {
  const { t } = useTranslation();

  return (
    <Button
      data-testid={dataTestId.basicData.viewContactInfoButton}
      {...props}
      color="tertiary"
      variant="contained"
      startIcon={<MailOutlineIcon />}>
      {t('view_contact_info')}
    </Button>
  );
};
