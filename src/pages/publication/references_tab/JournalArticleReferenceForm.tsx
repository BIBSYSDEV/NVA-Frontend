import { Field, FormikProps, useFormikContext, FieldProps } from 'formik';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { MenuItem, TextField } from '@material-ui/core';

import { Publication } from '../../../types/publication.types';
import { emptyPublisher, JournalArticleFieldNames, JournalArticleType } from '../../../types/references.types';
import { PublicationTableNumber } from '../../../utils/constants';
import NviValidation from './components/NviValidation';
import PeerReview from './components/PeerReview';
import PublicationChannelSearch from './components/PublicationChannelSearch';
import PublisherRow from './components/PublisherRow';

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

const JournalArticleReferenceForm: FC = () => {
  const { t } = useTranslation('publication');
  const { setFieldValue, values }: FormikProps<Publication> = useFormikContext();

  const isRatedJournal = values.reference?.journalArticle?.publisher?.level;
  const isPeerReviewed = values.reference?.journalArticle?.peerReview;

  return (
    <>
      <Field name={JournalArticleFieldNames.TYPE} variant="outlined">
        {({ field }: FieldProps) => (
          <TextField select variant="outlined" fullWidth label={t('common:type')} {...field}>
            {Object.values(JournalArticleType).map(typeValue => (
              <MenuItem value={typeValue} key={typeValue}>
                {t(`referenceTypes:subtypes_journal_article.${typeValue}`)}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Field>

      <Field name={JournalArticleFieldNames.DOI}>
        {({ field }: FieldProps) => <TextField variant="outlined" label={t('references.doi')} {...field} />}
      </Field>

      <Field name={JournalArticleFieldNames.PUBLISHER}>
        {({ field: { name, value } }: FieldProps) => (
          <>
            <PublicationChannelSearch
              clearSearchField={value === emptyPublisher}
              dataTestId="autosearch-journal"
              label={t('publication:references.journal')}
              publicationTable={PublicationTableNumber.PUBLICATION_CHANNELS}
              setValueFunction={inputValue => setFieldValue(name, inputValue ?? emptyPublisher)}
              placeholder={t('references.search_for_journal')}
            />
            {value.title && (
              <PublisherRow
                dataTestId="autosearch-results-journal"
                publisher={value}
                label={t('references.journal')}
                onClickDelete={() => setFieldValue(name, emptyPublisher)}
              />
            )}
          </>
        )}
      </Field>
      <StyledArticleDetail>
        <Field name={JournalArticleFieldNames.VOLUME}>
          {({ field }: FieldProps) => <TextField variant="outlined" label={t('references.volume')} {...field} />}
        </Field>

        <Field name={JournalArticleFieldNames.ISSUE}>
          {({ field }: FieldProps) => <TextField variant="outlined" label={t('references.issue')} {...field} />}
        </Field>

        <Field name={JournalArticleFieldNames.PAGES_FROM}>
          {({ field }: FieldProps) => <TextField variant="outlined" label={t('references.pages_from')} {...field} />}
        </Field>

        <Field name={JournalArticleFieldNames.PAGES_TO}>
          {({ field }: FieldProps) => <TextField variant="outlined" label={t('references.pages_to')} {...field} />}
        </Field>

        <StyledLabel>{t('references.or')}</StyledLabel>

        <Field name={JournalArticleFieldNames.ARTICLE_NUMBER}>
          {({ field }: FieldProps) => (
            <TextField variant="outlined" label={t('references.article_number')} {...field} />
          )}
        </Field>
      </StyledArticleDetail>
      <StyledPeerReview>
        <PeerReview fieldName={JournalArticleFieldNames.PEER_REVIEW} label={t('references.peer_review')} />
      </StyledPeerReview>
      <NviValidation isPeerReviewed={!!isPeerReviewed} isRated={!!isRatedJournal} dataTestId="nvi_journal" />
    </>
  );
};

export default JournalArticleReferenceForm;
