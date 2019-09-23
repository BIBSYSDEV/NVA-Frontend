import React from 'react';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import * as Yup from 'yup';
import { Button, Typography } from '@material-ui/core';

import '../../styles/resource.scss';

const Resource: React.FC = () => {
  const ResourceSchema = Yup.object().shape({
    email: Yup.string()
      .email('Ugyldig epost')
      .required('Påkrevd'),
    password: Yup.string().required('Påkrevd'),
  });

  return (
    <div className="resource">
      <Typography className="resource__heading" variant="h4">
        Registrer ny ressurs
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
            <Field name="email" label="Epost" type="email" component={TextField} fullWidth />
            <br />
            <br />
            <Field name="password" label="Passord" type="password" component={TextField} fullWidth />

            <div className="button-group">
              <Button className="button-group__reset" type="button" color="secondary" onClick={handleReset}>
                Reset
              </Button>
              <Button
                className="button-group__submit"
                type="submit"
                color="primary"
                disabled={isSubmitting || !!errors.email || !!errors.password}>
                Opprett
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Resource;
