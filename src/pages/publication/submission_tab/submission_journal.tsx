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
    peerReview,
    reference: {
      publicationInstance: { volume, issue, pages, articleNumber },
      publicationContext,
    },
  } = values.entityDescription;

  return (
    <>
      <LabelContentRow label={t('references.subtype')}>
        {publicationSubtype && t(`referenceTypes:${publicationSubtype}`)}
      </LabelContentRow>
      <LabelContentRow label={t('common:publisher')}>{publicationContext?.title}</LabelContentRow>
      <LabelContentRow label={t('references.volume')}>{volume}</LabelContentRow>
      <LabelContentRow label={t('references.issue')}>{issue}</LabelContentRow>
      <LabelContentRow label={t('references.pages_from')}>{pages.begin}</LabelContentRow>
      <LabelContentRow label={t('references.pages_to')}>{pages.end}</LabelContentRow>
      <LabelContentRow label={t('references.article_number')}>{articleNumber}</LabelContentRow>
      <LabelContentRow label={t('references.peer_reviewed')}>
        {peerReview ? t('common:yes') : t('common:no')}
      </LabelContentRow>
    </>
  );
};

export default SubmissionJournalPublication;
