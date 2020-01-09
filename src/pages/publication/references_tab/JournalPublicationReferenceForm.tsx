import { Field, FormikProps, useFormikContext } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';

import { emptyPublisher, PublicationFormsData } from '../../../types/form.types';
import { JournalPublicationFieldNames, journalPublicationTypes } from '../../../types/references.types';
import { PublicationTableNumber } from '../../../utils/constants';
import JournalPublisherRow from './components/JournalPublisherRow';
import NviValidation from './components/NviValidation';
import PeerReview from './components/PeerReview';
import PublicationChannelSearch from './components/PublicationChannelSearch';

const StyledArticleDetail = styled.div`
  display: grid;
  grid-template-columns: auto auto auto auto auto auto;
  grid-column-gap: 1rem;
  align-content: center;
`;

const StyledLabel = styled.div`
  margin-top: 1rem;
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

  const isPeerReviewed = values.reference?.journalPublication?.peerReview;

  return (
    <>
      <Field name={JournalPublicationFieldNames.TYPE} variant="outlined" fullWidth>
        {({ field }: any) => (
          <FormControl variant="outlined" fullWidth>
            <InputLabel>{t('common:type')}</InputLabel>
            <Select {...field}>
              {journalPublicationTypes.map(type => (
                <MenuItem value={type.value} key={type.value}>
                  {t(type.label)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Field>

      <Field name={JournalPublicationFieldNames.DOI}>
        {({ field }: any) => <TextField variant="outlined" label={t('references.doi')} {...field} />}
      </Field>

      <Field name={JournalPublicationFieldNames.JOURNAL}>
        {({ field: { name, value } }: any) => (
          <>
            <PublicationChannelSearch
              clearSearchField={value === emptyPublisher}
              label={t('publication:references.journal')}
              publicationTable={PublicationTableNumber.PUBLICATION_CHANNELS}
              setValueFunction={inputValue => setFieldValue(name, inputValue ?? emptyPublisher)}
              value={value.title}
            />
            {value.title && (
              <JournalPublisherRow
                publisher={value}
                label={t('references.journal')}
                onClickDelete={() => setFieldValue(name, emptyPublisher)}
              />
            )}
          </>
        )}
      </Field>
      <StyledArticleDetail>
        <Field name={JournalPublicationFieldNames.VOLUME}>
          {({ field }: any) => <TextField variant="outlined" label={t('references.volume')} {...field} />}
        </Field>

        <Field name={JournalPublicationFieldNames.ISSUE}>
          {({ field }: any) => <TextField variant="outlined" label={t('references.issue')} {...field} />}
        </Field>

        <Field name={JournalPublicationFieldNames.PAGES_FROM}>
          {({ field }: any) => <TextField variant="outlined" label={t('references.pages_from')} {...field} />}
        </Field>

        <Field name={JournalPublicationFieldNames.PAGES_TO}>
          {({ field }: any) => <TextField variant="outlined" label={t('references.pages_to')} {...field} />}
        </Field>

        <StyledLabel>{t('references.or')}</StyledLabel>

        <Field name={JournalPublicationFieldNames.ARTICLE_NUMBER}>
          {({ field }: any) => <TextField variant="outlined" label={t('references.article_number')} {...field} />}
        </Field>
      </StyledArticleDetail>
      <StyledPeerReview>
        <PeerReview fieldName={JournalPublicationFieldNames.PEER_REVIEW} label={t('references.peer_review')} />
      </StyledPeerReview>
      <NviValidation isPeerReviewed={isPeerReviewed} isRated={!!isRatedJournal} />
    </>
  );
};

export default JournalPublicationReferenceForm;
