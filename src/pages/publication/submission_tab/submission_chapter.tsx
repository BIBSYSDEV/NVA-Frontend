import LabelContentRow from '../../../components/LabelContentRow';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../../types/publication.types';
import { Typography } from '@material-ui/core';

const SubmissionChapter: React.FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();

  return (
    <>
      <Typography variant="h3">{t('references.chapter')}</Typography>

      <LabelContentRow label={t('chapter.anthology')}>{values.reference.chapter?.anthology?.isbn}</LabelContentRow>
      <LabelContentRow label={t('chapter.link')}>{values.reference.chapter?.link}</LabelContentRow>
      <LabelContentRow label={t('references.pages_from')}>{values.reference.chapter?.pagesFrom}</LabelContentRow>
      <LabelContentRow label={t('references.pages_to')}>{values.reference.chapter?.pagesTo}</LabelContentRow>
    </>
  );
};

export default SubmissionChapter;
