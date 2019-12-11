import React from 'react';
import { Field } from 'formik';
import { TextField } from 'formik-material-ui';
import PublisherSearch from './PublisherSearch';
import { useTranslation } from 'react-i18next';

const BookReferenceForm: React.FC = () => {
  const { t } = useTranslation('publication');

  return (
    <>
      <Field name="reference.book.publisher">
        {({ form: { setFieldValue } }: any) => (
          <PublisherSearch setFieldValue={value => setFieldValue('book.publisher', value)} />
        )}
      </Field>

      <Field name="reference.book.isbn" component={TextField} variant="outlined" label={t('references.isbn')} />
    </>
  );
};

export default BookReferenceForm;
