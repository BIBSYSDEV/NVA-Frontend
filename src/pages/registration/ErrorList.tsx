import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { RegistrationTab } from '../../types/registration.types';
import { ErrorSummary, TabErrors } from '../../types/publication_types/error.types';

const StyledErrorBox = styled.div`
  margin-top: 1rem;
  padding: 0.5rem 2rem;
  background-color: ${({ theme }) => theme.palette.error.light};
`;

const StyledErrorList = styled.ul`
  margin: 0;
`;

interface ErrorSummaryProps {
  errors: TabErrors;
}

export const ErrorList = ({ errors }: ErrorSummaryProps) => {
  const { t } = useTranslation('registration');

  return errors[RegistrationTab.Description].length > 0 ||
    errors[RegistrationTab.ResourceType].length > 0 ||
    errors[RegistrationTab.Contributors].length > 0 ||
    errors[RegistrationTab.FilesAndLicenses].length > 0 ? (
    <StyledErrorBox>
      <ErrorListElement heading={t('heading.description')} errors={errors[RegistrationTab.Description]} />
      <ErrorListElement heading={t('heading.resource_type')} errors={errors[RegistrationTab.ResourceType]} />
      <ErrorListElement heading={t('heading.contributors')} errors={errors[RegistrationTab.Contributors]} />
      <ErrorListElement heading={t('heading.files_and_license')} errors={errors[RegistrationTab.FilesAndLicenses]} />
    </StyledErrorBox>
  ) : null;
};

interface ErrorListProps {
  heading: string;
  errors: ErrorSummary[];
}

const ErrorListElement = ({ heading, errors }: ErrorListProps) => {
  return errors.length > 0 ? (
    <>
      <Typography>{heading}</Typography>
      <StyledErrorList>
        {errors.map((error, index) => {
          return typeof error.field === 'string' && typeof error.message === 'string' ? (
            <li key={index}>
              {error.field}: {error.message}
            </li>
          ) : null;
        })}
      </StyledErrorList>
    </>
  ) : null;
};
