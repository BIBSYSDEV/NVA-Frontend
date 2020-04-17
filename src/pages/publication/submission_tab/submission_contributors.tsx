import LabelContentRow from '../../../components/LabelContentRow';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { FormikPublication } from '../../../types/publication.types';
import NormalText from '../../../components/NormalText';

const SubmissionContributors: React.FC = () => {
  const { t } = useTranslation('publication');
  const {
    values: {
      entityDescription: { contributors },
    },
  }: FormikProps<FormikPublication> = useFormikContext();

  return (
    <LabelContentRow label={t('heading.contributors')} multiple>
      {contributors.map((contributor) => (
        <NormalText key={contributor.identity.name}>
          {contributor.identity.name}
          {contributor.affiliations?.map(
            (affiliation) => affiliation?.labels && `(${Object.values(affiliation.labels)[0]})`
          )}
        </NormalText>
      ))}
    </LabelContentRow>
  );
};

export default SubmissionContributors;
