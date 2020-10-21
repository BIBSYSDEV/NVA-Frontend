import LabelContentRow from '../../../components/LabelContentRow';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { Registration, PagesRange } from '../../../types/registration.types';

const SubmissionChapter: React.FC = () => {
  const { t } = useTranslation('registration');
  const { values }: FormikProps<Registration> = useFormikContext();
  const {
    reference: { publicationInstance },
  } = values.entityDescription;

  const pages = publicationInstance.pages as PagesRange;

  return (
    <>
      {/* TODO <LabelContentRow label={t('chapter.anthology')}>{isbn}</LabelContentRow> */}
      <LabelContentRow label={t('references.pages_from')}>{pages?.begin}</LabelContentRow>
      <LabelContentRow label={t('references.pages_to')}>{pages?.end}</LabelContentRow>
    </>
  );
};

export default SubmissionChapter;
