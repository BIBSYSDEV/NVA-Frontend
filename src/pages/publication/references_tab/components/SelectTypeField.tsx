import React, { FC } from 'react';
import { Field, FieldProps, ErrorMessage } from 'formik';
import { TextField, MenuItem } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

interface SelectTypeFieldProps {
  fieldName: string;
  options: string[];
  i18nKeyPrefix?: string;
}

const SelectTypeField: FC<SelectTypeFieldProps> = ({ fieldName, options, i18nKeyPrefix = 'referenceTypes:' }) => {
  const { t } = useTranslation('publication');

  return (
    <Field name={fieldName} variant="outlined">
      {({ field, meta: { error, touched } }: FieldProps) => (
        <TextField
          select
          variant="outlined"
          fullWidth
          {...field}
          label={t('common:type')}
          error={!!error && touched}
          SelectProps={{ MenuProps: { autoFocus: false } }}
          helperText={<ErrorMessage name={field.name} />}>
          {options.map(typeValue => (
            <MenuItem value={typeValue} key={typeValue}>
              {t(`${i18nKeyPrefix}${typeValue}`)}
            </MenuItem>
          ))}
        </TextField>
      )}
    </Field>
  );
};

export default SelectTypeField;
