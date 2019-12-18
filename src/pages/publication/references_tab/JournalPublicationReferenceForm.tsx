import React from 'react';
import { Field } from 'formik';
import { TextField, Select } from 'formik-material-ui';
import { MenuItem, Radio, FormControl, FormLabel, FormControlLabel, RadioGroup } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { journalPublicationTypes } from '../../../types/references.types';
import Journal from './Journal';
import styled from 'styled-components';
import PublicationChannelSearch from './PublicationChannelSearch';

const StyledArticleDetail = styled.div`
  display: grid;
  grid-template-columns: auto auto auto auto;
  grid-column-gap: 1rem;
`;

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
        {({ form: { setFieldValue } }: any) => {
          return <PublicationChannelSearch setFieldValue={setFieldValue} />;
        }}
      </Field>
      <Field name="reference.journalPublication.selectedJournal">
        {({ field, form: { setFieldValue } }: any) => {
          return <Journal journal={field.value} setFieldValue={setFieldValue} />;
        }}
      </Field>
      <StyledArticleDetail>
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
        <Field
          name="reference.journalPublication.pages_from"
          component={TextField}
          variant="outlined"
          label={t('references.pages_from')}
        />
        <Field
          name="reference.journalPublication.pages_to"
          component={TextField}
          variant="outlined"
          label={t('references.pages_to')}
        />
      </StyledArticleDetail>
      <>
        <Field name="reference.journalPublication.peer_review">
          {({ field }: any) => {
            return (
              <FormControl>
                <FormLabel>{t('references.peer_review')}</FormLabel>
                <RadioGroup>
                  <FormControlLabel
                    control={<Radio checked={field.value} value="yes" />}
                    label={t('references.is_peer_reviewed')}
                  />
                  <FormControlLabel
                    control={<Radio checked={field.value} value="no" />}
                    label={t('references.is_not_peer_reviewed')}
                  />
                </RadioGroup>
              </FormControl>
            );
          }}
        </Field>
      </>
    </>
  );
};

export default JournalPublicationReferenceForm;
