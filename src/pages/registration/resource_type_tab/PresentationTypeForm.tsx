import { LocalizationProvider, DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { TextField, ThemeProvider } from '@mui/material';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { BackgroundDiv } from '../../../components/BackgroundDiv';
import { StyledSelectWrapper } from '../../../components/styled/Wrappers';
import { datePickerTranslationProps, lightTheme } from '../../../themes/lightTheme';
import i18n from '../../../translations/i18n';
import { PresentationType, ResourceFieldNames } from '../../../types/publicationFieldNames';
import { PresentationRegistration } from '../../../types/publication_types/presentationRegistration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getDateFnsLocale } from '../../../utils/date-helpers';
import { SelectTypeField } from './components/SelectTypeField';

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

interface PresentationTypeFormProps {
  onChangeSubType: (type: string) => void;
}

export const PresentationTypeForm = ({ onChangeSubType }: PresentationTypeFormProps) => {
  const { t } = useTranslation('registration');
  const { values, setFieldValue, setFieldTouched } = useFormikContext<PresentationRegistration>();
  const { reference } = values.entityDescription;
  const subType = reference.publicationInstance.type;

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
          <Field name={'TODO'}>
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
          <Field name={ResourceFieldNames.PublicationContextPlaceCountry}>
            {({ field, meta: { error, touched } }: FieldProps<string>) => (
              <TextField
                {...field}
                id={field.name}
                value={field.value ?? ''}
                required
                data-testid={dataTestId.registrationWizard.resourceType.eventCountryield}
                variant="filled"
                fullWidth
                label={t('common:country')}
                error={touched && !!error}
                helperText={<ErrorMessage name={field.name} />}
              />
            )}
          </Field>

          <LocalizationProvider dateAdapter={AdapterDateFns} locale={getDateFnsLocale(i18n.language)}>
            <ThemeProvider theme={lightTheme}>
              <StyledDatePickersContainer>
                <Field name={ResourceFieldNames.PubliactionContextTimeFrom}>
                  {({ field, meta: { error, touched } }: FieldProps<string>) => (
                    <DatePicker
                      {...datePickerTranslationProps}
                      label={t('resource_type.date_from')}
                      value={field.value ?? null}
                      onChange={(date) => setFieldValue(field.name, date?.toISOString())}
                      inputFormat="dd.MM.yyyy"
                      views={['year', 'month', 'day']}
                      maxDate={new Date(new Date().getFullYear() + 5, 11, 31)}
                      mask="__.__.____"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          data-testid={dataTestId.registrationWizard.description.datePublishedField}
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
                <Field name={ResourceFieldNames.PubliactionContextTimeTo}>
                  {({ field, meta: { error, touched } }: FieldProps<string>) => (
                    <DatePicker
                      {...datePickerTranslationProps}
                      label={t('resource_type.date_to')}
                      value={field.value ?? null}
                      onChange={(date) => setFieldValue(field.name, date?.toISOString())}
                      inputFormat="dd.MM.yyyy"
                      views={['year', 'month', 'day']}
                      maxDate={new Date(new Date().getFullYear() + 5, 11, 31)}
                      mask="__.__.____"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          data-testid={dataTestId.registrationWizard.description.datePublishedField}
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
            </ThemeProvider>
          </LocalizationProvider>
        </BackgroundDiv>
      )}
    </>
  );
};
