import { Field, FormikProps, useFormikContext, FieldArray } from 'formik';
import { Select, TextField } from 'formik-material-ui';
import React, { FC, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import DateFnsUtils from '@date-io/date-fns';
import { MenuItem } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import Box from '../../components/Box';
import TabPanel from '../../components/TabPanel/TabPanel';
import { languages } from '../../translations/i18n';
import { emptyNpiDiscipline, Publication } from '../../types/publication.types';
import DisciplineSearch from './description_tab/DisciplineSearch';
import ProjectSearch from './description_tab/ProjectSearch';
import ProjectRow from './description_tab/ProjectRow';
import DatePickerField from './description_tab/DatePickerField';
import { getObjectValueByFieldName } from '../../utils/helpers';
import { Project } from '../../types/project.types';

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

export enum DescriptionFieldNames {
  TITLE = 'title.nb',
  ABSTRACT = 'abstract',
  DESCRIPTION = 'description',
  NPI_DISCIPLINE = 'npiDiscipline',
  TAGS = 'tags',
  PUBLICATION_YEAR = 'publicationDate.year',
  PUBLICATION_MONTH = 'publicationDate.month',
  PUBLICATION_DAY = 'publicationDate.day',
  LANGUAGE = 'language',
  PROJECTS = 'projects',
}

interface DescriptionPanelProps {
  goToNextTab: (event: React.MouseEvent<any>) => void;
  savePublication: () => void;
}

const DescriptionPanel: FC<DescriptionPanelProps> = ({ goToNextTab, savePublication }) => {
  const { t } = useTranslation('publication');
  const { setFieldTouched, setFieldValue, values }: FormikProps<Publication> = useFormikContext();

  // Validation messages won't show on fields that are not touched
  const setAllFieldsTouched = useCallback(() => {
    Object.values(DescriptionFieldNames).forEach(fieldName => setFieldTouched(fieldName));
  }, [setFieldTouched]);

  useEffect(() => {
    // Set all fields as touched if user navigates away from this panel (on unmount)
    return () => setAllFieldsTouched();
  }, [setAllFieldsTouched]);

  const validateAndSave = () => {
    setAllFieldsTouched();
    savePublication();
  };

  return (
    <TabPanel ariaLabel="description" goToNextTab={goToNextTab} onClickSave={validateAndSave}>
      <Box>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <StyledFieldWrapper>
            <Field
              aria-label="title"
              name={DescriptionFieldNames.TITLE}
              label={t('common:title')}
              component={TextField}
              fullWidth
              variant="outlined"
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
            />
          </StyledFieldWrapper>
          <MultipleFieldWrapper>
            <StyledFieldWrapper>
              <Field name={DescriptionFieldNames.NPI_DISCIPLINE}>
                {({ field: { name, value } }: any) => (
                  <DisciplineSearch
                    setValueFunction={newValue => setFieldValue(name, newValue ?? emptyNpiDiscipline)}
                    dataTestId="search_npi"
                    value={value.title}
                    placeholder={t('description.search_for_npi_discipline')}
                  />
                )}
              </Field>
            </StyledFieldWrapper>
            <StyledFieldWrapper>
              {/* TODO: Use <Chip /> or similar to visualize tags  */}
              <Field
                aria-label="tags"
                name={DescriptionFieldNames.TAGS}
                label={t('description.tags')}
                component={TextField}
                fullWidth
                variant="outlined"
              />
            </StyledFieldWrapper>
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
                component={Select}
                label={t('common:date')}>
                {languages.map(language => (
                  <MenuItem value={language.code} key={language.code} data-testid={`user-language-${language.code}`}>
                    {language.name}
                  </MenuItem>
                ))}
              </Field>
            </StyledFieldWrapper>
          </MultipleFieldWrapper>

          <StyledFieldHeader>{t('description.project_association')}</StyledFieldHeader>

          <StyledFieldWrapper>
            <FieldArray name={DescriptionFieldNames.PROJECTS}>
              {({ name, insert, remove }) => (
                <>
                  <ProjectSearch
                    setValueFunction={newValue => insert(0, newValue)}
                    dataTestId="search_project"
                    placeholder={t('description.search_for_project')}
                  />
                  {getObjectValueByFieldName(values, name).map((project: Project, i: number) => (
                    <ProjectRow key={project.id} project={project} onClickRemove={() => remove(i)} />
                  ))}
                </>
              )}
            </FieldArray>
          </StyledFieldWrapper>
        </MuiPickersUtilsProvider>
      </Box>
    </TabPanel>
  );
};

export default DescriptionPanel;
