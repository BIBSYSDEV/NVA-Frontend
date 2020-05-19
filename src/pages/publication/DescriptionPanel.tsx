import { Field, FormikProps, useFormikContext, FieldProps, ErrorMessage } from 'formik';
import React, { FC, useEffect, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import DateFnsUtils from '@date-io/date-fns';
import { MenuItem, TextField as MuiTextField, TextField } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { FormikPublication } from '../../types/publication.types';
import DisciplineSearch from './description_tab/DisciplineSearch';
import ProjectSearch from './description_tab/ProjectSearch';
import ProjectRow from './description_tab/ProjectRow';
import DatePickerField from './description_tab/DatePickerField';
import { publicationLanguages } from '../../types/language.types';
import Heading from '../../components/Heading';
import Card from '../../components/Card';
import { DescriptionFieldNames } from '../../types/publicationFieldNames';
import { emptyProject } from '../../types/project.types';
import { touchedDescriptionTabFields } from '../../utils/formik-helpers';
import { PanelProps } from './PublicationFormContent';

const MultipleFieldWrapper = styled.div`
  display: flex;
`;

const StyledFieldWrapper = styled.div`
  margin: 1rem;
  flex: 1 0 40%;
`;

const StyledFieldHeader = styled.header`
  margin: 1rem;
  font-size: 1.5rem;
`;

const DescriptionPanel: FC<PanelProps> = ({ setTouchedFields }) => {
  const { t } = useTranslation('publication');
  const { setFieldValue }: FormikProps<FormikPublication> = useFormikContext();

  useEffect(
    // Set all fields as touched if user navigates away from this panel (on unmount)
    () => () => setTouchedFields(touchedDescriptionTabFields),
    [setTouchedFields]
  );

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Card>
        <Heading>{t('heading.description')}</Heading>
        <StyledFieldWrapper>
          <Field data-testid="publication-title-field" name={DescriptionFieldNames.TITLE}>
            {({ field, meta: { touched, error } }: FieldProps) => (
              <TextField
                {...field}
                inputProps={{ 'data-testid': 'publication-title-input' }}
                variant="outlined"
                fullWidth
                label={t('common:title')}
                error={touched && !!error}
                helperText={<ErrorMessage name={field.name} />}
              />
            )}
          </Field>
        </StyledFieldWrapper>
        <StyledFieldWrapper>
          <Field name={DescriptionFieldNames.ABSTRACT}>
            {({ field }: FieldProps) => (
              <TextField
                {...field}
                inputProps={{ 'data-testid': 'publication-title-input' }}
                variant="outlined"
                fullWidth
                multiline
                rows="4"
                label={t('description.abstract')}
              />
            )}
          </Field>
        </StyledFieldWrapper>
        <StyledFieldWrapper>
          <Field name={DescriptionFieldNames.DESCRIPTION}>
            {({ field }: FieldProps) => (
              <TextField
                {...field}
                inputProps={{ 'data-testid': 'publication-description-input' }}
                label={t('description.description')}
                multiline
                rows="4"
                fullWidth
                variant="outlined"
              />
            )}
          </Field>
        </StyledFieldWrapper>
        <MultipleFieldWrapper>
          <StyledFieldWrapper>
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
          </StyledFieldWrapper>
          <StyledFieldWrapper>
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
                      label={t('description.tags')}
                      helperText={t('description.tags_helper')}
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              )}
            </Field>
          </StyledFieldWrapper>
        </MultipleFieldWrapper>

        <MultipleFieldWrapper>
          <StyledFieldWrapper data-testid="date-published-field">
            <DatePickerField
              yearFieldName={DescriptionFieldNames.PUBLICATION_YEAR}
              monthFieldName={DescriptionFieldNames.PUBLICATION_MONTH}
              dayFieldName={DescriptionFieldNames.PUBLICATION_DAY}
            />
          </StyledFieldWrapper>

          <StyledFieldWrapper>
            <Field name={DescriptionFieldNames.LANGUAGE}>
              {({ field }: FieldProps) => (
                <TextField {...field} variant="outlined" fullWidth select label={t('description.primary_language')}>
                  {publicationLanguages.map(({ id, value }) => (
                    <MenuItem value={value} key={id} data-testid={`publication-language-${id}`}>
                      {t(`languages:${id}`)}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            </Field>
          </StyledFieldWrapper>
        </MultipleFieldWrapper>
      </Card>
      <Card>
        <StyledFieldHeader>{t('description.project_association')}</StyledFieldHeader>

        <StyledFieldWrapper>
          <Field name={DescriptionFieldNames.PROJECT}>
            {({ field: { name, value } }: FieldProps) => (
              <>
                <ProjectSearch
                  setValueFunction={(newValue) => setFieldValue(name, { ...emptyProject, ...newValue })}
                  dataTestId="search_project"
                  placeholder={t('description.search_for_project')}
                />
                {value && (
                  <ProjectRow
                    key={value.id}
                    project={value}
                    onClickRemove={() => setFieldValue(name, null)}
                    dataTestId="selected_project"
                  />
                )}
              </>
            )}
          </Field>
        </StyledFieldWrapper>
      </Card>
    </MuiPickersUtilsProvider>
  );
};

export default DescriptionPanel;
