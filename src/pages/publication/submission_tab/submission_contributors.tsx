import LabelContentRow from '../../../components/LabelContentRow';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../../types/publication.types';
import SubmissionContentText from './submission_content_text';

const SubmissionContributors: React.FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();

  return (
    <LabelContentRow label={t('heading.contributors')}>
      {values.contributors.map(contributor => (
        <SubmissionContentText key={contributor.identity.name}>
          {contributor.identity.name}
          {contributor.institutions.map(institution => institution?.name && `(${institution.name})`)}
        </SubmissionContentText>
      ))}
    </LabelContentRow>
  );
};

export default SubmissionContributors;
