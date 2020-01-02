import React from 'react';
import { Field, useFormikContext } from 'formik';
import { TextField, Select } from 'formik-material-ui';
import { MenuItem, Radio, FormControl, FormLabel, FormControlLabel, RadioGroup } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { journalPublicationTypes, journalPublicationFieldNames } from '../../../types/references.types';
import Journal from './Journal';
import styled from 'styled-components';
import PublicationChannelSearch from './PublicationChannelSearch';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import InfoIcon from '@material-ui/icons/Info';

const StyledArticleDetail = styled.div`
  display: grid;
  grid-template-columns: auto auto auto auto auto auto;
  grid-column-gap: 1rem;
  align-content: center;
`;

const StyledNVIValidation = styled.div`
  margin-top: 0.7rem;
  display: grid;
  grid-template-columns: 4rem auto;
  grid-template-areas:
    'icon header'
    'icon information';
  background-color: ${({ theme }) => theme.palette.background.default};
`;

const StyledNVIHeader = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  grid-area: header;
`;

const StyledNVIInformation = styled.div`
  grid-area: information;
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

const StyledInfoIcon = styled(InfoIcon)`
  font-size: small;
  margin-right: 0.3rem;
  margin-left: 0.3rem;
  color: ${({ theme }) => theme.palette.primary.main};
`;

const StyledNewJournal = styled.div`
  font-size: 0.7rem;
  margin-top: 0.7rem;
  text-align: right;
  align-items: center;
  color: ${({ theme }) => theme.palette.primary.main};
  width: 100%;
`;

const StyledOrLabel = styled.div`
  align-self: center;
  justify-self: center;
`;

const StyledPeerReview = styled.div`
  margin-top: 0.7rem;
  padding-top: 0.7rem;
  padding-left: 0.7rem;
  background-color: ${({ theme }) => theme.palette.background.default};
`;

const JournalPublicationReferenceForm: React.FC = () => {
  const { t } = useTranslation('publication');
  const { values } = useFormikContext();

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
      <StyledNewJournal>
        <StyledInfoIcon />
        {t('references.journal_not_found')}
      </StyledNewJournal>
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
          disabled={!!values.reference.journalPublication.articleNumber}
        />
        <Field
          name="reference.journalPublication.pagesTo"
          component={TextField}
          variant="outlined"
          label={t('references.pages_to')}
          disabled={!!values.reference.journalPublication.articleNumber}
        />
        <StyledOrLabel>{t('references.or')}</StyledOrLabel>
        <Field
          name="reference.journalPublication.articleNumber"
          component={TextField}
          variant="outlined"
          label={t('references.article_number')}
          disabled={!!values.reference.journalPublication.pagesFrom || !!values.reference.journalPublication.pagesTo}
        />
      </StyledArticleDetail>
      <StyledPeerReview>
        <Field name="reference.journalPublication.peerReview">
          {({ field, form: { setFieldValue } }: any) => {
            return (
              <FormControl>
                <FormLabel>
                  {t('references.peer_review')}
                  <StyledInfoIcon />
                </FormLabel>
                <RadioGroup value={field.value} onChange={event => setFieldValue(field.name, event.target.value)}>
                  <FormControlLabel control={<Radio value="true" />} label={t('references.is_peer_reviewed')} />
                  <FormControlLabel control={<Radio value="false" />} label={t('references.is_not_peer_reviewed')} />
                </RadioGroup>
              </FormControl>
            );
          }}
        </Field>
      </StyledPeerReview>
      {values.reference?.journalPublication?.selectedJournal && (
        <StyledNVIValidation>
          <StyledNVIHeader>{t('references.nvi_header')}</StyledNVIHeader>
          {(values.reference.journalPublication.selectedJournal.level &&
            values.reference.journalPublication.selectedJournal.level !== '0' &&
            values.reference.journalPublication.peerReview === 'true' && (
              <>
                <StyledCheckCircleIcon />
                <StyledNVIInformation>{t('references.nvi_success')}</StyledNVIInformation>
              </>
            )) ||
            ((!values.reference.journalPublication.selectedJournal.level ||
              values.reference.journalPublication.selectedJournal.level === '0') && (
              <>
                <StyledCancelIcon />
                <StyledNVIInformation>
                  <div>{t('references.nvi_fail_level_line1')}</div>
                  <div>{t('references.nvi_fail_level_line2')}</div>
                </StyledNVIInformation>
              </>
            )) || (
              <>
                <StyledCancelIcon />
                <StyledNVIInformation>{t('references.nvi_fail_no_peer_review')}</StyledNVIInformation>
              </>
            )}
        </StyledNVIValidation>
      )}
    </>
  );
};

export default JournalPublicationReferenceForm;
