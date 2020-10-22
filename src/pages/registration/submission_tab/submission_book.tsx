import LabelContentRow from '../../../components/LabelContentRow';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { Registration } from '../../../types/registration.types';
import { BookEntityDescription } from '../../../types/publication_types/bookRegistration.types';

const SubmissionBook: FC = () => {
  const { t } = useTranslation('registration');
  const { values }: FormikProps<Registration> = useFormikContext();
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
      <LabelContentRow label={t('references.is_book_a_textbook')}>
        {publicationInstance.textbookContent ? t('common:yes') : t('common:no')}
      </LabelContentRow>
      <LabelContentRow label={t('references.series')}>{publicationContext?.seriesTitle}</LabelContentRow>
      <LabelContentRow label={t('references.isbn')}>{publicationContext?.isbnList?.join(', ')}</LabelContentRow>
      <LabelContentRow label={t('references.number_of_pages')}>{publicationInstance?.pages?.pages}</LabelContentRow>
    </>
  );
};

export default SubmissionBook;
