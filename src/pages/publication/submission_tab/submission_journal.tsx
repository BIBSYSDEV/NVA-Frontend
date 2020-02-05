import LabelContentRow from '../../../components/LabelContentRow';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../../types/publication.types';
import FormCardSubHeading from '../../../components/FormCard/FormCardSubHeading';

const SubmissionJournalPublication: React.FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();

  return (
    <>
      <FormCardSubHeading>{t('references.journal_publication')}</FormCardSubHeading>

      <LabelContentRow label={t('common:type')}>{values.reference.journalArticle?.type}</LabelContentRow>
      <LabelContentRow label={t('references.publisher')}>
        {values.reference.journalArticle?.publisher?.title}
      </LabelContentRow>

      <LabelContentRow label={t('references.volume')}>{values.reference.journalArticle?.volume}</LabelContentRow>
      <LabelContentRow label={t('references.issue')}>{values.reference.journalArticle?.issue}</LabelContentRow>
      <LabelContentRow label={t('references.pages_from')}>{values.reference.journalArticle?.pagesFrom}</LabelContentRow>
      <LabelContentRow label={t('references.pages_to')}>{values.reference.journalArticle?.pagesTo}</LabelContentRow>
      <LabelContentRow label={t('references.peer_reviewed')}>
        {values.reference.journalArticle?.peerReview}
      </LabelContentRow>
      <LabelContentRow label={t('references.doi')}>{values.reference.journalArticle?.link}</LabelContentRow>
      <LabelContentRow label={t('references.article_number')}>
        {values.reference.journalArticle?.articleNumber}
      </LabelContentRow>
    </>
  );
};

export default SubmissionJournalPublication;
