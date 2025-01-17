import { Autocomplete, Box, TextField } from '@mui/material';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { PresentationRegistration } from '../../../../types/publication_types/presentationRegistration.types';
import { getCountries } from '../../../../utils/countryHelpers';
import { dataTestId } from '../../../../utils/dataTestIds';
import { PeriodFields } from '../components/PeriodFields';

export const PresentationForm = () => {
  const { t, i18n } = useTranslation();
  const { setFieldValue } = useFormikContext<PresentationRegistration>();

  const countryOptions = Object.entries(getCountries(i18n.language)).map(([code, label]) => ({ code, label }));

  return (
    <>
      <Field name={ResourceFieldNames.PublicationContextName}>
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

      <Field name={ResourceFieldNames.PublicationContextPlaceName}>
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
            renderOption={({ key, ...props }, option) => (
              <li {...props} key={option.code}>
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
