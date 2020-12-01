import LabelContentRow from '../../../components/LabelContentRow';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { Registration } from '../../../types/registration.types';
import { DegreeEntityDescription } from '../../../types/publication_types/degreeRegistration.types';

const SubmissionDegree: FC = () => {
  const { t } = useTranslation('registration');
  const { values } = useFormikContext<Registration>();

  const {
    reference: { publicationContext, publicationInstance },
  } = values.entityDescription as DegreeEntityDescription;

  return (
    <>
      <LabelContentRow label={t('references.subtype')}>
        {publicationInstance.type && t(`publicationTypes:${publicationInstance.type}`)}
      </LabelContentRow>
      <LabelContentRow label={t('common:publisher')}>{publicationContext?.publisher}</LabelContentRow>
      <LabelContentRow label={t('references.series')}>{publicationContext?.seriesTitle}</LabelContentRow>
    </>
  );
};

export default SubmissionDegree;
