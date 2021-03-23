import React from 'react';
import { FormikProps, FormikRegistration, useFormikContext } from 'formik';
import styled from 'styled-components';
import { flattenFormikErrors } from '../../utils/formik-helpers';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';

const StyledErrorBox = styled.div`
  margin-top: 1rem;
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.palette.error.light};
`;

interface ErrorSummaryProps {
  showOnlyTouched?: boolean;
}

export const ErrorSummary = ({ showOnlyTouched = false }: ErrorSummaryProps) => {
  const { t } = useTranslation('registration');
  const { errors }: FormikProps<FormikRegistration> = useFormikContext();
  const flattenedErrors = flattenFormikErrors(errors);

  return flattenedErrors.length > 0 ? (
    <StyledErrorBox>
      {flattenedErrors.map(({ fieldName, errorMessage }) => (
        <Typography key={fieldName}>
          <b>{t(`formikValues:${fieldName}`)}: </b>
          {errorMessage}
        </Typography>
      ))}
    </StyledErrorBox>
  ) : null;
};
