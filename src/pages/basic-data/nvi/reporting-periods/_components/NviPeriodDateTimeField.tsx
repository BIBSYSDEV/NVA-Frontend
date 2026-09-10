import { DateTimePicker } from '@mui/x-date-pickers';
import { Field, FieldProps, useFormikContext } from 'formik';
import { NviPeriod } from '../../../../../types/nvi.types';

type NviPeriodDateField = 'startDate' | 'reportingDate';

interface NviPeriodDateTimeFieldProps {
  name: NviPeriodDateField;
  label: string;
  dataTestId: string;
}

const getDateBounds = (name: NviPeriodDateField, publishingYear: number) => {
  if (name === 'startDate') {
    return { minDate: new Date(publishingYear, 0, 1), maxDate: new Date(publishingYear + 1, 0, 1) };
  }
  return { minDate: new Date(publishingYear + 1, 0, 1), maxDate: new Date(publishingYear + 1, 6, 31) };
};

export const NviPeriodDateTimeField = ({ name, label, dataTestId }: NviPeriodDateTimeFieldProps) => {
  const { values, setFieldValue } = useFormikContext<Omit<NviPeriod, 'id' | 'status'>>();

  const publishingYear = values.publishingYear ? +values.publishingYear : null;
  const { minDate, maxDate } = publishingYear
    ? getDateBounds(name, publishingYear)
    : { minDate: undefined, maxDate: undefined };

  return (
    <Field name={name}>
      {({ field }: FieldProps<string>) => (
        <DateTimePicker
          sx={{ flex: 1 }}
          label={label}
          slotProps={{
            textField: {
              required: true,
              'data-testid': dataTestId,
            },
          }}
          disabled={!publishingYear}
          value={field.value ? new Date(field.value) : null}
          minDate={minDate}
          maxDate={maxDate}
          onChange={(newDate, context) => {
            if (context.validationError !== 'invalidDate') {
              setFieldValue(field.name, newDate ? newDate.toISOString() : '');
            }
          }}
        />
      )}
    </Field>
  );
};
