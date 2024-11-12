import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { RegistrationTab } from '../../types/registration.types';
import { TabErrors } from '../../utils/formik-helpers';

interface ErrorSummaryProps {
  tabErrors: TabErrors;
}

export const ErrorList = ({ tabErrors }: ErrorSummaryProps) => {
  const { t } = useTranslation();

  return (
    <dl data-testid="error-list">
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
    </dl>
  );
};

interface ErrorListProps {
  heading: string;
  errorMessages: string[];
}

const ErrorListGroup = ({ heading, errorMessages }: ErrorListProps) =>
  errorMessages.length > 0 ? (
    <>
      <dt>
        <Typography sx={{ fontWeight: 500 }}>{heading}:</Typography>
      </dt>
      {errorMessages.map((errorMessage) => (
        <dd key={errorMessage}>
          <Typography>{errorMessage}</Typography>
        </dd>
      ))}
    </>
  ) : null;
