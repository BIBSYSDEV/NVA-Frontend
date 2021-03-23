import React from 'react';
import { FormikProps, getIn, useFormikContext } from 'formik';
import styled from 'styled-components';
import { getAllContributorFields, getAllFileFields, getErrorFieldNames } from '../../utils/formik-helpers';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { descriptionFieldNames, resourceFieldNames } from './RegistrationFormTabs';
import { Registration } from '../../types/registration.types';

const StyledErrorBox = styled.div`
  margin-top: 1rem;
  padding: 0.5rem 2rem;
  background-color: ${({ theme }) => theme.palette.error.light};
`;

interface ErrorSummaryProps {
  showOnlyTouched?: boolean;
}

export const ErrorSummary = ({ showOnlyTouched = false }: ErrorSummaryProps) => {
  const { t } = useTranslation('registration');
  const { errors, touched, values }: FormikProps<Registration> = useFormikContext();

  const descriptionErrors = showOnlyTouched
    ? getErrorFieldNames(descriptionFieldNames, errors, touched)
    : getErrorFieldNames(descriptionFieldNames, errors);
  const resourceErrors = showOnlyTouched
    ? getErrorFieldNames(resourceFieldNames, errors, touched)
    : getErrorFieldNames(resourceFieldNames, errors);
  const contributorsErrors = showOnlyTouched
    ? getErrorFieldNames(getAllContributorFields(values.entityDescription.contributors), errors, touched)
    : getErrorFieldNames(getAllContributorFields(values.entityDescription.contributors), errors);
  const filesErrors = showOnlyTouched
    ? getErrorFieldNames(getAllFileFields(values.fileSet.files), errors, touched)
    : getErrorFieldNames(getAllFileFields(values.fileSet.files), errors);

  return descriptionErrors.length > 0 ||
    resourceErrors.length > 0 ||
    contributorsErrors.length > 0 ||
    filesErrors.length > 0 ? (
    <StyledErrorBox>
      <ErrorList heading={t('heading.description')} fieldNames={descriptionErrors} />
      <ErrorList heading={t('heading.resource_type')} fieldNames={resourceErrors} />
      <ErrorList heading={t('heading.contributors')} fieldNames={contributorsErrors} />
      <ErrorList heading={t('heading.files_and_license')} fieldNames={filesErrors} />
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
