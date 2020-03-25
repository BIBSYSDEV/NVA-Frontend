import React, { FC } from 'react';
import { FormikProps, useFormikContext } from 'formik';
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

const ErrorSummary: FC = () => {
  const { t } = useTranslation('publication');
  const { errors }: FormikProps<FormikPublication> = useFormikContext();
  const validationErrors = errors.entityDescription || {};

  const flattendErrors = Object.entries(validationErrors)
    .map(([fieldName, errorMessage]) => {
      if (typeof errorMessage === 'object') {
        return Object.entries(errorMessage).map(([fieldName2, errorMessage2]) => ({
          fieldName: fieldName2,
          errorMessage: errorMessage2,
        }));
      }
      return { fieldName, errorMessage };
    })
    .flat();

  return flattendErrors.length > 0 ? (
    <StyledCard>
      <Heading>{t('heading.validation_errors')}</Heading>
      {flattendErrors.map(({ fieldName, errorMessage }) => (
        <NormalText key={fieldName}>
          <b>{t(`formikValues:entityDescription.${fieldName}`)}: </b>
          {errorMessage}
        </NormalText>
      ))}
    </StyledCard>
  ) : null;
};

export default ErrorSummary;
