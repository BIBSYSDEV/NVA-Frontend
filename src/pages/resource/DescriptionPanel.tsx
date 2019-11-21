import { Field, Form, Formik } from 'formik';
import { Select, TextField } from 'formik-material-ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import DateFnsUtils from '@date-io/date-fns';
import { MenuItem } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import TabPanel from '../../components/TabPanel/TabPanel';
import { clearFormErrors, formError } from '../../redux/actions/validationActions';
import { RootStore } from '../../redux/reducers/rootReducer';
import { languages } from '../../translations/i18n';
import { ResourceFormTabs } from '../../types/resource.types';
import { emptyResourceDescription, ResourceDescriptionFormData } from '../../types/form.types';
import publications from '../../utils/testfiles/projects_random_generated.json';
import FormikDatePicker from './FormikDatePicker';
import styled from 'styled-components';
import Box from '../../components/Box';
import useFormPersistor from '../../utils/hooks/useFormPersistor';

const MultipleFieldWrapper = styled.div`
  display: flex;
`;

const StyledFieldWrapper = styled.div`
  padding: 1rem;
  flex: 1 0 40%;
`;

const StyledFieldHeader = styled.header`
  font-size: 1.5rem;
  margin-left: 1rem;
  margin-top: 2rem;
`;

interface DescriptionPanelProps {
  goToNextTab: (event: React.MouseEvent<any>) => void;
  tabNumber: number;
}

const DescriptionPanel: React.FC<DescriptionPanelProps> = ({ goToNextTab, tabNumber }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const errors = useSelector((store: RootStore) => store.errors);
  const [persistedFormData, setPersistedFormData] = useFormPersistor('resourceDescription');

  const resourceSchema = Yup.object().shape({
    title: Yup.string().required(t('resource_form.feedback.required_field')),
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
      errors={errors.descriptionErrors}
      heading="Description">
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
                  label={t('resource_form.title')}
                  component={TextField}
                  fullWidth
                  variant="outlined"
                />
              </StyledFieldWrapper>
              <StyledFieldWrapper>
                <Field
                  aria-label="abstract"
                  name="abstract"
                  label={t('resource_form.abstract')}
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
                  label={t('resource_form.description')}
                  component={TextField}
                  multiline
                  rows="4"
                  fullWidth
                  variant="outlined"
                />
              </StyledFieldWrapper>
              <MultipleFieldWrapper>
                <StyledFieldWrapper>
                  <Field
                    aria-label="NPI"
                    name="NPI"
                    label={t('resource_form.NPI')}
                    component={TextField}
                    variant="outlined"
                    fullWidth
                  />
                </StyledFieldWrapper>
                <StyledFieldWrapper>
                  <Field
                    aria-label="keyword"
                    name="keyword"
                    label={t('resource_form.tags')}
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
                    label={t('date')}>
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

              <StyledFieldHeader>{t('resource_form.project_assosiation')}</StyledFieldHeader>
              <StyledFieldWrapper>
                <Field
                  name="project"
                  aria-label="project"
                  label={t('resource_form.project')}
                  component={Select}
                  fullWidth
                  variant="outlined">
                  {publications.map(publication => (
                    <MenuItem value={publication.id} key={publication.id}>
                      {`${publication.name} - ${publication.id}`}
                    </MenuItem>
                  ))}
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
