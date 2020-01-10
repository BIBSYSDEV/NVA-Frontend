import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { KeyboardDatePicker, DatePickerView } from '@material-ui/pickers';
import { useFormikContext, Field, FormikProps } from 'formik';
import { Publication } from '../../../types/publication.types';
import { FormControlLabel, Checkbox } from '@material-ui/core';

const DatePickerField = ({ yearFieldName, monthFieldName, dayFieldName }: any) => {
  const { t } = useTranslation('publication');
  const {
    values: {
      publicationDate: { year, month, day },
    },
    setFieldValue,
  }: FormikProps<Publication> = useFormikContext();

  const [date, setDate] = useState<Date | null>(null);
  const [yearOnly, setYearOnly] = useState(false);

  useEffect(() => {
    if (year) {
      setDate(new Date(parseInt(year), parseInt(month) || 0, parseInt(day) || 1));
    }
  }, [year, month, day]);

  useEffect(() => {
    updateDateValues(date);
  }, [yearOnly]);

  const updateDateValues = (newDate: Date | null) => {
    const updatedYear = newDate ? newDate.getFullYear() : '';
    const updatedMonth = !yearOnly && newDate ? newDate.getMonth() : '';
    const updatedDay = !yearOnly && newDate ? newDate.getDate() : '';

    setFieldValue(yearFieldName, updatedYear);
    setFieldValue(monthFieldName, updatedMonth);
    setFieldValue(dayFieldName, updatedDay);
  };

  const toggleYearOnly = () => {
    setYearOnly(!yearOnly);
  };

  const views: DatePickerView[] = yearOnly ? ['year'] : ['year', 'month', 'date'];
  console.log(year, month, day);
  return (
    <>
      <KeyboardDatePicker
        inputVariant="outlined"
        label={t('description.publish_date')}
        onChange={updateDateValues}
        views={views}
        value={date}
      />
      <FormControlLabel
        control={<Checkbox checked={yearOnly} onChange={toggleYearOnly} color="primary" />}
        label={t('description.year_only')}
      />
    </>
  );
};

export default DatePickerField;
