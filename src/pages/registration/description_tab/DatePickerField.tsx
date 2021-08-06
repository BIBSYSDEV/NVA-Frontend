import { useFormikContext } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import DateFnsUtils from '@date-io/date-fns';
import { Checkbox, FormControlLabel, MuiThemeProvider, Typography } from '@material-ui/core';
import { DatePickerView, KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { lightTheme, datePickerTranslationProps } from '../../../themes/lightTheme';
import { DescriptionFieldNames } from '../../../types/publicationFieldNames';
import { Registration, RegistrationDate } from '../../../types/registration.types';
import { getDateFnsLocale } from '../../../utils/date-helpers';

const StyledFormControlLabel = styled(FormControlLabel)`
  margin-left: 0.5rem;
  height: 100%; /* Ensure this element is as high as the DatePicker for centering */
`;

export const DatePickerField = () => {
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

  const setYearFieldTouched = () =>
    !touched.entityDescription?.date?.year && setFieldTouched(DescriptionFieldNames.PublicationYear);

  const updateDateValues = (newDate: Date | null, isYearOnly: boolean) => {
    const updatedDate: RegistrationDate = {
      type: 'PublicationDate',
      year: newDate ? newDate.getFullYear().toString() : '',
      month: !isYearOnly && newDate ? (newDate.getMonth() + 1).toString() : '',
      day: !isYearOnly && newDate ? newDate.getDate().toString() : '',
    };
    setFieldValue(DescriptionFieldNames.Date, updatedDate);
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

  const views: DatePickerView[] = yearOnly ? ['year'] : ['year', 'month', 'date'];

  const hasError = !!errors.entityDescription?.date?.year && touched.entityDescription?.date?.year;

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={getDateFnsLocale(i18n.language)}>
      <MuiThemeProvider theme={lightTheme}>
        <KeyboardDatePicker
          id="date-picker"
          {...datePickerTranslationProps}
          DialogProps={{ 'aria-labelledby': 'date-picker-label', 'aria-label': t('description.date_published') }}
          KeyboardButtonProps={{
            'aria-labelledby': 'date-picker-label',
          }}
          leftArrowButtonProps={{ 'aria-label': t('common:previous') }}
          rightArrowButtonProps={{ 'aria-label': t('common:next') }}
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
          helperText={hasError && errors.entityDescription?.date?.year}
        />
      </MuiThemeProvider>
      <StyledFormControlLabel
        control={<Checkbox checked={yearOnly} onChange={toggleYearOnly} color="primary" />}
        label={<Typography>{t('description.year_only')}</Typography>}
      />
    </MuiPickersUtilsProvider>
  );
};
