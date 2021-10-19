import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { MenuItem, ThemeProvider, TextField, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { BackgroundDiv } from '../../components/BackgroundDiv';
import { lightTheme } from '../../themes/lightTheme';
import { LanguageCodes, registrationLanguages } from '../../types/language.types';
import { DescriptionFieldNames } from '../../types/publicationFieldNames';
import { Registration } from '../../types/registration.types';
import { DatePickerField } from './description_tab/DatePickerField';
import { ProjectsField } from './description_tab/projects_field/ProjectsField';
import { VocabularyBase } from './description_tab/vocabularies/VocabularyBase';

const DateAndLanguageWrapper = styled.div`
  display: grid;
  grid-template-areas: 'datepicker year-only language';
  grid-template-columns: 1fr 1fr 2fr;
  column-gap: 1rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-areas: 'datepicker' 'year-only' 'language';
    grid-template-columns: 1fr;
  }
`;

export const DescriptionPanel = () => {
  const { t } = useTranslation('registration');
  const { setFieldValue } = useFormikContext<Registration>();

  return (
    <>
      <BackgroundDiv backgroundColor={lightTheme.palette.section.megaLight}>
        <Field name={DescriptionFieldNames.Title}>
          {({ field, meta: { touched, error } }: FieldProps<string>) => (
            <TextField
              {...field}
              id={field.name}
              value={field.value ?? ''}
              required
              data-testid="registration-title-field"
              variant="filled"
              fullWidth
              label={t('common:title')}
              error={touched && !!error}
              helperText={<ErrorMessage name={field.name} />}
            />
          )}
        </Field>
        <Field name={DescriptionFieldNames.Abstract}>
          {({ field }: FieldProps<string>) => (
            <TextField
              {...field}
              id={field.name}
              value={field.value ?? ''}
              data-testid="registration-abstract-field"
              variant="filled"
              fullWidth
              multiline
              rows="4"
              label={t('description.abstract')}
            />
          )}
        </Field>
        <Field name={DescriptionFieldNames.Description}>
          {({ field }: FieldProps<string>) => (
            <TextField
              {...field}
              id={field.name}
              value={field.value ?? ''}
              data-testid="registration-description-field"
              label={t('description.description_of_content')}
              multiline
              rows="4"
              fullWidth
              variant="filled"
            />
          )}
        </Field>
      </BackgroundDiv>
      <BackgroundDiv backgroundColor={lightTheme.palette.section.light}>
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
                  data-testid="registration-tag-field"
                  label={t('description.keywords')}
                  helperText={t('description.keywords_helper')}
                  variant="filled"
                  fullWidth
                />
              )}
            />
          )}
        </Field>
        <VocabularyBase />
      </BackgroundDiv>
      <BackgroundDiv backgroundColor={lightTheme.palette.section.main}>
        <DateAndLanguageWrapper>
          <DatePickerField />

          <Field name={DescriptionFieldNames.Language}>
            {({ field }: FieldProps<string>) => (
              <TextField
                {...field}
                id={field.name}
                value={field.value ?? ''}
                data-testid="registration-language-field"
                fullWidth
                label={t('description.primary_language')}
                placeholder={t('description.primary_language')}
                select
                variant="filled">
                {!registrationLanguages.some((registrationLanguage) => registrationLanguage.value === field.value) && (
                  // Show if Registration has a language that's currently not supported
                  <MenuItem value={field.value} disabled>
                    {t(`languages:${LanguageCodes.Undefined}`)}
                  </MenuItem>
                )}
                {registrationLanguages.map(({ id, value }) => (
                  <MenuItem value={value} key={id} data-testid={`registration-language-${id}`}>
                    {t(`languages:${id}`)}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Field>
        </DateAndLanguageWrapper>
      </BackgroundDiv>
      <BackgroundDiv backgroundColor={lightTheme.palette.section.dark}>
        <Typography variant="h5" color="primary" component="p">
          {t('description.connect_project')}
        </Typography>
        <ThemeProvider theme={lightTheme}>
          <ProjectsField />
        </ThemeProvider>
      </BackgroundDiv>
    </>
  );
};
