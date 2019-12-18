import React from 'react';
import { Field, useFormikContext } from 'formik';
import { TextField, Select } from 'formik-material-ui';
import { MenuItem, Radio, FormControl, FormLabel, FormControlLabel, RadioGroup } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { journalPublicationTypes } from '../../../types/references.types';
import Journal from './Journal';
import styled from 'styled-components';
import PublicationChannelSearch from './PublicationChannelSearch';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';

const StyledArticleDetail = styled.div`
  display: grid;
  grid-template-columns: auto auto auto auto auto auto;
  grid-column-gap: 1rem;
  align-content: center;
`;

const StyledNVIValidation = styled.div`
  display: grid;
  grid-template-columns: 4rem auto;
  grid-template-areas:
    'icon header'
    'icon line1'
    'icon line2';
  background-color: ${({ theme }) => theme.palette.background.default};
`;

const StyledNVIHeader = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  grid-area: header;
`;

const StyledNVIInformation1 = styled.div`
  grid-area: line1;
`;

const StyledNVIInformation2 = styled.div`
  grid-area: line2;
`;

const StyledCheckCircleIcon = styled(CheckCircleIcon)`
  grid-area: icon;
  color: green;
  margin: 0.5rem;
  font-size: 2rem;
`;

const StyledCancelIcon = styled(CancelIcon)`
  grid-area: icon;
  color: red;
  margin: 0.5rem;
  font-size: 2rem;
`;

const JournalPublicationReferenceForm: React.FC = () => {
  const { t } = useTranslation('publication');
  const { values } = useFormikContext();

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
          name="reference.journalPublication.pagesFrom"
          component={TextField}
          variant="outlined"
          label={t('references.pages_from')}
        />
        <Field
          name="reference.journalPublication.pagesTo"
          component={TextField}
          variant="outlined"
          label={t('references.pages_to')}
        />
        <div>{t('references.or')}</div>
        <Field
          name="reference.journalPublicatoion.articleNumber"
          component={TextField}
          variant="outlined"
          label={t('references.article_number')}
          disabled={values.reference.journalPublication.pagesFrom || values.reference.journalPublication.pagesTo}
        />
      </StyledArticleDetail>
      <Field name="reference.journalPublication.peerReview">
        {({ field, form: { setFieldValue } }: any) => {
          return (
            <FormControl>
              <FormLabel>{t('references.peer_review')}</FormLabel>
              <RadioGroup value={field.value} onChange={event => setFieldValue(field.name, event.target.value)}>
                <FormControlLabel control={<Radio value="true" />} label={t('references.is_peer_reviewed')} />
                <FormControlLabel control={<Radio value="false" />} label={t('references.is_not_peer_reviewed')} />
              </RadioGroup>
            </FormControl>
          );
        }}
      </Field>
      {values.reference?.journalPublication?.selectedJournal && (
        <StyledNVIValidation>
          <StyledNVIHeader>{t('references.nvi_header')}</StyledNVIHeader>
          {(values.reference.journalPublication.selectedJournal.level &&
            values.reference.journalPublication.selectedJournal.level !== '0' &&
            values.reference.journalPublication.peerReview === 'true' && (
              <>
                <StyledCheckCircleIcon />
                <StyledNVIInformation1>{t('references.nvi_success')}</StyledNVIInformation1>
                <StyledNVIInformation2 />
              </>
            )) ||
            ((!values.reference.journalPublication.selectedJournal.level ||
              values.reference.journalPublication.selectedJournal.level === '0') && (
              <>
                <StyledCancelIcon />
                <StyledNVIInformation1>{t('references.nvi_fail_level_1')}</StyledNVIInformation1>
                <StyledNVIInformation2>{t('references.nvi_fail_level_2')}</StyledNVIInformation2>
              </>
            )) || (
              <>
                <StyledCancelIcon />
                <StyledNVIInformation1>{t('references.nvi_fail_no_peer_review')}</StyledNVIInformation1>
              </>
            )}
        </StyledNVIValidation>
      )}
    </>
  );
};

export default JournalPublicationReferenceForm;
