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
    <>
      <LabelContentRow label={t('heading.contributors')}>
        {values.contributors.map(contributor => {
          return (
            <SubmissionContentText>
              {contributor.name}
              {contributor.institution?.name && `(${contributor.institution.name})`})
            </SubmissionContentText>
          );
        })}
      </LabelContentRow>
    </>
  );
};

export default SubmissionContributors;
