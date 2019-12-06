import React from 'react';
import { Formik, Form, Field } from 'formik';
import { TextField, Select } from 'formik-material-ui';
import { MenuItem } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import useFormPersistor from '../../../utils/hooks/useFormPersistor';
import { emptyJournalPublicationReferenceFormData } from '../../../types/form.types';
import { journalPublicationTypes } from '../../../types/references.types';

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
            {journalPublicationTypes.map(type => (
              <MenuItem value={type.value} key={type.value}>
                {t(type.label)}
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
