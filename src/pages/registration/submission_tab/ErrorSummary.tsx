import React, { FC } from 'react';
import { useFormikContext } from 'formik';
import styled from 'styled-components';
import { Registration } from '../../../types/registration.types';
import { useTranslation } from 'react-i18next';
import Card from '../../../components/Card';
import { flattenFormikErrors } from '../../../utils/formik-helpers';
import { Typography } from '@material-ui/core';

const StyledCard = styled(Card)`
  border: 3px solid ${({ theme }) => theme.palette.danger.main};
  background-color: ${({ theme }) => theme.palette.danger.light};
`;

const ErrorSummary: FC = () => {
  const { t } = useTranslation('registration');
  const { errors } = useFormikContext<Registration>();
  const flattenedErrors = flattenFormikErrors(errors);

  return flattenedErrors.length > 0 ? (
    <StyledCard data-testid="error-summary-card">
      <Typography variant="h5">{t('heading.validation_errors')}</Typography>
      {flattenedErrors.map(({ fieldName, errorMessage }) => (
        <Typography key={fieldName}>
          <b>{t(`formikValues:${fieldName}`)}: </b>
          {errorMessage}
        </Typography>
      ))}
    </StyledCard>
  ) : null;
};

export default ErrorSummary;
