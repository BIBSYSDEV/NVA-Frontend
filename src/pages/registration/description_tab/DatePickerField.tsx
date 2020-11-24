import React, { useState, useEffect, FC } from 'react';
import { useTranslation } from 'react-i18next';

import { KeyboardDatePicker, DatePickerView } from '@material-ui/pickers';
import { useFormikContext, getIn, ErrorMessage } from 'formik';
import { Registration } from '../../../types/registration.types';
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

const DatePickerField: FC<DatePickerFieldProps> = ({ yearFieldName, monthFieldName, dayFieldName }) => {
  const { t } = useTranslation('registration');
  const { setFieldValue, values, errors, touched, setFieldTouched } = useFormikContext<Registration>();
  const { year, month, day } = values.entityDescription.date;
  const yearInt = parseInt(year);
  const monthInt = parseInt(month);
  const dayInt = parseInt(day);

  const [date, setDate] = useState<Date | null>(
    !isNaN(yearInt)
      ? !isNaN(monthInt)
        ? new Date(yearInt, monthInt - 1, !isNaN(dayInt) ? dayInt : 1, 12, 0, 0)
        : new Date(yearInt, 0, 1, 12, 0, 0)
      : null
  );
  const [yearOnly, setYearOnly] = useState(!!year && !month);

  useEffect(() => {
    // Extract data from date object
    const updatedYear = date ? date.getFullYear() : NaN;
    const updatedMonth = !yearOnly && date ? date.getMonth() + 1 : NaN;
    const updatedDay = !yearOnly && date ? date.getDate() : NaN;

    const updatedYearValue = !isNaN(updatedYear) ? updatedYear : '';
    const updatedMonthValue = !isNaN(updatedMonth) ? updatedMonth : '';
    const updatedDayValue = !isNaN(updatedDay) ? updatedDay : '';

    setFieldValue(yearFieldName, updatedYearValue);
    setFieldValue(monthFieldName, updatedMonthValue);
    setFieldValue(dayFieldName, updatedDayValue);
  }, [yearFieldName, monthFieldName, dayFieldName, setFieldValue, date, yearOnly]);

  const toggleYearOnly = () => {
    setYearOnly(!yearOnly);
  };

  const views: DatePickerView[] = yearOnly ? ['year'] : ['year', 'month', 'date'];

  return (
    <>
      <KeyboardDatePicker
        data-testid="date-published-field"
        inputVariant="outlined"
        label={t('description.date_published')}
        onChange={setDate}
        views={views}
        value={date}
        autoOk
        format={yearOnly ? 'yyyy' : 'dd.MM.yyyy'}
        onBlur={() => setFieldTouched(yearFieldName)}
        error={!!getIn(errors, yearFieldName) && getIn(touched, yearFieldName)}
        helperText={<ErrorMessage name={yearFieldName}></ErrorMessage>}
      />
      <StyledFormControlLabel
        control={<Checkbox checked={yearOnly} onChange={toggleYearOnly} color="primary" />}
        label={t('description.year_only')}
      />
    </>
  );
};

export default DatePickerField;
