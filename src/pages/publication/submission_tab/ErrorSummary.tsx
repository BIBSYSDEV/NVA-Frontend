import React, { FC } from 'react';
import { FormikProps, useFormikContext } from 'formik';
import styled from 'styled-components';
import { Publication } from '../../../types/publication.types';
import Heading from '../../../components/Heading';
import NormalText from '../../../components/NormalText';
import { useTranslation } from 'react-i18next';
import Card from '../../../components/Card';
import { flattenFormikErrors } from '../../../utils/formik-helpers';

const StyledCard = styled(Card)`
  border: 3px solid ${({ theme }) => theme.palette.danger.main};
  background-color: ${({ theme }) => theme.palette.danger.light};
`;

const ErrorSummary: FC = () => {
  const { t } = useTranslation('publication');
  const { errors }: FormikProps<Publication> = useFormikContext();
  const flattenedErrors = flattenFormikErrors(errors);

  return flattenedErrors.length > 0 ? (
    <StyledCard data-testid="error-summary-card">
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

export default ErrorSummary;
