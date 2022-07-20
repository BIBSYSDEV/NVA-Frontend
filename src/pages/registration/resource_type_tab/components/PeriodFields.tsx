import { DatePicker } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';
import { ErrorMessage, Field, FieldProps, getIn, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../../../utils/dataTestIds';
import { getNewDateValue } from '../../../../utils/registration-helpers';

interface PeriodFieldsProps {
  fromFieldName: string;
  toFieldName: string;
}

export const PeriodFields = ({ fromFieldName, toFieldName }: PeriodFieldsProps) => {
  const { t } = useTranslation('registration');
  const { values, setFieldValue, setFieldTouched } = useFormikContext();
  const maxDate = new Date(new Date().getFullYear() + 5, 11, 31);

  const fromValue = getIn(values, fromFieldName);
  const toValue = getIn(values, toFieldName);

  return (
    <>
      <Field name={fromFieldName}>
        {({ field, meta: { error, touched } }: FieldProps<string>) => (
          <DatePicker
            label={t('resource_type.date_from')}
            value={field.value ?? null}
            onChange={(date, keyboardInput) => {
              !touched && setFieldTouched(field.name, true, false);
              const newValue = getNewDateValue(date, keyboardInput);
              if (newValue !== null) {
                setFieldValue(field.name, newValue);
              }
            }}
            inputFormat="dd.MM.yyyy"
            views={['year', 'month', 'day']}
            maxDate={toValue ? new Date(toValue) : maxDate}
            mask="__.__.____"
            renderInput={(params) => (
              <TextField
                {...params}
                data-testid={dataTestId.registrationWizard.resourceType.dateFromField}
                variant="filled"
                required
                onBlur={() => !touched && setFieldTouched(field.name)}
                error={touched && !!error}
                helperText={<ErrorMessage name={field.name} />}
              />
            )}
          />
        )}
      </Field>
      <Field name={toFieldName}>
        {({ field, meta: { error, touched } }: FieldProps<string>) => (
          <DatePicker
            label={t('resource_type.date_to')}
            value={field.value ?? null}
            onChange={(date, keyboardInput) => {
              !touched && setFieldTouched(field.name, true, false);
              const newValue = getNewDateValue(date, keyboardInput);
              if (newValue !== null) {
                setFieldValue(field.name, newValue);
              }
            }}
            inputFormat="dd.MM.yyyy"
            views={['year', 'month', 'day']}
            minDate={fromValue ? new Date(fromValue) : undefined}
            maxDate={maxDate}
            mask="__.__.____"
            renderInput={(params) => (
              <TextField
                {...params}
                data-testid={dataTestId.registrationWizard.resourceType.dateToField}
                variant="filled"
                required
                onBlur={() => !touched && setFieldTouched(field.name)}
                error={touched && !!error}
                helperText={<ErrorMessage name={field.name} />}
              />
            )}
          />
        )}
      </Field>
    </>
  );
};
