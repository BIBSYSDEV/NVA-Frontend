import { Field, FormikProps, useFormikContext } from 'formik';
import { Select, TextField } from 'formik-material-ui';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import DateFnsUtils from '@date-io/date-fns';
import { MenuItem } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import Box from '../../components/Box';
import TabPanel from '../../components/TabPanel/TabPanel';
import { languages } from '../../translations/i18n';
import { PublicationFormsData } from '../../types/form.types';
import DisciplineSearch from './description_tab/DisciplineSearch';
import FormikDatePicker from './description_tab/FormikDatePicker';
import ProjectSearch from './description_tab/ProjectSearch';

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

enum DescriptionFieldNames {
  TITLE = 'title.no',
  ABSTRACT = 'abstract',
  DESCRIPTION = 'description',
  NPI_DISCIPLINES = 'npiDisciplines',
  TAGS = 'tags',
  PUBLICATION_YEAR = 'publicationDate.year',
  LANGUAGE = 'language',
  PROJECTS = 'projects',
}

interface DescriptionPanelProps {
  goToNextTab: (event: React.MouseEvent<any>) => void;
  savePublication: () => void;
}

const DescriptionPanel: React.FC<DescriptionPanelProps> = ({ goToNextTab, savePublication }) => {
  const { t } = useTranslation();
  const { setFieldTouched, setFieldValue }: FormikProps<PublicationFormsData> = useFormikContext();

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
              label={t('publication:description.abstract')}
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
              label={t('publication:description.description')}
              component={TextField}
              multiline
              rows="4"
              fullWidth
              variant="outlined"
            />
          </StyledFieldWrapper>
          <MultipleFieldWrapper>
            <StyledFieldWrapper>
              <Field name={DescriptionFieldNames.NPI_DISCIPLINES}>
                {({ field }: any) => (
                  <DisciplineSearch setValueFunction={newValue => setFieldValue(field.name, newValue)} />
                )}
              </Field>
            </StyledFieldWrapper>
            <StyledFieldWrapper>
              {/* TODO: Use <Chip /> or similar to visualize tags  */}
              <Field
                aria-label="tags"
                name={DescriptionFieldNames.TAGS}
                label={t('publication:description.tags')}
                component={TextField}
                fullWidth
                variant="outlined"
              />
            </StyledFieldWrapper>
          </MultipleFieldWrapper>

          <MultipleFieldWrapper>
            <StyledFieldWrapper>
              {/* TODO: Render three different Fields: year, month, date
               *  https://material-ui-pickers.dev/demo/datepicker#different-views
               */}
              <Field aria-label="date" component={FormikDatePicker} name={DescriptionFieldNames.PUBLICATION_YEAR} />
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

          <StyledFieldHeader>{t('publication:description.project_association')}</StyledFieldHeader>

          <StyledFieldWrapper>
            <Field name={DescriptionFieldNames.PROJECTS}>
              {/* TODO: Use <FieldArray /> */}
              {({ field: { value, name } }: any) => (
                <>
                  <ProjectSearch setValueFunction={newValue => setFieldValue(name, newValue)} />
                  {value.title && <p>{value.title}</p>}
                </>
              )}
            </Field>
          </StyledFieldWrapper>
        </MuiPickersUtilsProvider>
      </Box>
    </TabPanel>
  );
};

export default DescriptionPanel;
