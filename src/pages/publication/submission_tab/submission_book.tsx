import LabelContentRow from '../../../components/LabelContentRow';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../../types/publication.types';

const SubmissionBook: React.FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();
  const {
    series,
    textBook,
    isbn,
    reference: { publicationContext, publicationInstance },
  } = values.entityDescription;

  return (
    <>
      <LabelContentRow label={t('references.subtype')}>
        {publicationInstance.type && t(`publicationTypes:subtypes_book.${publicationInstance.type}`)}
      </LabelContentRow>
      <LabelContentRow label={t('common:publisher')}>{publicationContext?.title}</LabelContentRow>
      <LabelContentRow label={t('references.peer_reviewed')}>
        {publicationInstance.peerReviewed ? t('common:yes') : t('common:no')}
      </LabelContentRow>
      <LabelContentRow label={t('references.text_book')}>{textBook ? t('common:yes') : t('common:no')}</LabelContentRow>
      <LabelContentRow label={t('references.series')}>{series.title}</LabelContentRow>
      <LabelContentRow label={t('references.issn')}>{isbn}</LabelContentRow>
      {/* TODO <LabelContentRow label={t('references.number_of_pages')}>{numberOfPages}</LabelContentRow> */}
    </>
  );
};

export default SubmissionBook;
