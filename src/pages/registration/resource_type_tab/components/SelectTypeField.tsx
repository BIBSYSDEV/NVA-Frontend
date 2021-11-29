import { ErrorMessage, Field, FieldProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { MenuItem, TextField } from '@mui/material';

interface SelectTypeFieldProps {
  fieldName: string;
  options: string[];
  dataTestId?: string;
  onChangeType?: (value: string) => void;
}

export const SelectTypeField = ({
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
          id={field.name}
          data-testid={dataTestId}
          select
          variant="filled"
          fullWidth
          {...field}
          label={t('common:type')}
          required
          error={!!error && touched}
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
