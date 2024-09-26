import { DatePicker } from '@mui/x-date-pickers';
import { ErrorMessage, Field, FieldProps } from 'formik';
import { useTranslation } from 'react-i18next';

interface StartDateFieldProps {
  fieldName: string;
  maxDate?: Date;
  disabled?: boolean;
  dataTestId?: string;
}

export const StartDateField = ({ fieldName, maxDate, disabled = false, dataTestId }: StartDateFieldProps) => {
  const { t } = useTranslation();

  return (
    <Field name={fieldName}>
      {({ field, form: { setFieldValue, setFieldTouched }, meta: { error, touched } }: FieldProps<string>) => (
        <DatePicker
          disabled={disabled}
          label={t('common.start_date')}
          value={field.value ? new Date(field.value) : null}
          onChange={(date) => {
            if (!touched) {
              setFieldTouched(field.name, true, false);
            }
            setFieldValue(field.name, date ?? '');
          }}
          views={['year', 'month', 'day']}
          maxDate={maxDate}
          slotProps={{
            textField: {
              inputProps: { 'data-testid': dataTestId },
              variant: 'filled',
              error: touched && !!error,
              helperText: <ErrorMessage name={field.name} />,
              required: true,
            },
          }}
        />
      )}
    </Field>
  );
};
