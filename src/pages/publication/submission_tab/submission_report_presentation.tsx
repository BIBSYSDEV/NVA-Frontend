import LabelContentLine from '../../../components/LabelContentLine';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../../types/publication.types';

const SubmissionReportPresentation: React.FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();

  return (
    <>
      <p>{t('references.report')}</p>
      <LabelContentLine label={t('common:type')}>{values.reference.report?.type}</LabelContentLine>
      <LabelContentLine label={t('references.publisher')}>{values.reference.report?.publisher?.title}</LabelContentLine>
      <LabelContentLine label={t('references.isbn')}>{values.reference.report?.isbn}</LabelContentLine>
      <LabelContentLine label={t('references.series')}>{values.reference.report?.series?.title}</LabelContentLine>
      <LabelContentLine label={t('references.number_of_pages')}>
        {values.reference.report?.numberOfPages}
      </LabelContentLine>
    </>
  );
};

export default SubmissionReportPresentation;
