import LabelContentRow from '../../../components/LabelContentRow';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../../types/publication.types';
import NormalText from '../../../components/NormalText';
import styled from 'styled-components';

const StyledAffiliationCount = styled.span`
  margin-left: 0.5rem;
`;

const SubmissionContributors: React.FC = () => {
  const { t } = useTranslation('publication');
  const {
    values: {
      entityDescription: { contributors },
    },
  }: FormikProps<Publication> = useFormikContext();

  return (
    <LabelContentRow label={t('heading.contributors')} multiple>
      {contributors.map((contributor) => (
        <NormalText key={contributor.identity.name}>
          {contributor.identity.name}
          {contributor.affiliations?.length > 0 && (
            <StyledAffiliationCount>
              ({t('submission.number_of_affiliations', { count: contributor.affiliations.length })})
            </StyledAffiliationCount>
          )}
        </NormalText>
      ))}
    </LabelContentRow>
  );
};

export default SubmissionContributors;
