import { useFormikContext } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import DateFnsUtils from '@date-io/date-fns';
import { Checkbox, FormControlLabel, MuiThemeProvider, Typography } from '@material-ui/core';
import { DatePickerView, KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import lightTheme, { datePickerTranslationProps } from '../../../themes/lightTheme';
import { DescriptionFieldNames } from '../../../types/publicationFieldNames';
import { Registration } from '../../../types/registration.types';
import { getDateFnsLocale } from '../../../utils/date-helpers';
import { ErrorMessage } from '../../../utils/validation/errorMessage';

const StyledFormControlLabel = styled(FormControlLabel)`
  margin-left: 0.5rem;
  height: 100%; /* Ensure this element is as high as the DatePicker for centering */
`;

const DatePickerField = () => {
  const { t, i18n } = useTranslation('registration');
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

  const updateDateValues = (newDate: Date | null, isYearOnly: boolean) => {
    const updatedYear = newDate ? newDate.getFullYear() : '';
    const updatedMonth = !isYearOnly && newDate ? newDate.getMonth() + 1 : '';
    const updatedDay = !isYearOnly && newDate ? newDate.getDate() : '';

    setFieldValue(DescriptionFieldNames.PUBLICATION_YEAR, updatedYear);
    setFieldValue(DescriptionFieldNames.PUBLICATION_MONTH, updatedMonth);
    setFieldValue(DescriptionFieldNames.PUBLICATION_DAY, updatedDay);
  };

  const onChangeDate = (newDate: Date | null) => {
    updateDateValues(newDate, yearOnly);
    setDate(newDate);
  };

  const toggleYearOnly = () => {
    const nextYearOnlyValue = !yearOnly;
    updateDateValues(date, nextYearOnlyValue);
    setYearOnly(nextYearOnlyValue);
  };

  const setYearFieldTouched = () => setFieldTouched(DescriptionFieldNames.PUBLICATION_YEAR);

  const views: DatePickerView[] = yearOnly ? ['year'] : ['year', 'month', 'date'];

  const hasError = !!errors.entityDescription?.date?.year && touched.entityDescription?.date?.year;

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={getDateFnsLocale(i18n.language)}>
      <MuiThemeProvider theme={lightTheme}>
        <KeyboardDatePicker
          {...datePickerTranslationProps}
          data-testid="date-published-field"
          inputVariant="filled"
          label={t('description.date_published')}
          required
          onChange={onChangeDate}
          views={views}
          value={date}
          autoOk
          maxDate={`${new Date().getFullYear() + 5}-12-31`}
          format={yearOnly ? 'yyyy' : 'dd.MM.yyyy'}
          onBlur={setYearFieldTouched}
          onClose={setYearFieldTouched}
          error={hasError}
          helperText={hasError && (!date ? ErrorMessage.REQUIRED : ErrorMessage.INVALID_FORMAT)}
        />
      </MuiThemeProvider>
      <StyledFormControlLabel
        control={<Checkbox checked={yearOnly} onChange={toggleYearOnly} color="primary" />}
        label={<Typography color="primary">{t('description.year_only')}</Typography>}
      />
    </MuiPickersUtilsProvider>
  );
};

export default DatePickerField;
