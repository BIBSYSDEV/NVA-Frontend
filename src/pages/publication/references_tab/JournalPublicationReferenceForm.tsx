import { Field, FormikProps, useFormikContext } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import InfoIcon from '@material-ui/icons/Info';

import { PublicationFormsData } from '../../../types/form.types';
import { journalPublicationFieldNames, journalPublicationTypes } from '../../../types/references.types';
import { PublicationTableNumber } from '../../../utils/constants';
import JournalPublisherRow from './components/JournalPublisherRow';
import PeerReview from './components/PeerReview';
import PublicationChannelSearch from './PublicationChannelSearch';

const StyledArticleDetail = styled.div`
  display: grid;
  grid-template-columns: auto auto auto auto auto auto;
  grid-column-gap: 1rem;
  align-content: center;
`;

const StyledNviValidation = styled.div`
  margin-top: 0.7rem;
  display: grid;
  grid-template-columns: 4rem auto;
  grid-template-areas:
    'icon header'
    'icon information';
  background-color: ${({ theme }) => theme.palette.background.default};
`;

const StyledNviHeader = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  grid-area: header;
`;

const StyledNviInformation = styled.div`
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

const StyledLabel = styled.div`
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
  const { setFieldValue, values }: FormikProps<PublicationFormsData> = useFormikContext();

  const isRatedJournal =
    values.reference?.journalPublication?.journal?.level && values.reference.journalPublication.journal.level !== '0';

  const isPeerReviewed = values.reference.journalPublication.peerReview;

  return (
    <>
      <Field name={journalPublicationFieldNames.TYPE} variant="outlined" fullWidth>
        {({ field: { onChange, value } }: any) => (
          <FormControl variant="outlined" fullWidth>
            <InputLabel>{t('common:type')}</InputLabel>
            <Select value={value} onChange={onChange(journalPublicationFieldNames.TYPE, value)}>
              {journalPublicationTypes.map(type => (
                <MenuItem value={type.value} key={type.value}>
                  {t(type.label)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Field>

      <Field
        name={journalPublicationFieldNames.DOI}
        component={(props: any) => <TextField fullWidth {...props} />}
        variant="outlined"
        label={t('references.doi')}
      />
      <StyledNewJournal>
        <StyledInfoIcon />
        {t('references.journal_not_found')}
      </StyledNewJournal>
      <Field name="reference.journalPublication.journal">
        {({ field }: any) => (
          <>
            <PublicationChannelSearch
              label={t('publication:references.journal')}
              publicationTable={PublicationTableNumber.PUBLICATION_CHANNELS}
              setValueFunction={value => setFieldValue('reference.journalPublication.journal', value)}
            />
            {field.value && (
              <JournalPublisherRow
                publisher={field.value}
                label={t('references.journal')}
                setValue={value => setFieldValue(field.name, value)}
              />
            )}
          </>
        )}
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
        <StyledLabel>{t('references.or')}</StyledLabel>
        <Field
          name="reference.journalPublication.articleNumber"
          component={TextField}
          variant="outlined"
          label={t('references.article_number')}
        />
      </StyledArticleDetail>
      <StyledPeerReview>
        <Field name="reference.journalPublication.peerReview">
          {({ field }: any) => (
            <PeerReview field={field} label={t('references.peer_review')} setFieldValue={setFieldValue} />
          )}
        </Field>
      </StyledPeerReview>
      {values.reference?.journalPublication?.journal && (
        <StyledNviValidation>
          <StyledNviHeader>{t('references.nvi_header')}</StyledNviHeader>
          {isRatedJournal ? (
            isPeerReviewed ? (
              <>
                <StyledCheckCircleIcon />
                <StyledNviInformation>{t('references.nvi_success')}</StyledNviInformation>
              </>
            ) : (
              <>
                <StyledCancelIcon />
                <StyledNviInformation>{t('references.nvi_fail_no_peer_review')}</StyledNviInformation>
              </>
            )
          ) : (
            <>
              <StyledCancelIcon />
              <StyledNviInformation>
                <div>{t('references.nvi_fail_rated_line1')}</div>
                <div>{t('references.nvi_fail_rated_line2')}</div>
              </StyledNviInformation>
            </>
          )}
        </StyledNviValidation>
      )}
    </>
  );
};

export default JournalPublicationReferenceForm;
