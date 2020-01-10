import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { KeyboardDatePicker } from '@material-ui/pickers';
import { useFormikContext, Field } from 'formik';

const DatePickerField = ({ yearFieldName, monthFieldName, dayFieldName }: any) => {
  const { t } = useTranslation();
  const { values, setFieldValue }: any = useFormikContext();
  const [date, setDate] = useState<Date | null>(null);

  // useEffect(() => {
  //   if (date) {
  //     setFieldValue(yearFieldName, date.getFullYear());
  //     setFieldValue(monthFieldName, date.getMonth());
  //     setFieldValue(dayFieldName, date.get)
  //   }
  // }, [date]);
  console.log('values', values);
  const { year, month, day } = values.publicationDate;

  useEffect(() => {
    if (year) {
      const newDate = new Date(year, month || 1, day || 1);
      setDate(newDate);
    }
  }, [year, month, day]);

  return (
    <>
      <Field name={yearFieldName}>
        {({ field: { name } }: any) => (
          <KeyboardDatePicker
            inputVariant="outlined"
            label={t('år')}
            onChange={value => {
              console.log('år', value);
              setFieldValue(name, value?.getFullYear());
            }}
            views={['year']}
            value={year ? date : null}
          />
        )}
      </Field>

      <Field name={monthFieldName}>
        {({ field: { name } }: any) => (
          <KeyboardDatePicker
            inputVariant="outlined"
            label={t('mnd')}
            onChange={value => {
              console.log('mnd', value);
              setFieldValue(name, value ? value.getMonth() : null);
            }}
            views={['month']}
            value={month ? date : null}
            initialFocusedDate={date}
          />
        )}
      </Field>

      <Field name={dayFieldName}>
        {({ field: { name } }: any) => (
          <KeyboardDatePicker
            inputVariant="outlined"
            label={t('dag')}
            onChange={value => {
              console.log('dag', value);
              setFieldValue(monthFieldName, value?.getMonth());
              setFieldValue(name, value?.getDate());
            }}
            views={['year', 'month', 'date']}
            initialFocusedDate={date}
            value={day ? date : null}
            // disabled={!!month}
          />
        )}
      </Field>
    </>
  );
};

export default DatePickerField;
