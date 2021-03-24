import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { RegistrationTab } from '../../types/registration.types';
import { ErrorSummary, TabErrors } from '../../types/publication_types/error.types';
import BackgroundDiv from '../../components/BackgroundDiv';
import lightTheme from '../../themes/lightTheme';

const StyledErrorList = styled.ul`
  margin: 0;
`;

interface ErrorSummaryProps {
  errors: TabErrors;
  heading?: string;
}

export const ErrorList = ({ errors, heading }: ErrorSummaryProps) => {
  const { t } = useTranslation('registration');

  return errors[RegistrationTab.Description].length > 0 ||
    errors[RegistrationTab.ResourceType].length > 0 ||
    errors[RegistrationTab.Contributors].length > 0 ||
    errors[RegistrationTab.FilesAndLicenses].length > 0 ? (
    <BackgroundDiv backgroundColor={lightTheme.palette.error.light}>
      {heading && (
        <Typography variant="h4" component="h1" paragraph>
          {heading}
        </Typography>
      )}
      <ErrorListElement heading={t('heading.description')} errors={errors[RegistrationTab.Description]} />
      <ErrorListElement heading={t('heading.resource_type')} errors={errors[RegistrationTab.ResourceType]} />
      <ErrorListElement heading={t('heading.contributors')} errors={errors[RegistrationTab.Contributors]} />
      <ErrorListElement heading={t('heading.files_and_license')} errors={errors[RegistrationTab.FilesAndLicenses]} />
    </BackgroundDiv>
  ) : null;
};

interface ErrorListProps {
  heading: string;
  errors: ErrorSummary[];
}

const ErrorListElement = ({ heading, errors }: ErrorListProps) =>
  errors.length > 0 ? (
    <>
      <Typography>{heading}</Typography>
      <StyledErrorList>
        {errors.map((error, index) => (
          <li key={index}>
            {error.field}: {error.message}
          </li>
        ))}
      </StyledErrorList>
    </>
  ) : null;
