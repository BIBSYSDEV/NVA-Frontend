import React from 'react';
import { Formik, Form, Field } from 'formik';
import { TextField, Select } from 'formik-material-ui';
import { MenuItem } from '@material-ui/core';

const JournalPublicationReferenceForm: React.FC = () => {
  const initialValues = {
    type: '',
    doi: '',
  };

  const publicationTypes = ['Article', 'Short communication', 'Leader', 'Letter', 'Review'];

  return (
    <Formik initialValues={initialValues} onSubmit={values => console.log('BookRef', values)}>
      {({ values }) => (
        <Form
          onBlur={() => {
            console.log(values);
          }}>
          <Field name="type" component={Select} variant="outlined" fullWidth>
            {publicationTypes.map(type => (
              <MenuItem value={type} key={type}>
                {type}
              </MenuItem>
            ))}
          </Field>
          <Field name="doi" component={TextField} variant="outlined" label="DOI"></Field>
        </Form>
      )}
    </Formik>
  );
};

export default JournalPublicationReferenceForm;
