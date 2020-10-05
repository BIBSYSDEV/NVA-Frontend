import React, { FC } from 'react';
import { Field, FieldProps, ErrorMessage } from 'formik';
import { TextField } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { CustomerInstitutionFieldNames } from '../../../types/customerInstitution.types';

const DisplayNameField: FC = () => {
  const { t } = useTranslation('admin');

  return (
    <Field name={CustomerInstitutionFieldNames.DISPLAY_NAME}>
      {({ field, meta: { touched, error } }: FieldProps) => (
        <TextField
          {...field}
          label={t('display_name')}
          fullWidth
          variant="outlined"
          inputProps={{ 'data-testid': 'customer-institution-display-name-input' }}
          error={touched && !!error}
          helperText={<ErrorMessage name={field.name} />}
        />
      )}
    </Field>
  );
};

export default DisplayNameField;
