import { Field, Form, Formik } from 'formik';
import { Select, TextField } from 'formik-material-ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import DateFnsUtils from '@date-io/date-fns';
import { MenuItem } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import TabPanel from '../../../components/TabPanel/TabPanel';
import { clearFormErrors, formError } from '../../../redux/actions/validationActions';
import { RootStore } from '../../../redux/reducers/rootReducer';
import { defaultLanguage, languages } from '../../../translations/i18n';
import { ResourceFormTabs } from '../../../types/resource.types';
import FormikDatePicker from '../FormikDatePicker';
import styled from 'styled-components';
import Box from '../../../components/Box';
import CristinProject from './CristinProject';

const MultipleFieldWrapper = styled.div`
  display: flex;
`;

const StyledFieldWrapper = styled.div`
  padding: 1rem;
  flex: 1 0 40%;
`;

interface DescriptionPanelProps {
  goToNextTab: (event: React.MouseEvent<any>) => void;
  tabNumber: number;
}

const DescriptionPanel: React.FC<DescriptionPanelProps> = ({ goToNextTab, tabNumber }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const errors = useSelector((store: RootStore) => store.errors);

  const resourceSchema = Yup.object().shape({
    title: Yup.string().required(t('resource_form.feedback.required_field')),
  });

  const handleValidation = (values: any) => {
    try {
      resourceSchema.validateSync(values, { abortEarly: false });
      dispatch(clearFormErrors(ResourceFormTabs.DESCRIPTION));
    } catch (e) {
      dispatch(formError(ResourceFormTabs.DESCRIPTION, e.inner));
    }
  };

  const initialFormikValues = {
    title: '',
    abstract: '',
    description: '',
    NPI: '',
    language: defaultLanguage,
    date: Date.now(),
    project: '',
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
            validationSchema={resourceSchema}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                setSubmitting(false);
              }, 400);
            }}>
            {values => (
              <Form onBlur={() => handleValidation(values)}>
                <StyledFieldWrapper>
                  <Field
                    aria-label="title"
                    name="title"
                    margin="dense"
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
                    margin="dense"
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
                    margin="dense"
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
                      margin="dense"
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
                      margin="dense"
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
                      margin="dense"
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

                <CristinProject />
              </Form>
            )}
          </Formik>
        </MuiPickersUtilsProvider>
      </Box>
    </TabPanel>
  );
};

export default DescriptionPanel;
