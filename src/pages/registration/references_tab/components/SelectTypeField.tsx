import { ErrorMessage, Field, FieldProps } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MenuItem, TextField } from '@material-ui/core';

interface SelectTypeFieldProps {
  fieldName: string;
  options: string[];
  dataTestId?: string;
  onChangeType?: (value: string) => void;
}

const SelectTypeField = ({
  fieldName,
  options,
  dataTestId = 'publication-instance-type',
  onChangeType,
}: SelectTypeFieldProps) => {
  const { t } = useTranslation();

  return (
    <Field name={fieldName}>
      {({ field, meta: { error, touched } }: FieldProps) => (
        <TextField
          data-testid={dataTestId}
          select
          variant="filled"
          fullWidth
          {...field}
          label={t('common:type')}
          required
          error={!!error && touched}
          SelectProps={{ MenuProps: { autoFocus: false } }}
          helperText={<ErrorMessage name={field.name} />}
          onChange={(event) => (onChangeType ? onChangeType(event.target.value) : field.onChange(event))}>
          {options.map((typeValue) => (
            <MenuItem value={typeValue} key={typeValue} data-testid={`${dataTestId}-${typeValue}`}>
              {t(`publicationTypes:${typeValue}`)}
            </MenuItem>
          ))}
        </TextField>
      )}
    </Field>
  );
};

export default SelectTypeField;
