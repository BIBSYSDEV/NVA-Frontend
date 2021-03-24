import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { RegistrationTab } from '../../types/registration.types';
import { CustomError } from '../../utils/formik-helpers';

const StyledErrorBox = styled.div`
  margin-top: 1rem;
  padding: 0.5rem 2rem;
  background-color: ${({ theme }) => theme.palette.error.light};
`;

const StyledErrorList = styled.ul`
  margin: 0;
`;

interface ErrorSummaryProps {
  errors: {
    [key: number]: CustomError[]; // Each tab has its own key
  };
}

export const ErrorSummary = ({ errors }: ErrorSummaryProps) => {
  const { t } = useTranslation('registration');

  return errors[RegistrationTab.Description].length > 0 ||
    errors[RegistrationTab.ResourceType].length > 0 ||
    errors[RegistrationTab.Contributors].length > 0 ||
    errors[RegistrationTab.FilesAndLicenses].length > 0 ? (
    <StyledErrorBox>
      <ErrorList heading={t('heading.description')} errors={errors[RegistrationTab.Description]} />
      <ErrorList heading={t('heading.resource_type')} errors={errors[RegistrationTab.ResourceType]} />
      <ErrorList heading={t('heading.contributors')} errors={errors[RegistrationTab.Contributors]} />
      <ErrorList heading={t('heading.files_and_license')} errors={errors[RegistrationTab.FilesAndLicenses]} />
    </StyledErrorBox>
  ) : null;
};

interface ErrorListProps {
  heading: string;
  errors: CustomError[];
}

const ErrorList = ({ heading, errors }: ErrorListProps) => {
  return errors.length > 0 ? (
    <>
      <Typography>{heading}</Typography>
      <StyledErrorList>
        {errors.map((error) => {
          return typeof error.field === 'string' && typeof error.message === 'string' ? (
            <li key={error.field}>
              {error.field}: {error.message}
            </li>
          ) : null;
        })}
      </StyledErrorList>
    </>
  ) : null;
};
