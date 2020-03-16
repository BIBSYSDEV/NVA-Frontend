import LabelContentRow from '../../../components/LabelContentRow';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../../types/publication.types';

const SubmissionDegree: React.FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();

  return (
    <>
      <LabelContentRow label={t('common:type')}>{t('referenceTypes:Degree')}</LabelContentRow>
      <LabelContentRow label={t('references.subtype')}>
        {values.reference.degree?.type && t(`referenceTypes:subtypes_degree.${values.reference.degree.type}`)}
      </LabelContentRow>
      <LabelContentRow label={t('common:publisher')}>{values.reference.degree?.publisher?.title}</LabelContentRow>
      <LabelContentRow label={t('references.specialization')}>
        {values.reference.degree?.specialization}
      </LabelContentRow>
      <LabelContentRow label={t('references.series')}>{values.reference.degree?.series?.title}</LabelContentRow>
    </>
  );
};

export default SubmissionDegree;
