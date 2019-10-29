import '../../styles/resource.scss';

import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { Button, Typography } from '@material-ui/core';

export interface ResourceWithFormikProps {
  handleErrors: (errors: any[]) => void;
}

const ResourceWithFormik: React.FC<ResourceWithFormikProps> = ({ handleErrors }) => {
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
    } catch (e) {
      handleErrors(e.inner);
    }
  };

  return (
    <div className="resource">
      <Typography className="resource__heading" variant="h4">
        {t('Register new resource')}
      </Typography>
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
