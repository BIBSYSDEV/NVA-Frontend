import { ErrorMessage, Field, FieldProps } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TextField } from '@material-ui/core';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { dataTestId } from '../../../../utils/dataTestIds';

const StyledTextField = styled(TextField)`
  width: fit-content;
`;

export const TotalPagesField = () => {
  const { t } = useTranslation('registration');

  return (
    <Field name={ResourceFieldNames.PAGES_PAGES}>
      {({ field, meta: { touched, error } }: FieldProps) => (
        <StyledTextField
          id={field.name}
          data-testid={dataTestId.registrationWizard.resourceType.pagesField}
          variant="filled"
          label={t('resource_type.number_of_pages')}
          {...field}
          value={field.value ?? ''}
          error={touched && !!error}
          helperText={<ErrorMessage name={field.name} />}
        />
      )}
    </Field>
  );
};
