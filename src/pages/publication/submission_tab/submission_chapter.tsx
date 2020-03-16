import LabelContentRow from '../../../components/LabelContentRow';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../../types/publication.types';

const SubmissionChapter: React.FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();

  return (
    <>
      <LabelContentRow label={t('common:type')}>{t('referenceTypes:Chapter')}</LabelContentRow>
      <LabelContentRow label={t('chapter.anthology')}>{values.reference.chapter?.anthology?.isbn}</LabelContentRow>
      <LabelContentRow label={t('chapter.link')}>{values.reference.chapter?.link}</LabelContentRow>
      <LabelContentRow label={t('references.pages_from')}>{values.reference.chapter?.pagesFrom}</LabelContentRow>
      <LabelContentRow label={t('references.pages_to')}>{values.reference.chapter?.pagesTo}</LabelContentRow>
    </>
  );
};

export default SubmissionChapter;
