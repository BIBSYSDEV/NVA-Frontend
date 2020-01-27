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
      <LabelContentLine label={t('reference:publisher')}>
        {values.reference.journalArticle?.journal?.title}
      </LabelContentLine>

      <LabelContentLine label={t('reference:volume')}>{values.reference.journalArticle?.volume}</LabelContentLine>
      <LabelContentLine label={t('reference:issue')}>{values.reference.journalArticle?.issue}</LabelContentLine>
      <LabelContentLine label={t('reference:pagesFrom')}>{values.reference.journalArticle?.pagesFrom}</LabelContentLine>
      <LabelContentLine label={t('reference:pagesTo')}>{values.reference.journalArticle?.pagesTo}</LabelContentLine>
      <LabelContentLine label={t('reference:peer_review')}>
        {values.reference.journalArticle?.peerReview}
      </LabelContentLine>
      <LabelContentLine label={t('reference:doi')}>{values.reference.journalArticle?.link}</LabelContentLine>
      <LabelContentLine label={t('reference:type')}>{values.reference.journalArticle?.articleNumber}</LabelContentLine>
    </>
  );
};

export default SubmissionJournalPublicationPresentation;
