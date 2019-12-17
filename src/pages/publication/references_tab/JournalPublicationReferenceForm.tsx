import React from 'react';
import { Field } from 'formik';
import { TextField, Select } from 'formik-material-ui';
import { MenuItem, Checkbox, FormControl, FormLabel, FormGroup, FormControlLabel } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { journalPublicationTypes } from '../../../types/references.types';
import Journal from './Journal';

const JournalPublicationReferenceForm: React.FC = () => {
  const { t } = useTranslation('publication');

  return (
    <>
      <Field name="reference.journalPublication.type" component={Select} variant="outlined" fullWidth>
        {journalPublicationTypes.map(type => (
          <MenuItem value={type.value} key={type.value}>
            {t(type.label)}
          </MenuItem>
        ))}
      </Field>
      <Field
        name="reference.journalPublication.doi"
        component={TextField}
        variant="outlined"
        label={t('references.doi')}
      />
      <Field name="reference.journalPublication.journal">
        {({ field }: any) => {
          return <Journal journal={field.value} />;
        }}
      </Field>
      <Field
        name="reference.journalPublication.volume"
        component={TextField}
        variant="outlined"
        label={t('references.volume')}
      />
      <Field
        name="reference.journalPublication.issue"
        component={TextField}
        variant="outlined"
        label={t('references.issue')}
      />
      <Field name="reference.journalPublication.peer_review">
        {({ field }: any) => {
          return (
            <FormControl>
              <FormLabel>{t('references.peer_review')}</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={field.value} value="true" />}
                  label={t('references.is_peer_reviewed')}
                />
                <FormControlLabel
                  control={<Checkbox checked={field.value} value="false" />}
                  label={t('references.is_not_peer_reviewed')}
                />
              </FormGroup>
            </FormControl>
          );
        }}
      </Field>
    </>
  );
};

export default JournalPublicationReferenceForm;
