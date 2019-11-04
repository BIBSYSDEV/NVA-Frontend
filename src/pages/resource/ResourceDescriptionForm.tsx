import '../../styles/pages/resource/resource-description.scss';

import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { CLEAR_PUBLICATION_ERRORS, PUBLICATION_ERROR } from '../../redux/reducers/validationReducer';
import { Select, TextField } from 'formik-material-ui';
import { Button, MenuItem } from '@material-ui/core';
import { defaultLanguage, languages } from '../../translations/i18n';

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
      <Formik
        initialValues={{ title: '', abstract: '', description: '', language: defaultLanguage }}
        validationSchema={resourceSchema}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
        }}>
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, handleReset, isSubmitting }) => (
          <>
            <div className="panel-content">
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
                  <div className="field-wrapper ">
                    <Field name="NPI" label={t('NPI')} component={TextField} variant="outlined" fullWidth />
                  </div>
                  <div className="field-wrapper">
                    <Field name="keyword" label={t('Keyword')} component={TextField} fullWidth variant="outlined" />
                  </div>
                </div>

                <div className="multiple-field-wrapper ">
                  <div className="field-wrapper ">
                    <Field
                      name="publication-date"
                      label={t('Publication date')}
                      component={TextField}
                      variant="outlined"
                      fullWidth
                    />
                  </div>
                  <div className="field-wrapper">
                    <Field name="language" variant="outlined" fullWidth component={Select} label={'PER'}>
                      Name
                      {languages.map(language => (
                        <MenuItem value={language.code} key={language.code} data-cy={`user-language-${language.code}`}>
                          {language.name}
                        </MenuItem>
                      ))}
                    </Field>
                  </div>
                </div>

                <div className="header">{t('Project assosiation')}</div>

                <div className="field-wrapper">
                  <Field name="project" label={t('Project')} component={Select} fullWidth variant="outlined" />
                </div>
              </Form>
            </div>
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
          </>
        )}
      </Formik>
    </div>
  );
};

export default ResourceDescriptionForm;
