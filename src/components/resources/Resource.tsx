import React from 'react';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import * as Yup from 'yup';
import { Button, Typography } from '@material-ui/core';

import '../../styles/resource.scss';
import { useTranslation } from 'react-i18next';

const Resource: React.FC = () => {
  const ResourceSchema = Yup.object().shape({
    email: Yup.string()
      .email('Ugyldig epost')
      .required('Påkrevd'),
    password: Yup.string().required('Påkrevd'),
  });

  const { t } = useTranslation();

  return (
    <div className="resource">
      <Typography className="resource__heading" variant="h4">
        {t('Register new resource')}
      </Typography>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={ResourceSchema}
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
          <Form className="resource__form">
            <Field name="email" label={t('Email')} type="email" component={TextField} fullWidth />
            <br />
            <br />
            <Field name="password" label={t('Password')} type="password" component={TextField} fullWidth />

            <div className="button-group">
              <Button className="button-group__reset" type="button" color="secondary" onClick={handleReset}>
                {t('Reset')}
              </Button>
              <Button
                className="button-group__submit"
                type="submit"
                color="primary"
                disabled={isSubmitting || !!errors.email || !!errors.password}>
                {t('Create')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Resource;
