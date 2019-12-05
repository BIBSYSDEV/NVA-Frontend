import React from 'react';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import PublisherSearch from './PublisherSearch';
import useFormPersistor from '../../../utils/hooks/useFormPersistor';
import { emptyBookReferenceFormData } from '../../../types/form.types';
import { useTranslation } from 'react-i18next';

const BookReferenceForm: React.FC = () => {
  const { t } = useTranslation('publication');
  const [persistedFormData, setPersistedFormData] = useFormPersistor(
    'publicationBookReference',
    emptyBookReferenceFormData
  );

  return (
    <Formik initialValues={persistedFormData} onSubmit={() => {}}>
      {({ setFieldValue, values }) => (
        <Form
          onBlur={() => {
            setPersistedFormData(values);
          }}>
          <PublisherSearch setFieldValue={value => setFieldValue('publisher', value)} />
          <Field name="isbn" component={TextField} variant="outlined" label={t('references.isbn')} />
        </Form>
      )}
    </Formik>
  );
};

export default BookReferenceForm;
