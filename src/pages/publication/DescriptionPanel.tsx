import { Field, useFormikContext, FormikProps } from 'formik';
import { Select, TextField } from 'formik-material-ui';
import React, { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import DateFnsUtils from '@date-io/date-fns';
import { MenuItem } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import Box from '../../components/Box';
import TabPanel from '../../components/TabPanel/TabPanel';
import { languages } from '../../translations/i18n';
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

enum FieldNames {
  TITLE = 'description.title',
  ABSTRACT = 'description.abstract',
  DESCRIPTION = 'description.description',
  NPI = 'description.npi',
  KEYWORDS = 'description.keywords',
  DATE = 'description.date',
  LANGUAGE = 'description.language',
  PROJECT = 'description.project',
}

interface DescriptionPanelProps {
  goToNextTab: (event: React.MouseEvent<any>) => void;
  savePublication: () => void;
}

const DescriptionPanel: React.FC<DescriptionPanelProps> = ({ goToNextTab, savePublication }) => {
  const { t } = useTranslation();
  const { setFieldTouched, setFieldValue }: FormikProps<any> = useFormikContext();

  // Validation messages won't show on fields that are not touched
  const setAllFieldsTouched = useCallback(() => {
    Object.values(FieldNames).forEach(fieldName => setFieldTouched(fieldName));
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
    <TabPanel
      ariaLabel="description"
      goToNextTab={goToNextTab}
      onClickSave={validateAndSave}
      heading={t('publication:heading.description')}>
      <Box>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <StyledFieldWrapper>
            <Field
              aria-label="title"
              name={FieldNames.TITLE}
              label={t('common:title')}
              component={TextField}
              fullWidth
              variant="outlined"
            />
          </StyledFieldWrapper>
          <StyledFieldWrapper>
            <Field
              aria-label="abstract"
              name={FieldNames.ABSTRACT}
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
              name={FieldNames.DESCRIPTION}
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
              <Field name={FieldNames.NPI}>
                {() => <DisciplineSearch setValueFunction={newValue => setFieldValue(FieldNames.NPI, newValue)} />}
              </Field>
            </StyledFieldWrapper>
            <StyledFieldWrapper>
              <Field
                aria-label="keyword"
                name={FieldNames.KEYWORDS}
                label={t('publication:description.tags')}
                component={TextField}
                fullWidth
                variant="outlined"
              />
            </StyledFieldWrapper>
          </MultipleFieldWrapper>

          <MultipleFieldWrapper>
            <StyledFieldWrapper>
              <Field aria-label="date" component={FormikDatePicker} name={FieldNames.DATE} />
            </StyledFieldWrapper>

            <StyledFieldWrapper>
              <Field
                name={FieldNames.LANGUAGE}
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
            <Field name={FieldNames.PROJECT}>
              {({ field: { value } }: any) => (
                <>
                  <ProjectSearch setValueFunction={newValue => setFieldValue(FieldNames.PROJECT, newValue)} />
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
