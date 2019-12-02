import { Field, Form, Formik } from 'formik';
import { Select, TextField } from 'formik-material-ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import * as Yup from 'yup';

import DateFnsUtils from '@date-io/date-fns';
import { MenuItem } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import Box from '../../../components/Box';
import TabPanel from '../../../components/TabPanel/TabPanel';
import { clearFormErrors, formError } from '../../../redux/actions/validationActions';
import { RootStore } from '../../../redux/reducers/rootReducer';
import { languages } from '../../../translations/i18n';
import { emptyResourceDescription, ResourceDescriptionFormData } from '../../../types/form.types';
import { ResourceFormTabs } from '../../../types/resource.types';
import useFormPersistor from '../../../utils/hooks/useFormPersistor';
import DisciplineSearch from '../description/DisciplineSearch';
import FormikDatePicker from '../FormikDatePicker';
import ProjectSearch from './ProjectSearch';

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

interface DescriptionPanelProps {
  goToNextTab: (event: React.MouseEvent<any>) => void;
  saveResource: () => void;
  tabNumber: number;
}

const DescriptionPanel: React.FC<DescriptionPanelProps> = ({ goToNextTab, tabNumber, saveResource }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const errors = useSelector((store: RootStore) => store.errors);
  const [persistedFormData, setPersistedFormData, clearPersistedData] = useFormPersistor('resourceDescription');

  const resourceSchema = Yup.object().shape({
    title: Yup.string().required(t('publication:feedback.required_field')),
  });

  const validateAndPersistValues = (values: ResourceDescriptionFormData) => {
    setPersistedFormData(values);
    try {
      resourceSchema.validateSync(values, { abortEarly: false });
      dispatch(clearFormErrors(ResourceFormTabs.DESCRIPTION));
    } catch (e) {
      dispatch(formError(ResourceFormTabs.DESCRIPTION, e.inner));
    }
  };

  const saveAndClearLocalStorage = () => {
    saveResource();
    clearPersistedData();
  };

  const initialFormikValues = {
    title: persistedFormData.title || emptyResourceDescription.title,
    abstract: persistedFormData.abstract || emptyResourceDescription.abstract,
    description: persistedFormData.description || emptyResourceDescription.description,
    npi: persistedFormData.npi || emptyResourceDescription.npi,
    language: persistedFormData.language || emptyResourceDescription.language,
    date: persistedFormData.date || emptyResourceDescription.date,
    project: persistedFormData.project || emptyResourceDescription.project,
  };

  return (
    <TabPanel
      isHidden={tabNumber !== 1}
      ariaLabel="description"
      goToNextTab={goToNextTab}
      onClickSave={saveAndClearLocalStorage}
      errors={errors.descriptionErrors}
      heading="publication:description_heading">
      <Box>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Formik
            initialValues={initialFormikValues}
            validateOnChange={false}
            validationSchema={resourceSchema}
            validate={values => validateAndPersistValues(values)}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                setSubmitting(false);
              }, 400);
            }}>
            <Form>
              <StyledFieldWrapper>
                <Field
                  aria-label="title"
                  name="title"
                  label={t('publication:description.title')}
                  component={TextField}
                  fullWidth
                  variant="outlined"
                />
              </StyledFieldWrapper>
              <StyledFieldWrapper>
                <Field
                  aria-label="abstract"
                  name="abstract"
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
                  name="description"
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
                  <Field name="npi">
                    {({ form: { values, setFieldValue } }: any) => <DisciplineSearch setFieldValue={setFieldValue} />}
                  </Field>
                </StyledFieldWrapper>
                <StyledFieldWrapper>
                  <Field
                    aria-label="keyword"
                    name="keyword"
                    label={t('publication:description.tags')}
                    component={TextField}
                    fullWidth
                    variant="outlined"
                  />
                </StyledFieldWrapper>
              </MultipleFieldWrapper>

              <MultipleFieldWrapper>
                <StyledFieldWrapper>
                  <Field aria-label="date" component={FormikDatePicker} name="date" />
                </StyledFieldWrapper>

                <StyledFieldWrapper>
                  <Field
                    name="language"
                    aria-label="language"
                    variant="outlined"
                    fullWidth
                    component={Select}
                    label={t('publication:description.date')}>
                    {languages.map(language => (
                      <MenuItem
                        value={language.code}
                        key={language.code}
                        data-testid={`user-language-${language.code}`}>
                        {language.name}
                      </MenuItem>
                    ))}
                  </Field>
                </StyledFieldWrapper>
              </MultipleFieldWrapper>

              <StyledFieldHeader>{t('publication:description.project_assosiation')}</StyledFieldHeader>

              <StyledFieldWrapper>
                <Field name="project">
                  {({ form: { values, setFieldValue } }: any) => (
                    <>
                      <ProjectSearch setFieldValue={setFieldValue} />
                      {values && values.project && values.project.title && <p>{values.project.title}</p>}
                    </>
                  )}
                </Field>
              </StyledFieldWrapper>
            </Form>
          </Formik>
        </MuiPickersUtilsProvider>
      </Box>
    </TabPanel>
  );
};

export default DescriptionPanel;
