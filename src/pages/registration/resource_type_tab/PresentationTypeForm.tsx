import { LocalizationProvider, DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Autocomplete, TextField, ThemeProvider } from '@mui/material';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { BackgroundDiv } from '../../../components/BackgroundDiv';
import { StyledSelectWrapper } from '../../../components/styled/Wrappers';
import { datePickerTranslationProps, lightTheme } from '../../../themes/lightTheme';
import { PresentationType, ResourceFieldNames } from '../../../types/publicationFieldNames';
import { PresentationRegistration } from '../../../types/publication_types/presentationRegistration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getDateFnsLocale } from '../../../utils/date-helpers';
import { SelectTypeField } from './components/SelectTypeField';
import countries from 'i18n-iso-countries';
import enCountries from 'i18n-iso-countries/langs/en.json';
import nbCountries from 'i18n-iso-countries/langs/nb.json';
import { getPreferredLanguageCode } from '../../../utils/translation-helpers';
countries.registerLocale(enCountries);
countries.registerLocale(nbCountries);

const StyledDatePickersContainer = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    display: flex;
    flex-direction: column;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    div:first-child {
      margin-right: 10rem;
    }
  }
`;

const StyledFlagImg = styled.img`
  margin-right: 1rem;
`;

interface PresentationTypeFormProps {
  onChangeSubType: (type: string) => void;
}

export const PresentationTypeForm = ({ onChangeSubType }: PresentationTypeFormProps) => {
  const { t, i18n } = useTranslation('registration');
  const { values, setFieldValue, setFieldTouched } = useFormikContext<PresentationRegistration>();
  const subType = values.entityDescription.reference.publicationInstance.type;

  const countryOptions = Object.entries(countries.getNames(getPreferredLanguageCode(i18n.language))).map(
    ([code, label]) => ({ code, label })
  );

  const onChangeDate = (fieldName: string, date: Date | null, keyboardInput?: string) => {
    const isValidDate = date && date && !isNaN(date.getTime());
    const isValidInput = keyboardInput?.length === 10;
    if (isValidDate) {
      setFieldValue(fieldName, date.toISOString());
    } else if (!isValidDate || !isValidInput) {
      setFieldValue(fieldName, '');
    }
  };

  return (
    <>
      <BackgroundDiv backgroundColor={lightTheme.palette.section.light}>
        <StyledSelectWrapper>
          <SelectTypeField
            fieldName={ResourceFieldNames.SubType}
            onChangeType={onChangeSubType}
            options={Object.values(PresentationType)}
          />
        </StyledSelectWrapper>
      </BackgroundDiv>

      {subType && (
        <BackgroundDiv backgroundColor={lightTheme.palette.section.main}>
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
                label={t('resource_type.title_of_event')}
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
                label={t('resource_type.organizer')}
                error={touched && !!error}
                helperText={<ErrorMessage name={field.name} />}
              />
            )}
          </Field>
          <Field name={ResourceFieldNames.PublicationContextPlaceLabel}>
            {({ field, meta: { error, touched } }: FieldProps<string>) => (
              <TextField
                {...field}
                id={field.name}
                value={field.value ?? ''}
                required
                data-testid={dataTestId.registrationWizard.resourceType.eventPlaceField}
                variant="filled"
                fullWidth
                label={t('resource_type.place_for_event')}
                error={touched && !!error}
                helperText={<ErrorMessage name={field.name} />}
              />
            )}
          </Field>

          <ThemeProvider theme={lightTheme}>
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
                      <StyledFlagImg
                        loading="lazy"
                        src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                        srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                        alt={option.code}
                      />
                      {option.label} ({option.code})
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      data-testid={dataTestId.registrationWizard.resourceType.eventCountryField}
                      label={t('common:country')}
                      variant="filled"
                      fullWidth
                      error={touched && !!error}
                      helperText={<ErrorMessage name={field.name} />}
                    />
                  )}
                />
              )}
            </Field>

            <LocalizationProvider dateAdapter={AdapterDateFns} locale={getDateFnsLocale(i18n.language)}>
              <StyledDatePickersContainer>
                <Field name={ResourceFieldNames.PublicationContextTimeFrom}>
                  {({ field, meta: { error, touched } }: FieldProps<string>) => (
                    <DatePicker
                      {...datePickerTranslationProps}
                      label={t('resource_type.date_from')}
                      value={field.value ?? null}
                      onChange={(date, keyboardInput) => {
                        !touched && setFieldTouched(field.name, true, false);
                        onChangeDate(field.name, date, keyboardInput);
                      }}
                      inputFormat="dd.MM.yyyy"
                      views={['year', 'month', 'day']}
                      maxDate={new Date(new Date().getFullYear() + 5, 11, 31)}
                      mask="__.__.____"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          data-testid={dataTestId.registrationWizard.resourceType.eventDateFrom}
                          variant="filled"
                          required
                          onBlur={() => !touched && setFieldTouched(field.name)}
                          error={touched && !!error}
                          helperText={touched && error}
                        />
                      )}
                    />
                  )}
                </Field>
                <Field name={ResourceFieldNames.PublicationContextTimeTo}>
                  {({ field, meta: { error, touched } }: FieldProps<string>) => (
                    <DatePicker
                      {...datePickerTranslationProps}
                      label={t('resource_type.date_to')}
                      value={field.value ?? null}
                      onChange={(date, keyboardInput) => {
                        !touched && setFieldTouched(field.name, true, false);
                        onChangeDate(field.name, date, keyboardInput);
                      }}
                      inputFormat="dd.MM.yyyy"
                      views={['year', 'month', 'day']}
                      maxDate={new Date(new Date().getFullYear() + 5, 11, 31)}
                      mask="__.__.____"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          data-testid={dataTestId.registrationWizard.resourceType.eventDateTo}
                          variant="filled"
                          required
                          onBlur={() => !touched && setFieldTouched(field.name)}
                          error={touched && !!error}
                          helperText={touched && error}
                        />
                      )}
                    />
                  )}
                </Field>
              </StyledDatePickersContainer>
            </LocalizationProvider>
          </ThemeProvider>
        </BackgroundDiv>
      )}
    </>
  );
};
