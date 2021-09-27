import { useFormikContext } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Checkbox, FormControlLabel, ThemeProvider, Typography, TextField } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
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

  const hasError = !!errors.entityDescription?.date?.year && touched.entityDescription?.date?.year;

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={getDateFnsLocale(i18n.language)}>
        <ThemeProvider theme={lightTheme}>
          <DatePicker
            {...datePickerTranslationProps}
            data-testid="date-published-field"
            label={t('description.date_published')}
            value={date}
            onChange={onChangeDate}
            inputFormat={yearOnly ? 'yyyy' : 'dd.MM.yyyy'}
            views={yearOnly ? ['year'] : ['year', 'month', 'day']}
            maxDate={new Date(new Date().getFullYear() + 5, 11, 31)}
            mask={yearOnly ? '____' : '__.__.____'}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="filled"
                required
                onBlur={() =>
                  !touched.entityDescription?.date?.year && setFieldTouched(DescriptionFieldNames.PublicationYear)
                }
                error={hasError}
                helperText={hasError && errors.entityDescription?.date?.year}
              />
            )}
          />
        </ThemeProvider>
      </LocalizationProvider>
      <StyledFormControlLabel
        control={<Checkbox checked={yearOnly} onChange={toggleYearOnly} color="primary" />}
        label={<Typography>{t('description.year_only')}</Typography>}
      />
    </>
  );
};
