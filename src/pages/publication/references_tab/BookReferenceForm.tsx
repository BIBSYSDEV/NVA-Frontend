import React from 'react';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import PublisherSearch from './PublisherSearch';

const BookReferenceForm: React.FC = () => {
  const initialValues = {
    publisher: '',
    isbn: '',
  };

  return (
    <Formik initialValues={initialValues} onSubmit={values => console.log('BookRef', values)}>
      {({ setFieldValue, values }) => (
        <Form
          onBlur={() => {
            console.log(values);
          }}>
          <PublisherSearch setFieldValue={value => setFieldValue('publisher', value)} />
          <Field name="isbn" component={TextField} variant="outlined" label="ISBN"></Field>
        </Form>
      )}
    </Formik>
  );
};

export default BookReferenceForm;
