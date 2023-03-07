import { DatePicker } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';
import { Field, FieldProps } from 'formik';
import { useTranslation } from 'react-i18next';

interface StartDateFieldProps {
  fieldName: string;
  maxDate?: Date;
  disabled?: boolean;
}

export const StartDateField = ({ fieldName, maxDate, disabled = false }: StartDateFieldProps) => {
  const { t } = useTranslation();

  return (
    <Field name={fieldName}>
      {({ field, form: { setFieldValue, setFieldTouched }, meta: { error, touched } }: FieldProps<string>) => (
        <DatePicker
          disabled={disabled}
          label={t('common.start_date')}
          value={field.value ? new Date(field.value) : null}
          onChange={(date) => {
            !touched && setFieldTouched(field.name, true, false);
            setFieldValue(field.name, date ?? '');
          }}
          format="dd.MM.yyyy"
          views={['year', 'month', 'day']}
          /* mask="__.__.____" */
          maxDate={maxDate}
          slotProps={{
            popper: {
              'aria-label': t('common.start_date'),
            },
            textField: { variant: 'filled', error: touched && !!error, helperText: touched && error, required: true },
          }}
        />
      )}
    </Field>
  );
};
