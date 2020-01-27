import LabelContentLine from '../../../components/LabelContentLine';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../../types/publication.types';

const SubmissionChapterPresentation: React.FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();

  return (
    <>
      <p>{t('references.chapter')}</p>
      <LabelContentLine label={t('chapter.anthology')}>{values.reference.chapter?.anthology?.isbn}</LabelContentLine>
      <LabelContentLine label={t('chapter.link')}>{values.reference.chapter?.link}</LabelContentLine>
      <LabelContentLine label={t('references.pages_from')}>{values.reference.chapter?.pagesFrom}</LabelContentLine>
      <LabelContentLine label={t('references.pages_to')}>{values.reference.chapter?.pagesTo}</LabelContentLine>
    </>
  );
};

export default SubmissionChapterPresentation;
