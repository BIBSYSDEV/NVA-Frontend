import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { KeyboardDatePicker, DatePickerView } from '@material-ui/pickers';
import { useFormikContext, FormikProps } from 'formik';
import { Publication } from '../../../types/publication.types';
import { FormControlLabel, Checkbox } from '@material-ui/core';
import styled from 'styled-components';

const StyledFormControlLabel = styled(FormControlLabel)`
  margin-left: 0.5rem;
  height: 100%; /* Ensure this element is as high as the DatePicker for centering */
`;

interface DatePickerFieldProps {
  yearFieldName: string;
  monthFieldName: string;
  dayFieldName: string;
}

const DatePickerField = ({ yearFieldName, monthFieldName, dayFieldName }: DatePickerFieldProps) => {
  const { t } = useTranslation('publication');
  const { setFieldValue }: FormikProps<Publication> = useFormikContext();

  const [date, setDate] = useState<Date | null>(null);
  const [yearOnly, setYearOnly] = useState(false);

  useEffect(() => {
    // Extract data from date object
    const updatedYear = date ? date.getFullYear() : '';
    const updatedMonth = !yearOnly && date ? date.getMonth() : '';
    const updatedDay = !yearOnly && date ? date.getDate() : '';

    setFieldValue(yearFieldName, updatedYear);
    setFieldValue(monthFieldName, updatedMonth);
    setFieldValue(dayFieldName, updatedDay);
  }, [yearFieldName, monthFieldName, dayFieldName, setFieldValue, date, yearOnly]);

  const toggleYearOnly = () => {
    setYearOnly(!yearOnly);
  };

  const views: DatePickerView[] = yearOnly ? ['year'] : ['year', 'month', 'date'];

  return (
    <>
      <KeyboardDatePicker
        inputVariant="outlined"
        label={t('description.publish_date')}
        onChange={setDate}
        views={views}
        value={date}
        labelFunc={date => {
          if (!date) {
            return '';
          } else if (yearOnly) {
            return `${date.getFullYear()}`;
          } else {
            return date.toLocaleDateString();
          }
        }}
      />
      <StyledFormControlLabel
        control={<Checkbox checked={yearOnly} onChange={toggleYearOnly} color="primary" />}
        label={t('description.year_only')}
      />
    </>
  );
};

export default DatePickerField;
