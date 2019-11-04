import '../../styles/pages/resource/resource-description.scss';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import DateFnsUtils from '@date-io/date-fns';
import { CLEAR_PUBLICATION_ERRORS, PUBLICATION_ERROR } from '../../redux/reducers/validationReducer';
import { Select, TextField } from 'formik-material-ui';
import { MenuItem } from '@material-ui/core';
import { defaultLanguage, languages } from '../../translations/i18n';
import publications from '../../utils/testfiles/projects_random_generated.json';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

export interface ResourceDescriptionFormProps {
  dispatch: any;
}

export interface FormikDatePickerProps {
  name: any;
  form: any;
  field: any;
}

const FormikDatePicker: React.FC<FormikDatePickerProps> = ({ name, form: { setFieldValue }, field: { value } }) => {
  return (
    <KeyboardDatePicker
      name={name}
      label="DATO!!!"
      autoOk
      onChange={value => {
        setFieldValue(name, '2019-01-01T07:00:00.000Z');
      }}
      value={value}
    />
  );
};

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
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Formik
          initialValues={{
            title: '',
            abstract: '',
            description: '',
            language: defaultLanguage,
            date: '2019-10-24T22:00:00.000Z',
            project: '762886',
          }}
          validationSchema={resourceSchema}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 400);
          }}>
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            handleReset,
            isSubmitting,
            setFieldValue,
          }) => (
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
                      <Field component={FormikDatePicker} name="date" />
                    </div>
                    <div className="field-wrapper">
                      <Field name="language" variant="outlined" fullWidth component={Select} label={'DATO!'}>
                        {languages.map(language => (
                          <MenuItem
                            value={language.code}
                            key={language.code}
                            data-cy={`user-language-${language.code}`}>
                            {language.name}
                          </MenuItem>
                        ))}
                      </Field>
                    </div>
                  </div>

                  <div className="header">{t('Project assosiation')}</div>

                  <div className="field-wrapper">
                    <Field name="project" label={t('Project')} component={Select} fullWidth variant="outlined">
                      {publications.map(publication => (
                        <MenuItem value={publication.id} id="pub-item" key={publication.id}>
                          {`${publication.name} - ${publication.id}`}
                        </MenuItem>
                      ))}
                    </Field>
                  </div>
                </Form>
              </div>
            </>
          )}
        </Formik>
      </MuiPickersUtilsProvider>
    </div>
  );
};

export default ResourceDescriptionForm;
