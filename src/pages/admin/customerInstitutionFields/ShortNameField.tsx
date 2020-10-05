import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Field, FieldProps, ErrorMessage } from 'formik';
import { TextField } from '@material-ui/core';
import { CustomerInstitutionFieldNames } from '../../../types/customerInstitution.types';

const ShortNameField: FC = () => {
  const { t } = useTranslation('admin');

  return (
    <Field name={CustomerInstitutionFieldNames.SHORT_NAME}>
      {({ field, meta: { touched, error } }: FieldProps) => (
        <TextField
          {...field}
          label={t('short_name')}
          fullWidth
          variant="outlined"
          inputProps={{ 'data-testid': 'customer-institution-short-name-input' }}
          error={touched && !!error}
          helperText={<ErrorMessage name={field.name} />}
        />
      )}
    </Field>
  );
};

export default ShortNameField;
