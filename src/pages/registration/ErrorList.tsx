import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { RegistrationTab } from '../../types/registration.types';
import { TabErrors } from '../../utils/formik-helpers/formik-helpers';

interface ErrorSummaryProps {
  tabErrors: TabErrors;
}

export const ErrorList = ({ tabErrors }: ErrorSummaryProps) => {
  const { t } = useTranslation();

  return (
    <Box component="ul" sx={{ my: '0.5rem', px: 0, listStyleType: 'none' }}>
      <ErrorListGroup
        heading={t('registration.heading.description')}
        errorMessages={tabErrors[RegistrationTab.Description]}
      />
      <ErrorListGroup
        heading={t('registration.heading.resource_type')}
        errorMessages={tabErrors[RegistrationTab.ResourceType]}
      />
      <ErrorListGroup
        heading={t('registration.heading.contributors')}
        errorMessages={tabErrors[RegistrationTab.Contributors]}
      />
      <ErrorListGroup
        heading={t('registration.heading.files_and_license')}
        errorMessages={tabErrors[RegistrationTab.FilesAndLicenses]}
      />
    </Box>
  );
};

interface ErrorListProps {
  heading: string;
  errorMessages: string[];
}

const ErrorListGroup = ({ heading, errorMessages }: ErrorListProps) => {
  if (errorMessages.length === 0) {
    return null;
  }

  return (
    <li>
      <Typography sx={{ fontWeight: 500 }}>{heading}:</Typography>
      <ul style={{ listStyleType: 'disc', paddingLeft: '2rem' }}>
        {errorMessages.map((errorMessage) => (
          <li key={errorMessage}>
            <Typography>{errorMessage}</Typography>
          </li>
        ))}
      </ul>
    </li>
  );
};
