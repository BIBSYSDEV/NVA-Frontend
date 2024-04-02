import { Autocomplete, Box, TextField } from '@mui/material';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import countries from 'i18n-iso-countries';
import enCountries from 'i18n-iso-countries/langs/en.json';
import nbCountries from 'i18n-iso-countries/langs/nb.json';
import { useTranslation } from 'react-i18next';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { PresentationRegistration } from '../../../../types/publication_types/presentationRegistration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { getPreferredLanguageCode } from '../../../../utils/translation-helpers';
import { PeriodFields } from '../components/PeriodFields';

countries.registerLocale(enCountries);
countries.registerLocale(nbCountries);

export const PresentationForm = () => {
  const { t, i18n } = useTranslation();
  const { setFieldValue } = useFormikContext<PresentationRegistration>();

  const countryOptions = Object.entries(countries.getNames(getPreferredLanguageCode(i18n.language))).map(
    ([code, label]) => ({ code, label })
  );

  return (
    <>
      <Field name={ResourceFieldNames.PublicationContextLabel}>
        {({ field, meta: { error, touched } }: FieldProps<string>) => (
          <TextField
            {...field}
            id={field.name}
            value={field.value ?? ''}
            required
            data-testid={dataTestId.registrationWizard.resourceType.eventTitleField}
            variant="filled"
            fullWidth
            label={t('registration.resource_type.title_of_event')}
            error={touched && !!error}
            helperText={<ErrorMessage name={field.name} />}
          />
        )}
      </Field>
      <Field name={ResourceFieldNames.PublicationContextAgentName}>
        {({ field, meta: { error, touched } }: FieldProps<string>) => (
          <TextField
            {...field}
            id={field.name}
            value={field.value ?? ''}
            required
            data-testid={dataTestId.registrationWizard.resourceType.eventOrganizerField}
            variant="filled"
            fullWidth
            label={t('registration.resource_type.organizer')}
            error={touched && !!error}
            helperText={<ErrorMessage name={field.name} />}
          />
        )}
      </Field>

      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <PeriodFields
          fromFieldName={ResourceFieldNames.PublicationContextTimeFrom}
          toFieldName={ResourceFieldNames.PublicationContextTimeTo}
        />
      </Box>

      <Field name={ResourceFieldNames.PublicationContextPlaceLabel}>
        {({ field, meta: { error, touched } }: FieldProps<string>) => (
          <TextField
            {...field}
            id={field.name}
            value={field.value ?? ''}
            data-testid={dataTestId.registrationWizard.resourceType.placeField}
            variant="filled"
            fullWidth
            label={t('registration.resource_type.place_for_event')}
            error={touched && !!error}
            helperText={<ErrorMessage name={field.name} />}
          />
        )}
      </Field>

      <Field name={ResourceFieldNames.PublicationContextPlaceCountry}>
        {({ field, meta: { error, touched } }: FieldProps<string>) => (
          <Autocomplete
            id={field.name}
            aria-labelledby={`${field.name}-label`}
            value={countryOptions.find((option) => option.code === field.value) ?? null}
            options={countryOptions}
            autoSelect
            onChange={(_, value) => setFieldValue(field.name, value?.code)}
            isOptionEqualToValue={(option, value) => option.code === value.code}
            getOptionLabel={(option) => option.label}
            renderOption={(props, option) => (
              <li {...props}>
                <Box
                  component="img"
                  sx={{ mr: '1rem' }}
                  loading="lazy"
                  src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                  alt={option.code}
                />
                {option.label} ({option.code})
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                data-testid={dataTestId.registrationWizard.resourceType.eventCountryField}
                label={t('common.country')}
                variant="filled"
                fullWidth
                error={touched && !!error}
                helperText={<ErrorMessage name={field.name} />}
              />
            )}
          />
        )}
      </Field>
    </>
  );
};
