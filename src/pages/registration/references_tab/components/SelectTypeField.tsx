import React, { FC } from 'react';
import { Field, FieldProps, ErrorMessage } from 'formik';
import { TextField, MenuItem } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

interface SelectTypeFieldProps {
  fieldName: string;
  options: string[];
  dataTestId?: string;
  onChangeType?: (value: string) => void;
}

const SelectTypeField: FC<SelectTypeFieldProps> = ({
  fieldName,
  options,
  dataTestId = 'publication-instance-type',
  onChangeType,
}) => {
  const { t } = useTranslation();

  return (
    <Field name={fieldName} variant="outlined">
      {({ field, meta: { error, touched } }: FieldProps) => (
        <TextField
          data-testid={dataTestId}
          select
          variant="outlined"
          fullWidth
          {...field}
          label={t('common:type')}
          error={!!error && touched}
          SelectProps={{ MenuProps: { autoFocus: false } }}
          helperText={<ErrorMessage name={field.name} />}
          onChange={(event: React.ChangeEvent<any>) =>
            onChangeType ? onChangeType(event.target.value) : field.onChange(event)
          }>
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
