import LabelContentLine from '../../../components/LabelContentLine';
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

export default SubmissionReport;
