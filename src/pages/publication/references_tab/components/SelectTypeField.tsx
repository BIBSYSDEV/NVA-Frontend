import React, { FC } from 'react';
import { Field, FieldProps, ErrorMessage } from 'formik';
import { TextField, MenuItem } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

interface SelectTypeFieldProps {
  fieldName: string;
  options: string[];
  onChangeExtension?: () => void;
}

const SelectTypeField: FC<SelectTypeFieldProps> = ({ fieldName, options, onChangeExtension }) => {
  const { t } = useTranslation();

  return (
    <Field name={fieldName} variant="outlined">
      {({ field, meta: { error, touched } }: FieldProps) => (
        <TextField
          data-testid="reference_type"
          select
          variant="outlined"
          fullWidth
          {...field}
          label={t('common:type')}
          error={!!error && touched}
          SelectProps={{ MenuProps: { autoFocus: false } }}
          helperText={<ErrorMessage name={field.name} />}
          onChange={(event: React.ChangeEvent<any>) => {
            field.onChange(event);
            onChangeExtension && onChangeExtension();
          }}>
          {options.map((typeValue) => (
            <MenuItem value={typeValue} key={typeValue} data-testid={`reference_type-${typeValue}`}>
              {t(`referenceTypes:${typeValue}`)}
            </MenuItem>
          ))}
        </TextField>
      )}
    </Field>
  );
};

export default SelectTypeField;
