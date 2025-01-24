import EditIcon from '@mui/icons-material/Edit';
import { Box, BoxProps, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import { ErrorList } from '../pages/registration/ErrorList';
import { RootState } from '../redux/store';
import { Registration, RegistrationStatus } from '../types/registration.types';
import { dataTestId } from '../utils/dataTestIds';
import { getFirstErrorTab, TabErrors } from '../utils/formik-helpers/formik-helpers';
import { getWizardPathByRegistration } from '../utils/urlPaths';

interface RegistrationErrorActionsProps extends BoxProps {
  tabErrors: TabErrors;
  registration: Registration;
}

export const RegistrationErrorActions = ({ tabErrors, registration, ...boxProps }: RegistrationErrorActionsProps) => {
  const { t } = useTranslation();
  const customer = useSelector((state: RootState) => state.customer);

  const firstErrorTab = Math.max(getFirstErrorTab(tabErrors), 0);
  const isPublished =
    registration.status === RegistrationStatus.Published ||
    registration.status === RegistrationStatus.PublishedMetadata;

  return (
    <Box {...boxProps}>
      <Typography>
        {customer?.publicationWorkflow === 'RegistratorPublishesMetadataOnly'
          ? isPublished
            ? t('registration.public_page.error_description_published_result_workflow2')
            : t('registration.public_page.error_description_workflow2')
          : isPublished
            ? t('registration.public_page.error_description_published_result_workflow1')
            : t('registration.public_page.error_description_workflow1')}
      </Typography>
      <ErrorList tabErrors={tabErrors} />
      <Button
        sx={{ bgcolor: 'white', width: '100%' }}
        variant="outlined"
        component={Link}
        size="small"
        to={getWizardPathByRegistration(registration, { tab: firstErrorTab })}
        endIcon={<EditIcon />}
        data-testid={dataTestId.registrationLandingPage.tasksPanel.backToWizard}>
        {t('registration.public_page.go_back_to_wizard')}
      </Button>
    </Box>
  );
};
