import LabelContentRow from '../../../components/LabelContentRow';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../../types/publication.types';
import { Typography } from '@material-ui/core';

const SubmissionDegree: React.FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();

  return (
    <>
      <Typography variant="h3">{t('references.degree')}</Typography>

      <LabelContentRow label={t('common:type')}>{values.reference.degree?.type}</LabelContentRow>
      <LabelContentRow label={t('references.publisher')}>{values.reference.degree?.publisher?.title}</LabelContentRow>
      <LabelContentRow label={t('references.specialization')}>
        {values.reference.degree?.specialization}
      </LabelContentRow>
      <LabelContentRow label={t('references.series')}>{values.reference.degree?.series?.title}</LabelContentRow>
    </>
  );
};

export default SubmissionDegree;
