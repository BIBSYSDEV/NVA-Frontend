import { ErrorMessage, Field, FieldProps } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { MuiThemeProvider, TextField } from '@material-ui/core';
import { ReferenceFieldNames } from '../../../../types/publicationFieldNames';
import lightTheme from '../../../../themes/lightTheme';

const StyledTextField = styled(TextField)`
  display: inline;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    display: grid;
  }
`;

const TotalPagesField = () => {
  const { t } = useTranslation('registration');

  return (
    <Field name={ReferenceFieldNames.PAGES_PAGES}>
      {({ field, meta: { touched, error } }: FieldProps) => (
        <MuiThemeProvider theme={lightTheme}>
          <StyledTextField
            inputProps={{ 'data-testid': 'pages-input' }}
            variant="filled"
            label={t('references.number_of_pages')}
            {...field}
            value={field.value ?? ''}
            error={touched && !!error}
            helperText={<ErrorMessage name={field.name} />}
          />
        </MuiThemeProvider>
      )}
    </Field>
  );
};

export default TotalPagesField;
