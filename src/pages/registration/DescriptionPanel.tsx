import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { MenuItem, TextField, Autocomplete, Box } from '@mui/material';
import { LanguageCodes, registrationLanguages } from '../../types/language.types';
import { DescriptionFieldNames } from '../../types/publicationFieldNames';
import { Registration } from '../../types/registration.types';
import { DatePickerField } from './description_tab/DatePickerField';
import { ProjectsField } from './description_tab/projects_field/ProjectsField';
import { VocabularyBase } from './description_tab/vocabularies/VocabularyBase';
import { InputContainerBox } from '../../components/styled/Wrappers';

export const DescriptionPanel = () => {
  const { t } = useTranslation('registration');
  const { setFieldValue } = useFormikContext<Registration>();

  return (
    <InputContainerBox>
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
      </Box>

      <ProjectsField />
    </InputContainerBox>
  );
};
