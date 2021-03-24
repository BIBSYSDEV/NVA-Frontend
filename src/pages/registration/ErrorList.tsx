import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Button, Typography } from '@material-ui/core';
import { RegistrationTab } from '../../types/registration.types';
import { ErrorSummary, TabErrors } from '../../types/publication_types/error.types';
import BackgroundDiv from '../../components/BackgroundDiv';
import lightTheme from '../../themes/lightTheme';
import { useParams } from 'react-router-dom';
import { getRegistrationPath } from '../../utils/urlPaths';

const StyledErrorList = styled.ul`
  margin: 0;
`;

const StyledErrorListElement = styled.div`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;

interface ErrorSummaryProps {
  errors: TabErrors;
  heading?: string;
  description?: string;
  showOpenWizardButton?: boolean;
}

export const ErrorList = ({ errors, heading, description, showOpenWizardButton = false }: ErrorSummaryProps) => {
  const { t } = useTranslation('registration');
  const { identifier } = useParams<{ identifier: string }>();
  const wizardUrl = getRegistrationPath(identifier);

  const firstErrorTab =
    errors[RegistrationTab.Description].length > 0
      ? RegistrationTab.Description
      : errors[RegistrationTab.ResourceType].length > 0
      ? RegistrationTab.ResourceType
      : errors[RegistrationTab.Contributors].length > 0
      ? RegistrationTab.Contributors
      : errors[RegistrationTab.FilesAndLicenses].length > 0
      ? RegistrationTab.FilesAndLicenses
      : null;

  return firstErrorTab !== null ? (
    <BackgroundDiv backgroundColor={lightTheme.palette.error.light}>
      {heading && (
        <Typography variant="h4" component="h1" gutterBottom>
          {heading}
        </Typography>
      )}
      {description && <Typography>{description}</Typography>}

      <ErrorListElement heading={t('heading.description')} errors={errors[RegistrationTab.Description]} />
      <ErrorListElement heading={t('heading.resource_type')} errors={errors[RegistrationTab.ResourceType]} />
      <ErrorListElement heading={t('heading.contributors')} errors={errors[RegistrationTab.Contributors]} />
      <ErrorListElement heading={t('heading.files_and_license')} errors={errors[RegistrationTab.FilesAndLicenses]} />

      {showOpenWizardButton && (
        <Button variant="contained" href={`${wizardUrl}?tab=${firstErrorTab}`}>
          {t('public_page.go_back_to_wizard')}
        </Button>
      )}
    </BackgroundDiv>
  ) : null;
};

interface ErrorListProps {
  heading: string;
  errors: ErrorSummary[];
}

const ErrorListElement = ({ heading, errors }: ErrorListProps) =>
  errors.length > 0 ? (
    <StyledErrorListElement>
      <Typography>{heading}</Typography>
      <StyledErrorList>
        {errors.map((error, index) => (
          <li key={index}>
            {error.field}: {error.message}
          </li>
        ))}
      </StyledErrorList>
    </StyledErrorListElement>
  ) : null;
