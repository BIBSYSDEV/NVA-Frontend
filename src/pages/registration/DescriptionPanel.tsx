import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { MenuItem, TextField, Typography } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import BackgroundDiv from '../../components/BackgroundDiv';
import theme from '../../themes/mainTheme';
import { registrationLanguages } from '../../types/language.types';
import { DescriptionFieldNames } from '../../types/publicationFieldNames';
import { Registration } from '../../types/registration.types';
import DatePickerField from './description_tab/DatePickerField';
import DisciplineSearch from './description_tab/DisciplineSearch';
import { ProjectsField } from './description_tab/projects_field';

const NpiAndTagsWrapper = styled.div`
  display: grid;
  grid-template-areas: 'npi tags';
  grid-template-columns: 1fr 1fr;
  column-gap: 1rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-areas: 'npi' 'tags';
    grid-template-columns: 1fr;
  }
`;

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

const DescriptionPanel = () => {
  const { t } = useTranslation('registration');
  const { setFieldValue } = useFormikContext<Registration>();

  return (
    <>
      <BackgroundDiv backgroundColor={theme.palette.sectionMega.light}>
        <Field name={DescriptionFieldNames.TITLE}>
          {({ field, meta: { touched, error } }: FieldProps<string>) => (
            <TextField
              {...field}
              required
              data-testid="registration-title-field"
              inputProps={{ 'data-testid': 'registration-title-input' }}
              variant="outlined"
              fullWidth
              label={t('common:title')}
              error={touched && !!error}
              helperText={<ErrorMessage name={field.name} />}
            />
          )}
        </Field>
        <Field name={DescriptionFieldNames.ABSTRACT}>
          {({ field }: FieldProps<string>) => (
            <TextField
              {...field}
              data-testid="registration-abstract-field"
              inputProps={{ 'data-testid': 'registration-abstract-input' }}
              variant="outlined"
              fullWidth
              multiline
              rows="4"
              label={t('description.abstract')}
            />
          )}
        </Field>
        <Field name={DescriptionFieldNames.DESCRIPTION}>
          {({ field }: FieldProps<string>) => (
            <TextField
              {...field}
              data-testid="registration-description-field"
              inputProps={{ 'data-testid': 'registration-description-input' }}
              label={t('description.description_of_content')}
              multiline
              rows="4"
              fullWidth
              variant="outlined"
            />
          )}
        </Field>
      </BackgroundDiv>
      <BackgroundDiv backgroundColor={theme.palette.section.light}>
        <NpiAndTagsWrapper>
          <Field name={DescriptionFieldNames.NPI_SUBJECT_HEADING}>
            {({ field: { name, value } }: FieldProps<string>) => (
              // TODO: when we have a service for getting npiDisciplines by id this must be updated (only id is stored in backend for now)
              <DisciplineSearch
                setValueFunction={(npiDiscipline) => setFieldValue(name, npiDiscipline?.id ?? '')}
                dataTestId="search_npi"
                value={value}
                placeholder={t('description.search_for_npi_discipline')}
              />
            )}
          </Field>
          <Field name={DescriptionFieldNames.TAGS}>
            {({ field }: FieldProps) => (
              <Autocomplete
                {...field}
                freeSolo
                multiple
                options={[]}
                onChange={(_: ChangeEvent<unknown>, value: string[] | string) => setFieldValue(field.name, value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    data-testid="registration-tag-field"
                    label={t('description.keywords')}
                    helperText={t('description.keywords_helper')}
                    variant="outlined"
                    fullWidth
                    onBlur={(event) => {
                      const value = event.target.value;
                      const tags = value
                        .split(/[|,;]+/)
                        .map((value: string) => value.trim())
                        .filter((tag) => tag !== '');
                      setFieldValue(field.name, [...field.value, ...tags]);
                    }}
                  />
                )}
              />
            )}
          </Field>
        </NpiAndTagsWrapper>
      </BackgroundDiv>
      <BackgroundDiv backgroundColor={theme.palette.section.main}>
        <DateAndLanguageWrapper>
          <DatePickerField />

          <Field name={DescriptionFieldNames.LANGUAGE}>
            {({ field }: FieldProps<string>) => (
              <TextField
                {...field}
                data-testid="registration-language-field"
                fullWidth
                label={t('description.primary_language')}
                placeholder={t('description.primary_language')}
                select
                variant="outlined">
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
      <BackgroundDiv backgroundColor={theme.palette.section.dark}>
        <Typography variant="h5" color="primary">
          {t('description.connect_project')}
        </Typography>
        <ProjectsField />
      </BackgroundDiv>
    </>
  );
};

export default DescriptionPanel;
