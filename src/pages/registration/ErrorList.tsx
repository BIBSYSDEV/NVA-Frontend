import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Button, Typography } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import { RegistrationTab } from '../../types/registration.types';
import { TabErrors } from '../../types/publication_types/error.types';
import BackgroundDiv from '../../components/BackgroundDiv';
import lightTheme from '../../themes/lightTheme';
import { getRegistrationPath } from '../../utils/urlPaths';

const StyledTabHeading = styled(Typography)`
  font-weight: 500;
`;

interface ErrorSummaryProps {
  tabErrors: TabErrors;
  heading?: string;
  description?: string;
  showOpenFormButton?: boolean;
}

export const ErrorList = ({ tabErrors, heading, description, showOpenFormButton = false }: ErrorSummaryProps) => {
  const { t } = useTranslation('registration');
  const { identifier } = useParams<{ identifier: string }>();
  const formUrl = getRegistrationPath(identifier);

  const firstErrorTab =
    tabErrors[RegistrationTab.Description].length > 0
      ? RegistrationTab.Description
      : tabErrors[RegistrationTab.ResourceType].length > 0
      ? RegistrationTab.ResourceType
      : tabErrors[RegistrationTab.Contributors].length > 0
      ? RegistrationTab.Contributors
      : tabErrors[RegistrationTab.FilesAndLicenses].length > 0
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

      <dl>
        <ErrorListGroup heading={t('heading.description')} errorMessages={tabErrors[RegistrationTab.Description]} />
        <ErrorListGroup heading={t('heading.resource_type')} errorMessages={tabErrors[RegistrationTab.ResourceType]} />
        <ErrorListGroup heading={t('heading.contributors')} errorMessages={tabErrors[RegistrationTab.Contributors]} />
        <ErrorListGroup
          heading={t('heading.files_and_license')}
          errorMessages={tabErrors[RegistrationTab.FilesAndLicenses]}
        />
      </dl>

      {showOpenFormButton && (
        <Button variant="contained" href={`${formUrl}?tab=${firstErrorTab}`} endIcon={<EditIcon />}>
          {t('public_page.go_back_to_wizard')}
        </Button>
      )}
    </BackgroundDiv>
  ) : null;
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
