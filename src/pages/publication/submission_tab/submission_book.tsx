import LabelContentRow from '../../../components/LabelContentRow';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../../types/publication.types';
import { BookEntityDescription } from '../../../types/publication_types/bookPublication.types';

const SubmissionBook: FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();
  const {
    reference: { publicationContext, publicationInstance },
  } = values.entityDescription as BookEntityDescription;

  return (
    <>
      <LabelContentRow label={t('references.subtype')}>
        {publicationInstance.type && t(`publicationTypes:${publicationInstance.type}`)}
      </LabelContentRow>
      <LabelContentRow label={t('common:publisher')}>{publicationContext?.publisher}</LabelContentRow>
      <LabelContentRow label={t('references.peer_reviewed')}>
        {publicationInstance.peerReviewed ? t('common:yes') : t('common:no')}
      </LabelContentRow>
      <LabelContentRow label={t('references.series')}>{publicationContext?.seriesTitle}</LabelContentRow>
      {/* TODO <LabelContentRow label={t('references.issn')}>{isbn}</LabelContentRow> */}
      <LabelContentRow label={t('references.number_of_pages')}>{publicationInstance?.pages?.pages}</LabelContentRow>
    </>
  );
};

export default SubmissionBook;
