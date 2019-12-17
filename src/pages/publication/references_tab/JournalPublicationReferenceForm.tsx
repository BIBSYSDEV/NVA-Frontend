import React from 'react';
import { Field } from 'formik';
import { TextField, Select } from 'formik-material-ui';
import { MenuItem } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { journalPublicationTypes, journalPublicationFieldNames } from '../../../types/references.types';

const JournalPublicationReferenceForm: React.FC = () => {
  const { t } = useTranslation('publication');

  return (
    <>
      <Field name={journalPublicationFieldNames.TYPE} component={Select} variant="outlined" fullWidth>
        {journalPublicationTypes.map(type => (
          <MenuItem value={type.value} key={type.value}>
            {t(type.label)}
          </MenuItem>
        ))}
      </Field>

      <Field
        name={journalPublicationFieldNames.DOI}
        component={TextField}
        variant="outlined"
        label={t('references.doi')}
      />
    </>
  );
};

export default JournalPublicationReferenceForm;
