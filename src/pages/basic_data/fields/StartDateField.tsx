import { DatePicker } from '@mui/lab';
import { TextField } from '@mui/material';
import { Field, FieldProps, ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';
import { datePickerTranslationProps } from '../../../themes/mainTheme';
import { getNewDateValue } from '../../../utils/registration-helpers';

interface StartDateFieldProps {
  fieldName: string;
  maxDate?: Date;
  disabled?: boolean;
}

export const StartDateField = ({ fieldName, maxDate, disabled = false }: StartDateFieldProps) => {
  const { t } = useTranslation('common');

  return (
    <Field name={fieldName}>
      {({ field, form: { setFieldValue }, meta: { error, touched } }: FieldProps<string>) => (
        <DatePicker
          {...datePickerTranslationProps}
          disabled={disabled}
          label={t('start_date')}
          value={field.value ? field.value : null}
          onChange={(date: Date | null, keyboardInput) => {
            const newValue = getNewDateValue(date, keyboardInput);
            if (newValue !== null) {
              setFieldValue(field.name, newValue);
            }
          }}
          inputFormat="dd.MM.yyyy"
          views={['year', 'month', 'day']}
          mask="__.__.____"
          maxDate={maxDate}
          renderInput={(params) => (
            <TextField
              {...field}
              {...params}
              required
              variant="filled"
              error={touched && !!error}
              helperText={<ErrorMessage name={field.name} />}
            />
          )}
        />
      )}
    </Field>
  );
};
