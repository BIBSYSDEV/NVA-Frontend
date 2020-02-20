import LabelContentRow from '../../../components/LabelContentRow';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../../types/publication.types';

const SubmissionJournalPublication: React.FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();

  return (
    <>
      <LabelContentRow label={t('common:type')}>{t('referenceTypes:journalArticle')}</LabelContentRow>
      <LabelContentRow label={t('references.subtype')}>
        {t(`referenceTypes:subtypes_journal_article.${values.reference.journalArticle?.type}`)}
      </LabelContentRow>
      <LabelContentRow label={t('common:publisher')}>
        {values.reference.journalArticle?.publisher?.title}
      </LabelContentRow>
      <LabelContentRow label={t('references.volume')}>{values.reference.journalArticle?.volume}</LabelContentRow>
      <LabelContentRow label={t('references.issue')}>{values.reference.journalArticle?.issue}</LabelContentRow>
      <LabelContentRow label={t('references.pages_from')}>{values.reference.journalArticle?.pagesFrom}</LabelContentRow>
      <LabelContentRow label={t('references.pages_to')}>{values.reference.journalArticle?.pagesTo}</LabelContentRow>
      <LabelContentRow label={t('references.peer_reviewed')}>
        {values.reference.journalArticle?.peerReview ? t('common:yes') : t('common:no')}
      </LabelContentRow>
      <LabelContentRow label={t('references.doi')}>{values.reference.journalArticle?.link}</LabelContentRow>
      <LabelContentRow label={t('references.article_number')}>
        {values.reference.journalArticle?.articleNumber}
      </LabelContentRow>
    </>
  );
};

export default SubmissionJournalPublication;
