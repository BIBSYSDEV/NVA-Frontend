import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { Typography } from '@material-ui/core';
import styled from 'styled-components';
import LabelContentRow from '../../../components/LabelContentRow';
import { Registration } from '../../../types/registration.types';

const StyledAffiliationCount = styled.span`
  margin-left: 0.5rem;
`;

const SubmissionContributors: React.FC = () => {
  const { t } = useTranslation('registration');
  const {
    values: {
      entityDescription: { contributors },
    },
  } = useFormikContext<Registration>();

  return (
    <LabelContentRow label={t('heading.contributors')} multiple>
      {contributors.map((contributor) => (
        <Typography key={contributor.identity.name}>
          {contributor.correspondingAuthor && <span>{t('submission.corresponding_author')}: </span>}
          {contributor.identity.name}
          {contributor.affiliations?.length > 0 && (
            <StyledAffiliationCount>
              ({t('submission.number_of_affiliations', { count: contributor.affiliations.length })})
            </StyledAffiliationCount>
          )}
        </Typography>
      ))}
    </LabelContentRow>
  );
};

export default SubmissionContributors;
