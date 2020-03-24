import LabelContentRow from '../../../components/LabelContentRow';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { FormikPublication } from '../../../types/publication.types';

const SubmissionBook: React.FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<FormikPublication> = useFormikContext();
  const {
    publicationSubtype,
    series,
    textBook,
    numberOfPages,
    isbn,
    reference: {
      publicationContext,
      publicationInstance: { peerReviewed },
    },
  } = values.entityDescription;

  return (
    <>
      <LabelContentRow label={t('references.subtype')}>
        {publicationSubtype && t(`referenceTypes:subtypes_book.${publicationSubtype}`)}
      </LabelContentRow>
      <LabelContentRow label={t('common:publisher')}>{publicationContext?.title}</LabelContentRow>
      <LabelContentRow label={t('references.peer_reviewed')}>
        {peerReviewed ? t('common:yes') : t('common:no')}
      </LabelContentRow>
      <LabelContentRow label={t('references.text_book')}>{textBook ? t('common:yes') : t('common:no')}</LabelContentRow>
      <LabelContentRow label={t('references.series')}>{series.title}</LabelContentRow>
      <LabelContentRow label={t('references.issn')}>{isbn}</LabelContentRow>
      <LabelContentRow label={t('references.number_of_pages')}>{numberOfPages}</LabelContentRow>
    </>
  );
};

export default SubmissionBook;
