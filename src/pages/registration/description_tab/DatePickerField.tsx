import { Checkbox, FormControlLabel, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { FormikErrors, FormikTouched, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DescriptionFieldNames } from '../../../types/publicationFieldNames';
import { EntityDescription, Registration, RegistrationDate } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';

export const DatePickerField = () => {
  const { t } = useTranslation();
  const {
    values: { entityDescription },
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
  } = useFormikContext<Registration>();

  const dateData = entityDescription?.publicationDate ?? { year: '', month: '', day: '' };

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
    setFieldValue(DescriptionFieldNames.PublicationDate, updatedDate);
  };

  const touchedYear = (
    (touched.entityDescription as unknown as FormikTouched<EntityDescription>)
      ?.publicationDate as unknown as FormikTouched<RegistrationDate>
  )?.year;
  const errorYear = (
    (errors.entityDescription as unknown as FormikErrors<EntityDescription>)
      ?.publicationDate as unknown as FormikErrors<RegistrationDate>
  )?.year;
  const hasError = !!errorYear && touchedYear;

  return (
    <>
      <DatePicker
        label={t('registration.description.date_published')}
        value={date}
        onChange={(newDate) => {
          updateDateValues(newDate, yearOnly);
          setDate(newDate);
        }}
        views={yearOnly ? ['year'] : ['year', 'month', 'day']}
        maxDate={new Date(new Date().getFullYear() + 5, 11, 31)}
        slotProps={{
          textField: {
            inputProps: { 'data-testid': dataTestId.registrationWizard.description.datePublishedField },
            variant: 'filled',
            required: true,
            onBlur: () => !touchedYear && setFieldTouched(DescriptionFieldNames.PublicationYear),
            error: hasError,
            helperText: hasError && errorYear,
          },
        }}
      />
      <FormControlLabel
        sx={{ alignSelf: 'start', mt: '0.4rem', width: 'fit-content' }} // Center field regardless of error state of published date field
        control={
          <Checkbox
            checked={yearOnly}
            onChange={() => {
              const nextYearOnlyValue = !yearOnly;
              updateDateValues(date, nextYearOnlyValue);
              setYearOnly(nextYearOnlyValue);
            }}
          />
        }
        label={<Typography>{t('registration.description.year_only')}</Typography>}
      />
    </>
  );
};
