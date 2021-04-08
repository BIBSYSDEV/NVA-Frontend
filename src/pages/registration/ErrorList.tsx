import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { RegistrationTab } from '../../types/registration.types';
import BackgroundDiv from '../../components/BackgroundDiv';
import lightTheme from '../../themes/lightTheme';
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
    <BackgroundDiv backgroundColor={lightTheme.palette.error.light} data-testid="error-list-div">
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
    </BackgroundDiv>
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
