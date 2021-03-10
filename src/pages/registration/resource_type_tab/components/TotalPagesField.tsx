import { ErrorMessage, Field, FieldProps } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TextField } from '@material-ui/core';
import { ReferenceFieldNames } from '../../../../types/publicationFieldNames';

const StyledTextField = styled(TextField)`
  display: inline;
  width: fit-content;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    display: grid;
    width: auto;
  }
`;

const TotalPagesField = () => {
  const { t } = useTranslation('registration');

  return (
    <Field name={ReferenceFieldNames.PAGES_PAGES}>
      {({ field, meta: { touched, error } }: FieldProps) => (
        <StyledTextField
          inputProps={{ 'data-testid': 'pages-input' }}
          variant="filled"
          label={t('references.number_of_pages')}
          {...field}
          value={field.value ?? ''}
          error={touched && !!error}
          helperText={<ErrorMessage name={field.name} />}
        />
      )}
    </Field>
  );
};

export default TotalPagesField;
