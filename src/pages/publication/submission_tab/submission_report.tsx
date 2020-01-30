import LabelContentRow from '../../../components/LabelContentRow';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../../types/publication.types';
import { Typography } from '@material-ui/core';

const SubmissionReport: React.FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();

  return (
    <>
      <Typography variant="h3">{t('references.report')}</Typography>

      <LabelContentRow label={t('common:type')}>{values.reference.report?.type}</LabelContentRow>
      <LabelContentRow label={t('references.publisher')}>{values.reference.report?.publisher?.title}</LabelContentRow>
      <LabelContentRow label={t('references.isbn')}>{values.reference.report?.isbn}</LabelContentRow>
      <LabelContentRow label={t('references.series')}>{values.reference.report?.series?.title}</LabelContentRow>
      <LabelContentRow label={t('references.number_of_pages')}>
        {values.reference.report?.numberOfPages}
      </LabelContentRow>
    </>
  );
};

export default SubmissionReport;
