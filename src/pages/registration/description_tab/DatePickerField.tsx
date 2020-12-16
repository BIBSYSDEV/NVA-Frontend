import React, { useState, useEffect, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FormControlLabel, Checkbox } from '@material-ui/core';
import styled from 'styled-components';
import { KeyboardDatePicker, DatePickerView } from '@material-ui/pickers';
import { useFormikContext } from 'formik';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Registration } from '../../../types/registration.types';
import { DescriptionFieldNames } from '../../../types/publicationFieldNames';
import { ErrorMessage } from '../../../utils/validation/errorMessage';

const StyledFormControlLabel = styled(FormControlLabel)`
  margin-left: 0.5rem;
  height: 100%; /* Ensure this element is as high as the DatePicker for centering */
`;

const DatePickerField: FC = () => {
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

    setFieldValue(DescriptionFieldNames.PUBLICATION_YEAR, updatedYearValue);
    setFieldValue(DescriptionFieldNames.PUBLICATION_MONTH, updatedMonthValue);
    setFieldValue(DescriptionFieldNames.PUBLICATION_DAY, updatedDayValue);
  }, [setFieldValue, date, yearOnly]);

  const toggleYearOnly = () => {
    setYearOnly(!yearOnly);
  };

  const setYearFieldTouched = () => setFieldTouched(DescriptionFieldNames.PUBLICATION_YEAR);

  const views: DatePickerView[] = yearOnly ? ['year'] : ['year', 'month', 'date'];

  const hasError = !!errors.entityDescription?.date?.year && touched.entityDescription?.date?.year;

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        data-testid="date-published-field"
        inputVariant="outlined"
        label={t('description.date_published')}
        required
        onChange={setDate}
        views={views}
        value={date}
        autoOk
        format={yearOnly ? 'yyyy' : 'dd.MM.yyyy'}
        onBlur={setYearFieldTouched}
        onClose={setYearFieldTouched}
        error={hasError}
        helperText={hasError && (!date ? ErrorMessage.REQUIRED : ErrorMessage.INVALID_FORMAT)}
      />
      <StyledFormControlLabel
        control={<Checkbox checked={yearOnly} onChange={toggleYearOnly} color="primary" />}
        label={t('description.year_only')}
      />
    </MuiPickersUtilsProvider>
  );
};

export default DatePickerField;
