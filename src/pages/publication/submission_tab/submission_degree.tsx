import LabelContentRow from '../../../components/LabelContentRow';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../../types/publication.types';
import { DegreeEntityDescription } from '../../../types/publication_types/degree.publication.types';

const SubmissionDegree: FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();

  const {
    reference: { publicationContext, publicationInstance },
  } = values.entityDescription as DegreeEntityDescription;

  return (
    <>
      <LabelContentRow label={t('references.subtype')}>
        {publicationInstance.type && t(`publicationTypes:subtypes_degree.${publicationInstance.type}`)}
      </LabelContentRow>
      <LabelContentRow label={t('common:publisher')}>{publicationContext?.publisher}</LabelContentRow>
      {/* TODO <LabelContentRow label={t('references.series')}>{series.title}</LabelContentRow> */}
    </>
  );
};

export default SubmissionDegree;
