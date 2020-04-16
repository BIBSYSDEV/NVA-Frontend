import React, { FC } from 'react';
import { Field, FieldProps, ErrorMessage } from 'formik';
import { TextField, MenuItem } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

interface SelectTypeFieldProps {
  fieldName: string;
  options: string[];
}

const SelectTypeField: FC<SelectTypeFieldProps> = ({ fieldName, options }) => {
  const { t } = useTranslation();

  return (
    <Field name={fieldName} variant="outlined">
      {({ field, meta: { error, touched } }: FieldProps) => (
        <TextField
          data-testid="publication_type"
          select
          variant="outlined"
          fullWidth
          {...field}
          label={t('common:type')}
          error={!!error && touched}
          SelectProps={{ MenuProps: { autoFocus: false } }}
          helperText={<ErrorMessage name={field.name} />}>
          {options.map((typeValue) => (
            <MenuItem value={typeValue} key={typeValue} data-testid={`publication_type-${typeValue}`}>
              {t(`publicationTypes:${typeValue}`)}
            </MenuItem>
          ))}
        </TextField>
      )}
    </Field>
  );
};

export default SelectTypeField;
