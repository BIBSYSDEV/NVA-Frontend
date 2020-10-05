import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Field, FieldProps, ErrorMessage } from 'formik';
import { CustomerInstitutionFieldNames } from '../../../types/customerInstitution.types';
import { TextField } from '@material-ui/core';

const FeideOrganizationIdField: FC = () => {
  const { t } = useTranslation('admin');

  return (
    <Field name={CustomerInstitutionFieldNames.FEIDE_ORGANIZATION_ID}>
      {({ field, meta: { touched, error } }: FieldProps) => (
        <TextField
          {...field}
          label={t('feide_organization_id')}
          fullWidth
          variant="outlined"
          inputProps={{ 'data-testid': 'customer-institution-feide-organization-id-input' }}
          error={touched && !!error}
          helperText={<ErrorMessage name={field.name} />}
        />
      )}
    </Field>
  );
};

export default FeideOrganizationIdField;
