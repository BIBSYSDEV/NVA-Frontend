import LabelContentLine from '../../../components/LabelContentLine';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../../types/publication.types';
import { Typography } from '@material-ui/core';

const SubmissionJournalPublicationPresentation: React.FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();

  return (
    <>
      <Typography variant="h3">{t('references.journal_publication')}</Typography>

      <LabelContentLine label={t('common:type')}>{values.reference.journalArticle?.type}</LabelContentLine>
      <LabelContentLine label={t('reference.publisher')}>
        {values.reference.journalArticle?.journal?.title}
      </LabelContentLine>

      <LabelContentLine label={t('references.volume')}>{values.reference.journalArticle?.volume}</LabelContentLine>
      <LabelContentLine label={t('references.issue')}>{values.reference.journalArticle?.issue}</LabelContentLine>
      <LabelContentLine label={t('references.pages_from')}>
        {values.reference.journalArticle?.pagesFrom}
      </LabelContentLine>
      <LabelContentLine label={t('references.pages_to')}>{values.reference.journalArticle?.pagesTo}</LabelContentLine>
      <LabelContentLine label={t('references.peer_review')}>
        {values.reference.journalArticle?.peerReview}
      </LabelContentLine>
      <LabelContentLine label={t('references.doi')}>{values.reference.journalArticle?.link}</LabelContentLine>
      <LabelContentLine label={t('references:article_number')}>
        {values.reference.journalArticle?.articleNumber}
      </LabelContentLine>
    </>
  );
};

export default SubmissionJournalPublicationPresentation;
