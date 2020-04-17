import { Field, FieldArray, FormikProps, useFormikContext, FieldProps, FieldArrayRenderProps, getIn } from 'formik';
import { TextField } from 'formik-material-ui';
import React, { FC, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import DateFnsUtils from '@date-io/date-fns';
import { MenuItem } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import TabPanel, { TabPanelCommonProps } from '../../components/TabPanel/TabPanel';
import { FormikPublication } from '../../types/publication.types';
import DisciplineSearch from './description_tab/DisciplineSearch';
import ProjectSearch from './description_tab/ProjectSearch';
import ProjectRow from './description_tab/ProjectRow';
import DatePickerField from './description_tab/DatePickerField';
import ChipInput from 'material-ui-chip-input';
import { publicationLanguages } from '../../types/language.types';
import Heading from '../../components/Heading';
import Card from '../../components/Card';
import { DescriptionFieldNames } from '../../types/publicationFieldNames';
import { emptyProject } from '../../types/project.types';

const MultipleFieldWrapper = styled.div`
  display: flex;
`;

const StyledFieldWrapper = styled.div`
  margin: 1rem;
  flex: 1 0 40%;
`;

const StyledTagsField = styled(StyledFieldWrapper)`
  margin-top: 2rem;
`;

const StyledFieldHeader = styled.header`
  margin: 1rem;
  font-size: 1.5rem;
`;

interface DescriptionPanelProps extends TabPanelCommonProps {
  savePublication: () => void;
}

const DescriptionPanel: FC<DescriptionPanelProps> = ({ goToNextTab, isSaving, savePublication }) => {
  const { t } = useTranslation('publication');
  const { setFieldTouched, setFieldValue, values }: FormikProps<FormikPublication> = useFormikContext();

  // Validation messages won't show on fields that are not touched
  const setAllFieldsTouched = useCallback(() => {
    Object.values(DescriptionFieldNames).forEach((fieldName) => setFieldTouched(fieldName));
  }, [setFieldTouched]);

  useEffect(
    () => () => {
      // Set all fields as touched if user navigates away from this panel (on unmount)
      setAllFieldsTouched();
    },
    [setAllFieldsTouched]
  );

  const validateAndSave = () => {
    setAllFieldsTouched();
    savePublication();
  };

  return (
    <TabPanel ariaLabel="description" goToNextTab={goToNextTab} isSaving={isSaving} onClickSave={validateAndSave}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Card>
          <Heading>{t('heading.description')}</Heading>
          <StyledFieldWrapper>
            <Field
              aria-label="title"
              name={DescriptionFieldNames.TITLE}
              label={t('common:title')}
              component={TextField}
              fullWidth
              variant="outlined"
              inputProps={{ 'data-testid': 'publication-title-input' }}
            />
          </StyledFieldWrapper>
          <StyledFieldWrapper>
            <Field
              aria-label="abstract"
              name={DescriptionFieldNames.ABSTRACT}
              label={t('description.abstract')}
              component={TextField}
              multiline
              rows="4"
              fullWidth
              variant="outlined"
            />
          </StyledFieldWrapper>
          <StyledFieldWrapper>
            <Field
              aria-label="description"
              name={DescriptionFieldNames.DESCRIPTION}
              label={t('description.description')}
              component={TextField}
              multiline
              rows="4"
              fullWidth
              variant="outlined"
              inputProps={{ 'data-testid': 'publication-description-input' }}
            />
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
            <StyledTagsField>
              <FieldArray name={DescriptionFieldNames.TAGS}>
                {({ name, push, remove }: FieldArrayRenderProps) => (
                  <ChipInput
                    value={getIn(values, name)}
                    onAdd={(tag) => push(tag)}
                    onDelete={(_, index) => remove(index)}
                    aria-label="tags"
                    label={t('description.tags')}
                    helperText={t('description.tags_helper')}
                    variant="outlined"
                    fullWidth
                  />
                )}
              </FieldArray>
            </StyledTagsField>
          </MultipleFieldWrapper>

          <MultipleFieldWrapper>
            <StyledFieldWrapper>
              <DatePickerField
                yearFieldName={DescriptionFieldNames.PUBLICATION_YEAR}
                monthFieldName={DescriptionFieldNames.PUBLICATION_MONTH}
                dayFieldName={DescriptionFieldNames.PUBLICATION_DAY}
              />
            </StyledFieldWrapper>

            <StyledFieldWrapper>
              <Field
                name={DescriptionFieldNames.LANGUAGE}
                aria-label="language"
                variant="outlined"
                fullWidth
                component={TextField}
                select
                label={t('description.primary_language')}>
                {publicationLanguages.map(({ id, value }) => (
                  <MenuItem value={value} key={id} data-testid={`publication-language-${id}`}>
                    {t(`languages:${id}`)}
                  </MenuItem>
                ))}
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
    </TabPanel>
  );
};

export default DescriptionPanel;
