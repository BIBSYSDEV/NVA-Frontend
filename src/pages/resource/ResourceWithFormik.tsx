import '../../styles/pages/resource/resource.scss';

import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { Button, Typography } from '@material-ui/core';

import { clearPublicationErrors, publicationError } from '../../redux/actions/validationActions';

export interface ResourceWithFormikProps {
  dispatch: any;
}

const ResourceWithFormik: React.FC<ResourceWithFormikProps> = ({ dispatch }) => {
  const { t } = useTranslation();

  const resourceSchema = Yup.object().shape({
    email: Yup.string()
      .email(t('Invalid email'))
      .required(t('Required field')),
    password: Yup.string().required(t('Required field')),
  });

  const handleValidation = (values: any) => {
    try {
      resourceSchema.validateSync(values, { abortEarly: false });
      dispatch(clearPublicationErrors());
    } catch (e) {
      dispatch(publicationError(e.inner));
    }
  };

  return (
    <div className="resource">
      <Typography variant="h4">{t('Register new resource')}</Typography>
      <Formik
        initialValues={{ email: '', password: '' }}
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
          /* and other goodies */
        }) => (
          <Form>
            <Field name="email" label={t('Email')} type="email" component={TextField} fullWidth />
            <br />
            <br />
            <Field name="password" label={t('Password')} type="password" component={TextField} fullWidth />

            <div>
              <Button
                type="button"
                onClick={() => {
                  handleReset();
                  dispatch(clearPublicationErrors());
                }}>
                {t('Reset')}
              </Button>
              <Button type="submit" disabled={isSubmitting || !!errors.email || !!errors.password}>
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
  );
};

export default ResourceWithFormik;
