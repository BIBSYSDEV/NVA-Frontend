import React from 'react';
import { Formik, Form, Field } from 'formik';
import { TextField, Select } from 'formik-material-ui';
import { MenuItem } from '@material-ui/core';
import useFormPersistor from '../../../utils/hooks/useFormPersistor';
import { emptyJournalPublicationReferenceFormData } from '../../../types/form.types';
import { useTranslation } from 'react-i18next';

// enum with translation keys
enum JournalPublicationTypes {
  ARTICLE = 'references.article_type',
  REVIEW = 'references.review_type',
}

const JournalPublicationReferenceForm: React.FC = () => {
  const { t } = useTranslation('publication');
  const [persistedFormData, setPersistedFormData] = useFormPersistor(
    'publicationJournalPublicationReference',
    emptyJournalPublicationReferenceFormData
  );

  return (
    <Formik initialValues={persistedFormData} onSubmit={() => {}}>
      {({ values }) => (
        <Form onBlur={() => setPersistedFormData(values)}>
          <Field name="type" component={Select} variant="outlined" fullWidth>
            {Object.values(JournalPublicationTypes).map(type => (
              <MenuItem value={type} key={type}>
                {t(type)}
              </MenuItem>
            ))}
          </Field>
          <Field name="doi" component={TextField} variant="outlined" label={t('references.doi')} />
        </Form>
      )}
    </Formik>
  );
};

export default JournalPublicationReferenceForm;
