import EditIcon from '@mui/icons-material/Edit';
import { Box, BoxProps, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ErrorList } from '../pages/registration/ErrorList';
import { dataTestId } from '../utils/dataTestIds';
import { getFirstErrorTab, TabErrors } from '../utils/formik-helpers/formik-helpers';
import { getRegistrationWizardLink } from '../utils/urlPaths';

interface RegistrationErrorActionsProps extends BoxProps {
  tabErrors: TabErrors;
  registrationIdentifier: string;
}

export const RegistrationErrorActions = ({
  tabErrors,
  registrationIdentifier,
  ...boxProps
}: RegistrationErrorActionsProps) => {
  const { t } = useTranslation();

  const firstErrorTab = Math.max(getFirstErrorTab(tabErrors), 0);

  return (
    <Box {...boxProps}>
      <Typography>{t('registration.public_page.error_description')}</Typography>
      <ErrorList tabErrors={tabErrors} />
      <Button
        sx={{ bgcolor: 'white', width: '100%' }}
        variant="outlined"
        component={Link}
        size="small"
        to={{ ...getRegistrationWizardLink(registrationIdentifier), search: `?tab=${firstErrorTab}` }}
        endIcon={<EditIcon />}
        data-testid={dataTestId.registrationLandingPage.tasksPanel.backToWizard}>
        {t('registration.public_page.go_back_to_wizard')}
      </Button>
    </Box>
  );
};
