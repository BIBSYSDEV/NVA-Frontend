import '../../styles/pages/resource/resource-description.scss';

import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { CLEAR_PUBLICATION_ERRORS, PUBLICATION_ERROR } from '../../redux/reducers/validationReducer';
import { TextField } from 'formik-material-ui';
import { Button } from '@material-ui/core';

export interface ResourceDescriptionFormProps {
  dispatch: any;
}

const ResourceDescriptionForm: React.FC<ResourceDescriptionFormProps> = ({ dispatch }) => {
  const { t } = useTranslation();

  const resourceSchema = Yup.object().shape({
    title: Yup.string().required(t('Required field')),
    abstract: Yup.string().required(t('Required field')),
    description: Yup.string().required(t('Required field')),
  });

  const handleValidation = (values: any) => {
    try {
      resourceSchema.validateSync(values, { abortEarly: false });
      dispatch({ type: CLEAR_PUBLICATION_ERRORS });
    } catch (e) {
      dispatch({ type: PUBLICATION_ERROR, payload: e.inner });
    }
  };

  return (
    <div className="resource-description-panel">
      <div className="header">{t('Description')}</div>
      <div className="panel-content">
        <Formik
          initialValues={{ title: '', abstract: '', description: '' }}
          validationSchema={resourceSchema}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 400);
          }}>
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, handleReset, isSubmitting }) => (
            <Form>
              <div className="field-wrapper">
                <Field
                  name="title"
                  label={t('Title')}
                  component={TextField}
                  fullWidth
                  className="input-field"
                  variant="outlined"
                />
              </div>

              <div className="field-wrapper">
                <Field
                  name="abstract"
                  label={t('Abstract')}
                  component={TextField}
                  multiline
                  rows="4"
                  fullWidth
                  variant="outlined"
                />
              </div>

              <div className="field-wrapper">
                <Field
                  name="description"
                  label={t('Description')}
                  component={TextField}
                  multiline
                  rows="4"
                  fullWidth
                  variant="outlined"
                />
              </div>

              <div className="multiple-field-wrapper ">
                <span className="field-wrapper ">
                  <Field name="NPI" label={t('NPI')} component={TextField} variant="outlined" fullWidth />
                </span>
                <span className="field-wrapper">
                  <Field name="keyword" label={t('Keyword')} component={TextField} fullWidth variant="outlined" />
                </span>
              </div>

              <div className="multiple-field-wrapper ">
                <span className="field-wrapper ">
                  <Field
                    name="publication-date"
                    label={t('Publication date')}
                    component={TextField}
                    variant="outlined"
                    fullWidth
                  />
                </span>
                <span className="field-wrapper">
                  <Field name="language" label={t('Language')} component={TextField} fullWidth variant="outlined" />
                </span>
              </div>

              <div>
                <Button
                  type="button"
                  onClick={() => {
                    handleReset();
                    dispatch({ type: CLEAR_PUBLICATION_ERRORS });
                  }}>
                  {t('Reset')}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !!errors.abstract || !!errors.title || !!errors.description}>
                  {t('Create')}
                </Button>
                <Button type="submit" onClick={(_: any) => handleValidation(values)}>
                  Validate
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ResourceDescriptionForm;
