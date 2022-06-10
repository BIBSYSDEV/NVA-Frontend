import { FormikErrors, FormikTouched, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox, FormControlLabel, Typography, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { datePickerTranslationProps } from '../../../themes/mainTheme';
import { DescriptionFieldNames } from '../../../types/publicationFieldNames';
import { EntityDescription, Registration, RegistrationDate } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';

export const DatePickerField = () => {
  const { t } = useTranslation('registration');
  const {
    values: { entityDescription },
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
  } = useFormikContext<Registration>();

  const dateData = entityDescription?.date ?? { year: '', month: '', day: '' };

  const { year, month, day } = dateData;

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

  const touchedYear = (
    (touched.entityDescription as FormikTouched<EntityDescription>)?.date as FormikTouched<RegistrationDate>
  )?.year;
  const errorYear = (
    (errors.entityDescription as FormikErrors<EntityDescription>)?.date as FormikErrors<RegistrationDate>
  )?.year;
  const hasError = !!errorYear && touchedYear;

  return (
    <>
      <DatePicker
        {...datePickerTranslationProps}
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
            data-testid={dataTestId.registrationWizard.description.datePublishedField}
            variant="filled"
            required
            onBlur={() => !touchedYear && setFieldTouched(DescriptionFieldNames.PublicationYear)}
            error={hasError}
            helperText={hasError && errorYear}
          />
        )}
      />
      <FormControlLabel
        sx={{ alignSelf: 'start', mt: '0.4rem' }} // Center field regardless of error state of published date field
        control={<Checkbox checked={yearOnly} onChange={toggleYearOnly} />}
        label={<Typography>{t('description.year_only')}</Typography>}
      />
    </>
  );
};
