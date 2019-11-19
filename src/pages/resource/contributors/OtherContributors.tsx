import React, { Dispatch } from 'react';
import { useTranslation } from 'react-i18next';

import ContributorType from '../../../types/contributor.types';
import ContributorLabel from './ContributorLabel';
import OtherContributor from './OtherContributor';
import StyledContributor from './StyledContributor';

interface OtherContributorsProps {
  contributors: ContributorType[];
  dispatch: Dispatch<any>;
  onAddOtherContributor: () => void;
}

const OtherContributors: React.FC<OtherContributorsProps> = ({ contributors, dispatch, onAddOtherContributor }) => {
  const { t } = useTranslation();

  return (
    <StyledContributor.Box>
      <StyledContributor.MainHeading>Bidragsytere</StyledContributor.MainHeading>

      <StyledContributor.OtherContributorContainer>
        <ContributorLabel>{t('contributors.type')}</ContributorLabel>
        <ContributorLabel>{t('contributors.name')}</ContributorLabel>
        <ContributorLabel>{t('contributors.institution')}</ContributorLabel>
        <div className="contributor-delete-icon" />
      </StyledContributor.OtherContributorContainer>

      {contributors
        .filter(contributor => contributor.type !== 'Author')
        .map(contributor => (
          <OtherContributor contributor={contributor} key={contributor.id} dispatch={dispatch} />
        ))}
      <StyledContributor.AuthorsButton
        variant="text"
        startIcon={<StyledContributor.AddIcon />}
        onClick={onAddOtherContributor}>
        {t('contributors.add_other_contributor')}
      </StyledContributor.AuthorsButton>
    </StyledContributor.Box>
  );
};

export default OtherContributors;
