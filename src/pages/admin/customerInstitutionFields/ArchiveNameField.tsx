import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Field, FieldProps } from 'formik';
import { CustomerInstitutionFieldNames } from '../../../types/customerInstitution.types';
import { TextField } from '@material-ui/core';

const ArchiveNameField: FC = () => {
  const { t } = useTranslation('admin');

  return (
    <Field name={CustomerInstitutionFieldNames.ARCHIVE_NAME}>
      {({ field }: FieldProps) => (
        <TextField
          {...field}
          label={t('archive_name')}
          fullWidth
          variant="outlined"
          inputProps={{ 'data-testid': 'customer-institution-archive-name-input' }}
        />
      )}
    </Field>
  );
};

export default ArchiveNameField;
