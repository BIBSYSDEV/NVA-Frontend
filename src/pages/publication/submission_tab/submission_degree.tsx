import LabelContentRow from '../../../components/LabelContentRow';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { FormikPublication } from '../../../types/publication.types';

const SubmissionDegree: React.FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<FormikPublication> = useFormikContext();

  const { publicationSubtype, publisher, specialization, series } = values.entityDescription;

  return (
    <>
      <LabelContentRow label={t('references.subtype')}>
        {publicationSubtype && t(`referenceTypes:subtypes_degree.${publicationSubtype}`)}
      </LabelContentRow>
      <LabelContentRow label={t('common:publisher')}>{publisher.title}</LabelContentRow>
      <LabelContentRow label={t('references.specialization')}>{specialization}</LabelContentRow>
      <LabelContentRow label={t('references.series')}>{series.title}</LabelContentRow>
    </>
  );
};

export default SubmissionDegree;
