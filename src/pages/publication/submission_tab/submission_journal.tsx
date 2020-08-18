import LabelContentRow from '../../../components/LabelContentRow';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { Publication, PagesRange } from '../../../types/publication.types';
import { JournalEntityDescription } from '../../../types/publication_types/journalPublication.types';

const SubmissionJournalPublication: FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();

  const {
    reference: {
      publicationInstance: { type, volume, issue, articleNumber, peerReviewed },
      publicationContext,
    },
  } = values.entityDescription as JournalEntityDescription;

  const pages = values.entityDescription.reference.publicationInstance.pages as PagesRange;

  return (
    <>
      <LabelContentRow label={t('references.subtype')}>{type && t(`publicationTypes:${type}`)}</LabelContentRow>
      <LabelContentRow label={t('references.journal')}>{publicationContext?.title}</LabelContentRow>
      <LabelContentRow label={t('references.volume')}>{volume}</LabelContentRow>
      <LabelContentRow label={t('references.issue')}>{issue}</LabelContentRow>
      <LabelContentRow label={t('references.pages_from')}>{pages?.begin}</LabelContentRow>
      <LabelContentRow label={t('references.pages_to')}>{pages?.end}</LabelContentRow>
      <LabelContentRow label={t('references.article_number')}>{articleNumber}</LabelContentRow>
      <LabelContentRow label={t('references.peer_reviewed')}>
        {peerReviewed ? t('common:yes') : t('common:no')}
      </LabelContentRow>
    </>
  );
};

export default SubmissionJournalPublication;
