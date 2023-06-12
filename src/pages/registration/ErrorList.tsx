import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { RegistrationTab } from '../../types/registration.types';
import { TabErrors } from '../../utils/formik-helpers';

interface ErrorSummaryProps {
  tabErrors: TabErrors;
  description?: ReactNode;
  actions?: ReactNode;
}

export const ErrorList = ({ tabErrors, description, actions }: ErrorSummaryProps) => {
  const { t } = useTranslation();

  return (
    <div data-testid="error-list-div">
      {description}
      <dl>
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
      {actions}
    </div>
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
