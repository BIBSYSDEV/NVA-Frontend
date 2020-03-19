import LabelContentRow from '../../../components/LabelContentRow';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { FormikPublication } from '../../../types/publication.types';

const SubmissionJournalPublication: React.FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<FormikPublication> = useFormikContext();

  const {
    publicationSubtype,
    publisher,
    volume,
    issue,
    pagesFrom,
    pagesTo,
    peerReview,
    articleNumber,
  } = values.entityDescription;

  return (
    <>
      <LabelContentRow label={t('references.subtype')}>
        {publicationSubtype && t(`referenceTypes:subtypes_journal_article.${publicationSubtype}`)}
      </LabelContentRow>
      <LabelContentRow label={t('common:publisher')}>{publisher.title}</LabelContentRow>
      <LabelContentRow label={t('references.volume')}>{volume}</LabelContentRow>
      <LabelContentRow label={t('references.issue')}>{issue}</LabelContentRow>
      <LabelContentRow label={t('references.pages_from')}>{pagesFrom}</LabelContentRow>
      <LabelContentRow label={t('references.pages_to')}>{pagesTo}</LabelContentRow>
      <LabelContentRow label={t('references.article_number')}>{articleNumber}</LabelContentRow>
      <LabelContentRow label={t('references.peer_reviewed')}>
        {peerReview ? t('common:yes') : t('common:no')}
      </LabelContentRow>
    </>
  );
};

export default SubmissionJournalPublication;
