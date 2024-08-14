import { Button, ButtonProps, SxProps } from '@mui/material';
import { Link, LinkProps } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface CancelEditButtonProps extends ButtonProps, Pick<LinkProps, 'to'> {
  sx: SxProps;
}

export const CancelEditButton = ({ sx, ...rest }: CancelEditButtonProps) => {
  const { t } = useTranslation();

  return (
    <Button LinkComponent={Link} {...rest} color="primary" sx={sx}>
      {t('common.cancel')}
    </Button>
  );
};

//TODO: Create own link for navigating to wizard, using prevPath and prevSearch URL-states
//TODO: Test on cetral import early
//TODO: Use this link in combination with all buttons that lead to registration wizard.
//TODO: CentralImport, TasksPage, ResultRegistration, NewResult, RegistrationLandingPage, FixInWizard
