import LabelContentLine from '../../../components/LabelContentLine';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../../types/publication.types';
import { Typography } from '@material-ui/core';

const SubmissionDegreePresentation: React.FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();

  return (
    <>
      <Typography variant="h3">{t('references.degree')}</Typography>

      <LabelContentLine label={t('common:type')}>{values.reference.degree?.type}</LabelContentLine>
      <LabelContentLine label={t('references.publisher')}>{values.reference.degree?.publisher?.title}</LabelContentLine>
      <LabelContentLine label={t('references.specialization')}>
        {values.reference.degree?.specialization}
      </LabelContentLine>
      <LabelContentLine label={t('references.series')}>{values.reference.degree?.series?.title}</LabelContentLine>
    </>
  );
};

export default SubmissionDegreePresentation;
