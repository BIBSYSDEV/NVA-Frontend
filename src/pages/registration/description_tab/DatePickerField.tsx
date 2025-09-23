import { Checkbox, FormControlLabel } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { FormikErrors, FormikTouched, useFormikContext } from 'formik';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyledInfoBanner } from '../../../components/styled/Wrappers';
import { RegistrationFormContext } from '../../../context/RegistrationFormContext';
import { DescriptionFieldNames, ResourceFieldNames } from '../../../types/publicationFieldNames';
import { EntityDescription, Registration, RegistrationDate } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getRegistrationDate } from '../../../utils/date-helpers';
import { LockedNviFieldDescription } from '../LockedNviFieldDescription';

const replaceYearInId = (id: string, newYear: string) => {
  return id.replace(/\d{4}$/, newYear);
};

export const DatePickerField = () => {
  const { t } = useTranslation();
  const {
    values: { entityDescription },
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
  } = useFormikContext<Registration>();

  const dateData = entityDescription?.publicationDate;

  const [date, setDate] = useState(getRegistrationDate(dateData));
  const [yearOnly, setYearOnly] = useState(!!dateData?.year && !dateData?.month);

  const { disableNviCriticalFields, disableChannelClaimsFields } = useContext(RegistrationFormContext);
  const disabled = disableNviCriticalFields || disableChannelClaimsFields;

  const syncChannelIdsWithYear = (newYear: string) => {
    const publicationContext = entityDescription?.reference?.publicationContext;
    if (!publicationContext) {
      return;
    }

    const journalId = 'id' in publicationContext ? publicationContext.id : null;
    if (journalId && !journalId.endsWith(newYear)) {
      const updatedJournalId = replaceYearInId(journalId, newYear);
      setFieldValue(ResourceFieldNames.PublicationContextId, updatedJournalId);
    }

    const publisherId = 'publisher' in publicationContext ? publicationContext.publisher?.id : null;
    if (publisherId && !publisherId.endsWith(newYear)) {
      const updatedPublisherId = replaceYearInId(publisherId, newYear);
      setFieldValue(ResourceFieldNames.PublicationContextPublisherId, updatedPublisherId);
    }

    const seriesId = 'series' in publicationContext ? publicationContext.series?.id : null;
    if (seriesId && !seriesId.endsWith(newYear)) {
      const updatedSeriesId = replaceYearInId(seriesId, newYear);
      setFieldValue(ResourceFieldNames.SeriesId, updatedSeriesId);
    }
  };

  const updateDateValues = (newDate: Date | null, isYearOnly: boolean) => {
    const updatedDate: RegistrationDate = {
      type: 'PublicationDate',
      year: newDate ? newDate.getFullYear().toString() : '',
      month: !isYearOnly && newDate ? (newDate.getMonth() + 1).toString() : '',
      day: !isYearOnly && newDate ? newDate.getDate().toString() : '',
    };

    const yearIsChanged = updatedDate.year !== dateData?.year;
    if (yearIsChanged) {
      syncChannelIdsWithYear(updatedDate.year);
    }

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
      {disableNviCriticalFields && (
        <StyledInfoBanner sx={{ gridColumn: '1/3' }}>
          <LockedNviFieldDescription fieldLabel={t('registration.description.date_published')} />
        </StyledInfoBanner>
      )}

      <DatePicker
        label={t('registration.description.date_published')}
        value={date}
        onChange={(newDate) => {
          updateDateValues(newDate, yearOnly);
          setDate(newDate);
        }}
        sx={{ gridColumn: '1/2' }}
        disabled={disabled}
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
        disabled={disabled}
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
        label={t('registration.description.year_only')}
      />
    </>
  );
};
