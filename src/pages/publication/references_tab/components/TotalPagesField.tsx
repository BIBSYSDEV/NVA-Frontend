import React, { FC } from 'react';
import { Field, FieldProps, ErrorMessage } from 'formik';
import { ReferenceFieldNames } from '../../../../types/publicationFieldNames';
import { TextField } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const StyledTextField = styled(TextField)`
  display: inline;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    display: grid;
  }
`;

const TotalPagesField: FC = () => {
  const { t } = useTranslation('publication');

  return (
    <Field name={ReferenceFieldNames.PAGES_PAGES}>
      {({ field, meta: { touched, error } }: FieldProps) => (
        <StyledTextField
          inputProps={{ 'data-testid': 'pages-input' }}
          variant="outlined"
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
