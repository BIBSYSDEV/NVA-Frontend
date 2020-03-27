import LabelContentRow from '../../../components/LabelContentRow';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { FormikPublication } from '../../../types/publication.types';
import SubmissionContentText from './submission_content_text';

const SubmissionContributors: React.FC = () => {
  const { t } = useTranslation('publication');
  const {
    values: {
      entityDescription: { contributors },
    },
  }: FormikProps<FormikPublication> = useFormikContext();

  return (
    <LabelContentRow label={t('heading.contributors')}>
      {contributors.map((contributor) => (
        <SubmissionContentText key={contributor.identity.name}>
          {contributor.identity.name}
          {/* TODO: update mapping of institutions once we get this from backend */}
          {contributor.affiliations?.map((affiliation) => affiliation?.name && `(${affiliation.name})`)}
        </SubmissionContentText>
      ))}
    </LabelContentRow>
  );
};

export default SubmissionContributors;
