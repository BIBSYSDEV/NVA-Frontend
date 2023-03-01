import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { ChangeEvent, ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MenuItem, TextField, Autocomplete, Box, Divider, List, Button, ListItem } from '@mui/material';
import { getLanguageByIso6393Code } from 'nva-language';
import { DescriptionFieldNames } from '../../types/publicationFieldNames';
import { Registration } from '../../types/registration.types';
import { DatePickerField } from './description_tab/DatePickerField';
import { ProjectsField } from './description_tab/projects_field/ProjectsField';
import { VocabularyBase } from './description_tab/vocabularies/VocabularyBase';
import { InputContainerBox } from '../../components/styled/Wrappers';
import { dataTestId } from '../../utils/dataTestIds';
import { FundingsField } from './description_tab/FundingsField';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const languageOptions = [
  getLanguageByIso6393Code('eng'),
  getLanguageByIso6393Code('nob'),
  getLanguageByIso6393Code('nno'),
  getLanguageByIso6393Code('dan'),
  getLanguageByIso6393Code('fin'),
  getLanguageByIso6393Code('fra'),
  getLanguageByIso6393Code('isl'),
  getLanguageByIso6393Code('ita'),
  getLanguageByIso6393Code('nld'),
  getLanguageByIso6393Code('por'),
  getLanguageByIso6393Code('rus'),
  getLanguageByIso6393Code('sme'),
  getLanguageByIso6393Code('spa'),
  getLanguageByIso6393Code('swe'),
  getLanguageByIso6393Code('deu'),
  getLanguageByIso6393Code('mis'),
];

export const DescriptionPanel = () => {
  const { t, i18n } = useTranslation();
  const { setFieldValue, values } = useFormikContext<Registration>();

  const hasAlternativeTitle = Object.keys(values.entityDescription?.alternativeTitles ?? {}).length > 0;

  return (
    <InputContainerBox>
      <Field name={DescriptionFieldNames.Title}>
        {({ field, meta: { touched, error } }: FieldProps<string>) => (
          <>
            <Box sx={{ display: 'flex', gap: '1rem' }}>
              <TextField
                {...field}
                id={field.name}
                value={field.value ?? ''}
                required
                data-testid={dataTestId.registrationWizard.description.titleField}
                variant="filled"
                fullWidth
                label={t('common.title')}
                error={touched && !!error}
                helperText={<ErrorMessage name={field.name} />}
              />
              <Button
                sx={{ whiteSpace: 'nowrap' }}
                startIcon={<AddCircleOutlineIcon />}
                disabled={hasAlternativeTitle}
                onClick={() => {
                  setFieldValue(DescriptionFieldNames.AlternativeTitles, { und: '' });
                }}>
                {t('common.add')}
              </Button>
            </Box>
          </>
        )}
      </Field>
      <Field name={`${DescriptionFieldNames.AlternativeTitles}.und`}>
        {({ field }: FieldProps<string>) =>
          field.value !== undefined ? (
            <TextField
              {...field}
              id={field.name}
              value={field.value ?? ''}
              data-testid={dataTestId.registrationWizard.description.alternativeTitleField}
              variant="filled"
              fullWidth
              label={t('registration.description.alternative_title')}
            />
          ) : null
        }
      </Field>
      <Field name={DescriptionFieldNames.Abstract}>
        {({ field }: FieldProps<string>) => (
          <TextField
            {...field}
            id={field.name}
            value={field.value ?? ''}
            data-testid={dataTestId.registrationWizard.description.abstractField}
            variant="filled"
            fullWidth
            multiline
            rows="4"
            label={t('registration.description.abstract')}
          />
        )}
      </Field>
      <Field name={DescriptionFieldNames.Description}>
        {({ field }: FieldProps<string>) => (
          <TextField
            {...field}
            id={field.name}
            value={field.value ?? ''}
            data-testid={dataTestId.registrationWizard.description.descriptionField}
            label={t('registration.description.description_of_content')}
            multiline
            rows="4"
            fullWidth
            variant="filled"
          />
        )}
      </Field>

      <Field name={DescriptionFieldNames.Tags}>
        {({ field }: FieldProps) => (
          <Autocomplete
            {...field}
            id={field.name}
            aria-labelledby={`${field.name}-label`}
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
              id={field.name}
              value={field.value ?? ''}
              data-testid={dataTestId.registrationWizard.description.languageField}
              fullWidth
              label={t('registration.description.primary_language')}
              placeholder={t('registration.description.primary_language')}
              select
              variant="filled">
              {!languageOptions.some((language) => language.uri === field.value) && (
                // Show if Registration has a language that's currently not supported
                <MenuItem value={field.value} disabled>
                  {i18n.language === 'nob' ? getLanguageByIso6393Code('und').nob : getLanguageByIso6393Code('und').eng}
                </MenuItem>
              )}
              {languageOptions.map(({ uri, nob, eng }) => (
                <MenuItem value={uri} key={uri} data-testid={`registration-language-${uri}`}>
                  {i18n.language === 'nob' ? nob : eng}
                </MenuItem>
              ))}
            </TextField>
          )}
        </Field>
      </Box>

      <ProjectsField />
      <Divider />
      <FundingsField />
    </InputContainerBox>
  );
};
