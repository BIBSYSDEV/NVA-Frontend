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

interface ErrorSummaryProps {}

const ErrorSummary: FC<ErrorSummaryProps> = () => {
  const { t } = useTranslation('publication');
  const { errors }: FormikProps<FormikPublication> = useFormikContext();
  const validationErrors = errors.entityDescription;

  return validationErrors ? (
    <StyledCard>
      <Heading>{t('heading.validation_errors')}</Heading>
      {Object.entries(validationErrors).map(([key, value]) =>
        typeof value === 'string' ? (
          <NormalText key={key}>
            <b>{t(`formikValues:entityDescription.${key}`)}: </b>
            {value}
          </NormalText>
        ) : (
          Object.entries(value || {}).map(([key2, value2]) => (
            <NormalText key={key2}>
              <b>{t(`formikValues:entityDescription.${key2}`)}: </b>
              {value2}
            </NormalText>
          ))
        )
      )}
    </StyledCard>
  ) : null;
};

export default ErrorSummary;
