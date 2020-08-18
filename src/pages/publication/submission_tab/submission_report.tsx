import LabelContentRow from '../../../components/LabelContentRow';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../../types/publication.types';
import { ReportEntityDescription } from '../../../types/publication_types/reportPublication.types';

const SubmissionReport: FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();

  const {
    reference: { publicationContext, publicationInstance },
  } = values.entityDescription as ReportEntityDescription;

  return (
    <>
      <LabelContentRow label={t('references.subtype')}>
        {publicationInstance.type && t(`publicationTypes:${publicationInstance.type}`)}
      </LabelContentRow>
      <LabelContentRow label={t('common:publisher')}>{publicationContext?.publisher}</LabelContentRow>
      {/* TODO <LabelContentRow label={t('references.isbn')}>{isbn}</LabelContentRow> */}
      <LabelContentRow label={t('references.series')}>{publicationContext?.seriesTitle}</LabelContentRow>
      <LabelContentRow label={t('references.number_of_pages')}>{publicationInstance?.pages?.pages}</LabelContentRow>
    </>
  );
};

export default SubmissionReport;
