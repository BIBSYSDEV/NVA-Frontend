import React, { Dispatch } from 'react';
import { useTranslation } from 'react-i18next';

import Contributor from './Contributor';
import ContributorLabel from './ContributorLabel';
import ContributorValidator from './ContributorValidator';
import StyledContributor from '../contributors/StyledComponents';
import ContributorType from '../../../types/contributor.types';

interface ContributorsProps {
  contributors: ContributorType[];
  dispatch: Dispatch<any>;
  onAddAuthor: () => void;
}

const Contributors: React.FC<ContributorsProps> = ({ contributors, dispatch, onAddAuthor }) => {
  const { t } = useTranslation();

  return (
    <StyledContributor.Box>
      <StyledContributor.MainHeading>{t('contributors.authors')}</StyledContributor.MainHeading>
      <StyledContributor.ContributorContainer>
        <div className="contributor-icon" />
        <ContributorLabel>{t('contributors.name')}</ContributorLabel>
        <ContributorLabel>{t('contributors.institution')}</ContributorLabel>
        <ContributorLabel>{t('contributors.corresponding')}</ContributorLabel>
        <ContributorLabel>{t('contributors.ORCID')}</ContributorLabel>
        <div className="contributor-delete-icon" />
      </StyledContributor.ContributorContainer>
      {contributors
        .filter(contributor => contributor.type === 'Author')
        .map(contributor => (
          <Contributor contributor={contributor} key={contributor.id} dispatch={dispatch} />
        ))}
      <ContributorValidator />
      <StyledContributor.AuthorsButton variant="text" startIcon={<StyledContributor.AddIcon />} onClick={onAddAuthor}>
        {t('contributors.add_author')}
      </StyledContributor.AuthorsButton>
    </StyledContributor.Box>
  );
};

export default Contributors;
