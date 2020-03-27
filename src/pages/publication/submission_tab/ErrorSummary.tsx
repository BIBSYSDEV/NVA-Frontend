import React, { FC } from 'react';
import { FormikProps, useFormikContext } from 'formik';
import styled from 'styled-components';
import { FormikPublication } from '../../../types/publication.types';
import Heading from '../../../components/Heading';
import NormalText from '../../../components/NormalText';
import { useTranslation } from 'react-i18next';
import Card from '../../../components/Card';
import { flattenFormikErrors } from '../../../utils/formik-helpers';

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
  const flattenedErrors = flattenFormikErrors(errors);

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

export default ErrorSummary;
