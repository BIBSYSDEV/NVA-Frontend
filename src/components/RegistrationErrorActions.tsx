import EditIcon from '@mui/icons-material/Edit';
import { Box, BoxProps, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import { ErrorList } from '../pages/registration/ErrorList';
import { RootState } from '../redux/store';
import { dataTestId } from '../utils/dataTestIds';
import { getFirstErrorTab, TabErrors } from '../utils/formik-helpers/formik-helpers';
import { getRegistrationWizardPath } from '../utils/urlPaths';

interface RegistrationErrorActionsProps extends BoxProps {
  tabErrors: TabErrors;
  registrationIdentifier: string;
  isPublished: boolean;
}

export const RegistrationErrorActions = ({
  tabErrors,
  registrationIdentifier,
  isPublished,
  ...boxProps
}: RegistrationErrorActionsProps) => {
  const { t } = useTranslation();
  const customer = useSelector((state: RootState) => state.customer);

  const firstErrorTab = Math.max(getFirstErrorTab(tabErrors), 0);

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
        to={getRegistrationWizardPath(registrationIdentifier, { tab: firstErrorTab })}
        endIcon={<EditIcon />}
        data-testid={dataTestId.registrationLandingPage.tasksPanel.backToWizard}>
        {t('registration.public_page.go_back_to_wizard')}
      </Button>
    </Box>
  );
};
