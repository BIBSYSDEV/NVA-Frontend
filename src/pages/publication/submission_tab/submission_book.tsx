import LabelContentRow from '../../../components/LabelContentRow';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../../types/publication.types';

const SubmissionBook: React.FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();

  return (
    <>
      <LabelContentRow label={t('common:type')}>{t('referenceTypes:book')}</LabelContentRow>
      <LabelContentRow label={t('references.subtype')}>
        {values.reference.book?.type && t(`referenceTypes:subtypes_book.${values.reference.book?.type}`)}
      </LabelContentRow>
      <LabelContentRow label={t('common:publisher')}>{values.reference.book?.publisher?.title}</LabelContentRow>
      <LabelContentRow label={t('references.peer_reviewed')}>
        {values.reference.book?.peerReview ? t('common:yes') : t('common:no')}
      </LabelContentRow>
      <LabelContentRow label={t('references.text_book')}>
        {values.reference.book?.textBook ? t('common:yes') : t('common:no')}
      </LabelContentRow>
      <LabelContentRow label={t('references.series')}>{values.reference.book?.series?.title}</LabelContentRow>
      <LabelContentRow label={t('references.issn')}>{values.reference.book?.isbn}</LabelContentRow>
      <LabelContentRow label={t('references.number_of_pages')}>{values.reference.book?.numberOfPages}</LabelContentRow>
    </>
  );
};

export default SubmissionBook;
