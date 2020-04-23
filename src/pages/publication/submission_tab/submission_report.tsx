import LabelContentRow from '../../../components/LabelContentRow';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { FormikPublication } from '../../../types/publication.types';

const SubmissionReport: React.FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<FormikPublication> = useFormikContext();

  const {
    isbn,
    series,
    numberOfPages,
    reference: { publicationContext, publicationInstance },
  } = values.entityDescription;

  return (
    <>
      <LabelContentRow label={t('references.subtype')}>
        {publicationInstance.type && t(`publicationTypes:subtypes_report.${publicationInstance.type}`)}
      </LabelContentRow>
      <LabelContentRow label={t('common:publisher')}>{publicationContext?.title}</LabelContentRow>
      <LabelContentRow label={t('references.isbn')}>{isbn}</LabelContentRow>
      <LabelContentRow label={t('references.series')}>{series.title}</LabelContentRow>
      <LabelContentRow label={t('references.number_of_pages')}>{numberOfPages}</LabelContentRow>
    </>
  );
};

export default SubmissionReport;
