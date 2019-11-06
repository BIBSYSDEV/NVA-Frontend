import '../../styles/pages/resource/resource-description.scss';

import { Field, Form, Formik } from 'formik';
import { Select, TextField } from 'formik-material-ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

import DateFnsUtils from '@date-io/date-fns';
import { MenuItem } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import { clearDescriptionErrors, descriptionError } from '../../redux/actions/validationActions';
import { defaultLanguage, languages } from '../../translations/i18n';
import publications from '../../utils/testfiles/projects_random_generated.json';
import FormikDatePicker from './FormikDatePicker';

const ResourceDescriptionForm: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const resourceSchema = Yup.object().shape({
    title: Yup.string().required(t('Required field')),
  });

  const handleValidation = (values: any) => {
    try {
      resourceSchema.validateSync(values, { abortEarly: false });
      dispatch(clearDescriptionErrors());
    } catch (e) {
      dispatch(descriptionError(e.inner));
    }
  };

  const initialFormikValues = {
    title: '',
    abstract: '',
    description: '',
    NPI: '',
    language: defaultLanguage,
    date: Date.now(),
    project: '762886',
  };

  return (
    <div className="resource-description-panel">
      <div className="header">{t('Description')}</div>
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
            <div className="panel-content">
              <Form onBlur={() => handleValidation(values)}>
                <div className="field-wrapper">
                  <Field
                    aria-label="title"
                    name="title"
                    label={t('resource_form.title')}
                    component={TextField}
                    fullWidth
                    className="input-field"
                    variant="outlined"
                  />
                </div>
                <div className="field-wrapper">
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
                </div>
                <div className="field-wrapper">
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
                </div>
                <div className="multiple-field-wrapper ">
                  <div className="field-wrapper ">
                    <Field
                      aria-label="NPI"
                      name="NPI"
                      label={t('resource_form.NPI')}
                      component={TextField}
                      variant="outlined"
                      fullWidth
                    />
                  </div>
                  <div className="field-wrapper">
                    <Field
                      aria-label="keyword"
                      name="keyword"
                      label={t('resource_form.tags')}
                      component={TextField}
                      fullWidth
                      variant="outlined"
                    />
                  </div>
                </div>

                <div className="multiple-field-wrapper ">
                  <div className="field-wrapper ">
                    <Field aria-label="date" component={FormikDatePicker} name="date" />
                  </div>

                  <div className="field-wrapper">
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
                  </div>
                </div>

                <div className="header">{t('resource_form.project_assosiation')}</div>

                <div className="field-wrapper">
                  <Field
                    name="project"
                    aria-label="project"
                    label={t('resource_form.project')}
                    component={Select}
                    fullWidth
                    variant="outlined">
                    {publications.map(publication => (
                      <MenuItem value={publication.id} className="pub-item" key={publication.id}>
                        {`${publication.name} - ${publication.id}`}
                      </MenuItem>
                    ))}
                  </Field>
                </div>
              </Form>
            </div>
          )}
        </Formik>
      </MuiPickersUtilsProvider>
    </div>
  );
};

export default ResourceDescriptionForm;
