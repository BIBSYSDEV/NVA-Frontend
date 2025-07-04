import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ErrorIcon from '@mui/icons-material/Error';
import { Autocomplete, Box, Button, CircularProgress, Divider, MenuItem, TextField } from '@mui/material';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { getLanguageByIso6393Code } from 'nva-language';
import { ChangeEvent, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useDuplicateRegistrationSearch } from '../../api/hooks/useDuplicateRegistrationSearch';
import { InputContainerBox } from '../../components/styled/Wrappers';
import { RegistrationFormContext } from '../../context/RegistrationFormContext';
import { DescriptionFieldNames } from '../../types/publicationFieldNames';
import { Registration } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import { useDebounce } from '../../utils/hooks/useDebounce';
import { registrationLanguageOptions, registrationsHaveSamePublicationYear } from '../../utils/registration-helpers';
import { getRegistrationLandingPagePath } from '../../utils/urlPaths';
import { DatePickerField } from './description_tab/DatePickerField';
import { ProjectsField } from './description_tab/projects_field/ProjectsField';
import { RegistrationFunding } from './description_tab/RegistrationFunding';
import { VocabularyBase } from './description_tab/vocabularies/VocabularyBase';
import { DuplicateWarning } from './DuplicateWarning';

export const DescriptionPanel = () => {
  const { t, i18n } = useTranslation();
  const { values, setFieldValue } = useFormikContext<Registration>();
  const debouncedTitle = useDebounce(values.entityDescription?.mainTitle ?? '');

  const { titleSearchPending, duplicateRegistration } = useDuplicateRegistrationSearch({
    title: debouncedTitle,
    identifier: values.identifier,
  });

  const { disableChannelClaimsFields } = useContext(RegistrationFormContext);

  return (
    <InputContainerBox>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          alignItems: 'start',
        }}>
        <Field name={DescriptionFieldNames.Title}>
          {({ field, meta: { touched, error } }: FieldProps<string>) => (
            <TextField
              {...field}
              disabled={disableChannelClaimsFields}
              value={field.value ?? ''}
              required
              data-testid={dataTestId.registrationWizard.description.titleField}
              variant="filled"
              fullWidth
              label={t('common.title')}
              error={touched && !!error}
              helperText={<ErrorMessage name={field.name} />}
              slotProps={{
                input: {
                  endAdornment: titleSearchPending ? (
                    <CircularProgress size={20} />
                  ) : duplicateRegistration ? (
                    <ErrorIcon color="warning" />
                  ) : undefined,
                },
              }}
            />
          )}
        </Field>
        {duplicateRegistration && (
          <DuplicateWarning
            name={duplicateRegistration.mainTitle}
            linkTo={getRegistrationLandingPagePath(duplicateRegistration.identifier)}
            warning={t('registration.description.duplicate_title_warning')}
          />
        )}
        <Field name={DescriptionFieldNames.AlternativeTitles}>
          {({ field }: FieldProps<string>) => (
            <>
              {field.value !== undefined ? (
                <TextField
                  {...field}
                  disabled={disableChannelClaimsFields}
                  value={field.value ?? ''}
                  data-testid={dataTestId.registrationWizard.description.alternativeTitleField}
                  variant="filled"
                  fullWidth
                  label={t('registration.description.alternative_title')}
                />
              ) : null}
              {field.value || field.value === '' ? null : (
                <Button
                  startIcon={<AddCircleOutlineIcon />}
                  disabled={!values.entityDescription?.mainTitle || disableChannelClaimsFields}
                  onClick={() => setFieldValue(field.name, '')}>
                  {t('common.add_custom', {
                    name: t('registration.description.alternative_title').toLocaleLowerCase(),
                  })}
                </Button>
              )}
            </>
          )}
        </Field>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          alignItems: 'start',
        }}>
        <Field name={DescriptionFieldNames.Abstract}>
          {({ field }: FieldProps<string>) => (
            <TextField
              {...field}
              disabled={disableChannelClaimsFields}
              value={field.value ?? ''}
              data-testid={dataTestId.registrationWizard.description.abstractField}
              variant="filled"
              fullWidth
              multiline
              label={t('registration.description.abstract')}
            />
          )}
        </Field>
        <Field name={DescriptionFieldNames.AlternativeAbstracts}>
          {({ field }: FieldProps<string>) => (
            <>
              {field.value !== undefined ? (
                <TextField
                  {...field}
                  disabled={disableChannelClaimsFields}
                  value={field.value ?? ''}
                  data-testid={dataTestId.registrationWizard.description.alternativeAbstractField}
                  variant="filled"
                  fullWidth
                  multiline
                  label={t('registration.description.alternative_abstract')}
                />
              ) : null}

              {field.value || field.value === '' ? null : (
                <Button
                  startIcon={<AddCircleOutlineIcon />}
                  disabled={!values.entityDescription?.abstract || disableChannelClaimsFields}
                  onClick={() => setFieldValue(field.name, '')}>
                  {t('common.add_custom', {
                    name: t('registration.description.alternative_abstract').toLocaleLowerCase(),
                  })}
                </Button>
              )}
            </>
          )}
        </Field>
      </Box>
      <Field name={DescriptionFieldNames.Description}>
        {({ field }: FieldProps<string>) => (
          <TextField
            {...field}
            disabled={disableChannelClaimsFields}
            value={field.value ?? ''}
            data-testid={dataTestId.registrationWizard.description.descriptionField}
            label={t('registration.description.description_of_content')}
            multiline
            fullWidth
            variant="filled"
          />
        )}
      </Field>
      <Field name={DescriptionFieldNames.Tags}>
        {({ field }: FieldProps) => (
          <Autocomplete
            {...field}
            disabled={disableChannelClaimsFields}
            value={field.value ?? []}
            freeSolo
            multiple
            options={[]}
            autoSelect
            onChange={(_: ChangeEvent<unknown>, value: string[]) => {
              const newValues = value
                .map((item) => item.split(','))
                .flat()
                .map((item) => item.trim())
                .filter((item) => item);
              const uniqueValues = [...new Set(newValues)];
              setFieldValue(field.name, uniqueValues);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                data-testid={dataTestId.registrationWizard.description.tagField}
                label={t('registration.description.keywords')}
                helperText={t('registration.description.keywords_helper')}
                variant="filled"
                fullWidth
              />
            )}
          />
        )}
      </Field>
      <VocabularyBase />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr auto', md: '1fr 1fr 2fr' },
          gap: '1rem',
        }}>
        <DatePickerField />

        <Field name={DescriptionFieldNames.Language}>
          {({ field }: FieldProps<string>) => (
            <TextField
              {...field}
              disabled={disableChannelClaimsFields}
              value={field.value ?? ''}
              data-testid={dataTestId.registrationWizard.description.languageField}
              fullWidth
              label={t('registration.description.primary_language')}
              placeholder={t('registration.description.primary_language')}
              select
              variant="filled">
              {!registrationLanguageOptions.some((language) => language.uri === field.value) && (
                // Show if Registration has a language that's currently not supported
                <MenuItem value={field.value} disabled>
                  {i18n.language === 'nob' ? getLanguageByIso6393Code('und').nob : getLanguageByIso6393Code('und').eng}
                </MenuItem>
              )}
              {registrationLanguageOptions.map(({ uri, nob, eng }) => (
                <MenuItem value={uri} key={uri} data-testid={`registration-language-${uri}`}>
                  {i18n.language === 'nob' ? nob : eng}
                </MenuItem>
              ))}
            </TextField>
          )}
        </Field>
      </Box>
      {duplicateRegistration && registrationsHaveSamePublicationYear(values, duplicateRegistration) && (
        <DuplicateWarning
          name={duplicateRegistration.mainTitle}
          linkTo={getRegistrationLandingPagePath(duplicateRegistration.identifier)}
          warning={t('registration.description.duplicate_publication_date_warning')}
        />
      )}
      <ProjectsField />
      <Divider />
      <RegistrationFunding currentFundings={values.fundings} />
    </InputContainerBox>
  );
};
