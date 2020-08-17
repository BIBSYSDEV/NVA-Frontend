import LabelContentRow from '../../../components/LabelContentRow';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../../types/publication.types';
import { ReportEntityDescription } from '../../../types/publication_types/report.publication.types';

const SubmissionReport: React.FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();

  const {
    reference: { publicationContext, publicationInstance },
  } = values.entityDescription as ReportEntityDescription;

  return (
    <>
      <LabelContentRow label={t('references.subtype')}>
        {publicationInstance.type && t(`publicationTypes:subtypes_report.${publicationInstance.type}`)}
      </LabelContentRow>
      <LabelContentRow label={t('common:publisher')}>{publicationContext?.publisher}</LabelContentRow>
      {/* TODO <LabelContentRow label={t('references.isbn')}>{isbn}</LabelContentRow> */}
      {/* TODO <LabelContentRow label={t('references.series')}>{series.title}</LabelContentRow> */}
      {/* TODO <LabelContentRow label={t('references.number_of_pages')}>{numberOfPages}</LabelContentRow> */}
    </>
  );
};

export default SubmissionReport;
