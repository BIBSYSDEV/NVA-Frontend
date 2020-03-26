import React, { FC } from 'react';
import { FormikProps, useFormikContext, FormikErrors } from 'formik';
import styled from 'styled-components';
import { FormikPublication } from '../../../types/publication.types';
import Heading from '../../../components/Heading';
import NormalText from '../../../components/NormalText';
import { useTranslation } from 'react-i18next';
import Card from '../../../components/Card';

const StyledCard = styled(Card)`
  border: 3px solid ${({ theme }) => theme.palette.danger.main};
  background-color: ${({ theme }) => theme.palette.danger.light};
`;

interface FormikError {
  fieldName: string;
  errorMessage: string;
}

const ErrorSummary: FC = () => {
  const { t } = useTranslation('publication');
  const { errors }: FormikProps<FormikPublication> = useFormikContext();
  const flattenedErrors = flattenErrors(errors);

  return flattenedErrors.length > 0 ? (
    <StyledCard>
      <Heading>{t('heading.validation_errors')}</Heading>
      {flattenedErrors.map(({ fieldName, errorMessage }) => (
        <NormalText key={fieldName}>
          <b>{t(`formikValues:${fieldName}`)}: </b>
          {errorMessage}
        </NormalText>
      ))}
    </StyledCard>
  ) : null;
};

// Convert all errors from nested object to flat array
const flattenErrors = (validationErrors: FormikErrors<any>): FormikError[] => {
  return Object.entries(validationErrors)
    .map(([fieldName, errorMessage]) => {
      if (typeof errorMessage === 'object' && errorMessage !== null) {
        return flattenErrors(errorMessage as FormikErrors<any>);
      }
      return { fieldName, errorMessage };
    })
    .flat();
};

export default ErrorSummary;
