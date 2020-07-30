import LabelContentRow from '../../../components/LabelContentRow';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../../types/publication.types';

const SubmissionChapter: React.FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();
  const {
    isbn,
    reference: {
      publicationInstance: { pages },
    },
  } = values.entityDescription;

  return (
    <>
      <LabelContentRow label={t('chapter.anthology')}>{isbn}</LabelContentRow>
      <LabelContentRow label={t('references.pages_from')}>{pages.begin}</LabelContentRow>
      <LabelContentRow label={t('references.pages_to')}>{pages.end}</LabelContentRow>
    </>
  );
};

export default SubmissionChapter;
