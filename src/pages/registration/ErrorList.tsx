import { ReactNode } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { RegistrationTab } from '../../types/registration.types';
import { TabErrors } from '../../utils/formik-helpers';

const StyledTabHeading = styled(Typography)`
  font-weight: 500;
`;

interface ErrorSummaryProps {
  tabErrors: TabErrors;
  description?: ReactNode;
  actions?: ReactNode;
}

export const ErrorList = ({ tabErrors, description, actions }: ErrorSummaryProps) => {
  const { t } = useTranslation('registration');

  return (
    <Box sx={{ bgcolor: 'error.light', padding: { xs: '0.5rem', sm: '0.5rem 2rem' } }} data-testid="error-list-div">
      {description}
      <dl>
        <ErrorListGroup heading={t('heading.description')} errorMessages={tabErrors[RegistrationTab.Description]} />
        <ErrorListGroup heading={t('heading.resource_type')} errorMessages={tabErrors[RegistrationTab.ResourceType]} />
        <ErrorListGroup heading={t('heading.contributors')} errorMessages={tabErrors[RegistrationTab.Contributors]} />
        <ErrorListGroup
          heading={t('heading.files_and_license')}
          errorMessages={tabErrors[RegistrationTab.FilesAndLicenses]}
        />
      </dl>
      {actions}
    </Box>
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
        <StyledTabHeading>{heading}:</StyledTabHeading>
      </dt>
      {errorMessages.map((errorMessage) => (
        <dd key={errorMessage}>
          <Typography>{errorMessage}</Typography>
        </dd>
      ))}
    </>
  ) : null;
