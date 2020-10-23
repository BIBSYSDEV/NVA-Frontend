import { Field, FormikProps, useFormikContext, FieldProps, ErrorMessage } from 'formik';
import React, { FC, useEffect, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import DateFnsUtils from '@date-io/date-fns';
import { MenuItem, TextField as MuiTextField, TextField, Typography } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Registration } from '../../types/registration.types';
import DisciplineSearch from './description_tab/DisciplineSearch';
import DatePickerField from './description_tab/DatePickerField';
import { registrationLanguages } from '../../types/language.types';
import Card from '../../components/Card';
import { DescriptionFieldNames } from '../../types/publicationFieldNames';
import { touchedDescriptionTabFields } from '../../utils/formik-helpers';
import { PanelProps } from './RegistrationFormContent';
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

const StyledMainCard = styled(Card)`
  display: grid;
  gap: 1rem;
`;

const DescriptionPanel: FC<PanelProps> = ({ setTouchedFields }) => {
  const { t } = useTranslation('registration');
  const { setFieldValue }: FormikProps<Registration> = useFormikContext();

  useEffect(
    // Set all fields as touched if user navigates away from this panel (on unmount)
    () => () => setTouchedFields(touchedDescriptionTabFields),
    [setTouchedFields]
  );

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <StyledMainCard>
        <Typography variant="h2">{t('heading.description')}</Typography>
        <Field name={DescriptionFieldNames.TITLE}>
          {({ field, meta: { touched, error } }: FieldProps) => (
            <TextField
              {...field}
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
          {({ field }: FieldProps) => (
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
          {({ field }: FieldProps) => (
            <TextField
              {...field}
              data-testid="registration-description-field"
              inputProps={{ 'data-testid': 'registration-description-input' }}
              label={t('description.description')}
              multiline
              rows="4"
              fullWidth
              variant="outlined"
            />
          )}
        </Field>
        <NpiAndTagsWrapper>
          <Field name={DescriptionFieldNames.NPI_SUBJECT_HEADING}>
            {({ field: { name, value } }: FieldProps) => (
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
                onChange={(_: ChangeEvent<{}>, value: string[] | string) => setFieldValue(field.name, value)}
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    data-testid="registration-tag-field"
                    label={t('description.keywords')}
                    helperText={t('description.keywords_helper')}
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            )}
          </Field>
        </NpiAndTagsWrapper>

        <DateAndLanguageWrapper>
          <DatePickerField
            data-testid="registration-date-field"
            yearFieldName={DescriptionFieldNames.PUBLICATION_YEAR}
            monthFieldName={DescriptionFieldNames.PUBLICATION_MONTH}
            dayFieldName={DescriptionFieldNames.PUBLICATION_DAY}
          />

          <Field name={DescriptionFieldNames.LANGUAGE}>
            {({ field }: FieldProps) => (
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
      </StyledMainCard>
      <Card>
        <Typography variant="h5">{t('description.project_association')}</Typography>
        <ProjectsField />
      </Card>
    </MuiPickersUtilsProvider>
  );
};

export default DescriptionPanel;
