import React from 'react';
import { FormikProps, getIn, useFormikContext } from 'formik';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { Registration, RegistrationTab } from '../../types/registration.types';

const StyledErrorBox = styled.div`
  margin-top: 1rem;
  padding: 0.5rem 2rem;
  background-color: ${({ theme }) => theme.palette.error.light};
`;

const StyledErrorList = styled.ul`
  margin: 0;
`;

interface ErrorSummaryProps {
  errorFieldNames: {
    [key: number]: string[]; // Each tab has its own key
  };
}

export const ErrorSummary = ({ errorFieldNames }: ErrorSummaryProps) => {
  const { t } = useTranslation('registration');

  return errorFieldNames[RegistrationTab.Description].length > 0 ||
    errorFieldNames[RegistrationTab.ResourceType].length > 0 ||
    errorFieldNames[RegistrationTab.Contributors].length > 0 ||
    errorFieldNames[RegistrationTab.FilesAndLicenses].length > 0 ? (
    <StyledErrorBox>
      <ErrorList heading={t('heading.description')} fieldNames={errorFieldNames[RegistrationTab.Description]} />
      <ErrorList heading={t('heading.resource_type')} fieldNames={errorFieldNames[RegistrationTab.ResourceType]} />
      <ErrorList heading={t('heading.contributors')} fieldNames={errorFieldNames[RegistrationTab.Contributors]} />
      <ErrorList
        heading={t('heading.files_and_license')}
        fieldNames={errorFieldNames[RegistrationTab.FilesAndLicenses]}
      />
    </StyledErrorBox>
  ) : null;
};

interface ErrorListProps {
  heading: string;
  fieldNames: string[];
}

const ErrorList = ({ fieldNames, heading }: ErrorListProps) => {
  const { t } = useTranslation('formikValues');
  const { errors }: FormikProps<Registration> = useFormikContext();

  return fieldNames.length > 0 ? (
    <>
      <Typography>{heading}</Typography>
      <StyledErrorList>
        {fieldNames.map((fieldName) => {
          const translatedFieldName = t(fieldName.replace(/[[\]\d]/g, '').replace(/[.]/g, '-'));
          const translatedErrorMessage = getIn(errors, fieldName);

          return typeof translatedErrorMessage === 'string' ? (
            <li key={fieldName}>
              {translatedFieldName}: {translatedErrorMessage}
            </li>
          ) : null;
        })}
      </StyledErrorList>
    </>
  ) : null;
};
