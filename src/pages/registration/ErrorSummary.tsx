import React from 'react';
import { FormikProps, getIn, useFormikContext } from 'formik';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { Registration } from '../../types/registration.types';

const StyledErrorBox = styled.div`
  margin-top: 1rem;
  padding: 0.5rem 2rem;
  background-color: ${({ theme }) => theme.palette.error.light};
`;

interface ErrorSummaryProps {
  descriptionErrorFields: string[];
  resourceErrorFields: string[];
  contributorsErrorFields: string[];
  filesErrorFields: string[];
}

export const ErrorSummary = ({
  descriptionErrorFields,
  resourceErrorFields,
  contributorsErrorFields,
  filesErrorFields,
}: ErrorSummaryProps) => {
  const { t } = useTranslation('registration');

  return descriptionErrorFields.length > 0 ||
    resourceErrorFields.length > 0 ||
    contributorsErrorFields.length > 0 ||
    filesErrorFields.length > 0 ? (
    <StyledErrorBox>
      <ErrorList heading={t('heading.description')} fieldNames={descriptionErrorFields} />
      <ErrorList heading={t('heading.resource_type')} fieldNames={resourceErrorFields} />
      <ErrorList heading={t('heading.contributors')} fieldNames={contributorsErrorFields} />
      <ErrorList heading={t('heading.files_and_license')} fieldNames={filesErrorFields} />
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
      <ul>
        {fieldNames.map((fieldName) => {
          const translatedFieldName = t(fieldName.replace(/[[\]\d]/g, '').replace(/[.]/g, '-'));
          const translatedErrorMessage = getIn(errors, fieldName);

          return typeof translatedErrorMessage === 'string' ? (
            <li key={fieldName}>
              {translatedFieldName}: {translatedErrorMessage}
            </li>
          ) : null;
        })}
      </ul>
    </>
  ) : null;
};
