import { DatePicker } from '@mui/x-date-pickers';
import { Field, FieldProps, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { NviPeriod } from '../../../../../types/nvi.types';
import { dataTestId } from '../../../../../utils/dataTestIds';

interface NviPeriodYearFieldProps {
  disabled: boolean;
  shouldDisableYear: (date: Date) => boolean;
  minDate?: Date;
  maxDate?: Date;
}

export const NviPeriodYearField = ({ disabled, shouldDisableYear, minDate, maxDate }: NviPeriodYearFieldProps) => {
  const { t } = useTranslation();
  const { setFieldValue } = useFormikContext<Omit<NviPeriod, 'id' | 'status'>>();

  return (
    <Field name="publishingYear">
      {({ field }: FieldProps<string>) => (
        <DatePicker
          label={t('basic_data.nvi.period_year')}
          slotProps={{
            textField: {
              required: true,
              inputProps: { 'data-testid': dataTestId.basicData.nviPeriod.nviPeriodYear },
            },
          }}
          disabled={disabled}
          views={['year']}
          value={field.value ? new Date(Number(field.value), 0, 1) : null}
          onChange={(newDate) => {
            const year = newDate ? newDate.getFullYear().toString() : '';
            setFieldValue(field.name, year);
            if (year) {
              setFieldValue('startDate', new Date(+year, 3, 1).toISOString());
              setFieldValue('reportingDate', new Date(+year + 1, 3, 1).toISOString());
            }
          }}
          shouldDisableYear={shouldDisableYear}
          minDate={minDate}
          maxDate={maxDate}
        />
      )}
    </Field>
  );
};
