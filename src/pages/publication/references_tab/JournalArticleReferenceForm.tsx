import { Field, FormikProps, useFormikContext, FieldProps } from 'formik';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TextField } from '@material-ui/core';

import { FormikPublication } from '../../../types/publication.types';
import { JournalArticleFieldNames, JournalArticleType } from '../../../types/references.types';
import { PublicationTableNumber } from '../../../utils/constants';
import NviValidation from './components/NviValidation';
import PeerReview from './components/PeerReview';
import DoiField from './components/DoiField';
import SelectTypeField from './components/SelectTypeField';
import PublisherField from './components/PublisherField';

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
  const { values }: FormikProps<FormikPublication> = useFormikContext();

  const isRatedJournal = values.entityDescription.publisher?.level;
  const isPeerReviewed = values.entityDescription.peerReview;

  return (
    <>
      <SelectTypeField
        fieldName={JournalArticleFieldNames.SUB_TYPE}
        options={Object.values(JournalArticleType)}
        i18nKeyPrefix="referenceTypes:subtypes_journal_article."
      />

      <DoiField />

      <PublisherField
        fieldName={JournalArticleFieldNames.PUBLISHER}
        publicationTable={PublicationTableNumber.PUBLICATION_CHANNELS}
        label={t('references.journal')}
        placeholder={t('references.search_for_journal')}
      />

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
