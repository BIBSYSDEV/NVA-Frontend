import { DatePicker } from '@mui/x-date-pickers';
import { ErrorMessage, Field, FieldProps, getIn, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../../../utils/dataTestIds';

interface PeriodFieldsProps {
  fromFieldName: string;
  toFieldName: string;
}

export const PeriodFields = ({ fromFieldName, toFieldName }: PeriodFieldsProps) => {
  const { t } = useTranslation();
  const { values, setFieldValue, setFieldTouched } = useFormikContext();
  const maxDate = new Date(new Date().getFullYear() + 5, 11, 31);

  const fromValue = getIn(values, fromFieldName);
  const toValue = getIn(values, toFieldName);

  return (
    <>
      <Field name={fromFieldName}>
        {({ field, meta: { error, touched } }: FieldProps<string>) => (
          <DatePicker
            label={t('registration.resource_type.date_from')}
            value={field.value ? new Date(field.value) : null}
            onChange={(date) => {
              !touched && setFieldTouched(field.name, true, false);
              setFieldValue(field.name, date ?? '');
            }}
            views={['year', 'month', 'day']}
            maxDate={toValue ? new Date(toValue) : maxDate}
            slotProps={{
              textField: {
                inputProps: { 'data-testid': dataTestId.registrationWizard.resourceType.dateFromField },
                variant: 'filled',
                error: touched && !!error,
                required: true,
                onBlur: () => !touched && setFieldTouched(field.name),
                helperText: <ErrorMessage name={field.name} />,
              },
            }}
          />
        )}
      </Field>
      <Field name={toFieldName}>
        {({ field, meta: { error, touched } }: FieldProps<string>) => (
          <DatePicker
            label={t('registration.resource_type.date_to')}
            value={field.value ? new Date(field.value) : null}
            onChange={(date) => {
              !touched && setFieldTouched(field.name, true, false);
              setFieldValue(field.name, date ?? '');
            }}
            views={['year', 'month', 'day']}
            minDate={fromValue ? new Date(fromValue) : undefined}
            maxDate={maxDate}
            slotProps={{
              textField: {
                inputProps: { 'data-testid': dataTestId.registrationWizard.resourceType.dateToField },
                variant: 'filled',
                onBlur: () => !touched && setFieldTouched(field.name),
                error: touched && !!error,
                helperText: <ErrorMessage name={field.name} />,
              },
            }}
          />
        )}
      </Field>
    </>
  );
};
