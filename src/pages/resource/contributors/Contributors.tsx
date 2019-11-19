import React, { Dispatch } from 'react';
import { useTranslation } from 'react-i18next';

import ContributorType from '../../../types/contributor.types';
import StyledContributor from '../contributors/StyledContributor';
import Contributor from './Contributor';
import ContributorLabel from './ContributorLabel';
import ContributorValidator from './ContributorValidator';

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
        <ContributorLabel>{t('contributors.name')}</ContributorLabel>
        <ContributorLabel>{t('contributors.institution')}</ContributorLabel>
        <ContributorLabel>{t('contributors.corresponding')}</ContributorLabel>
        <ContributorLabel>{t('contributors.ORCID')}</ContributorLabel>
      </StyledContributor.ContributorContainer>
      {contributors
        .filter(contributor => contributor.type === 'Author' && contributor.verified)
        .map(contributor => (
          <Contributor contributor={contributor} key={contributor.id} dispatch={dispatch} />
        ))}
      {contributors
        .filter(contributor => contributor.type === 'Author' && !contributor.verified)
        .map(contributor => (
          <ContributorValidator contributor={contributor} key={contributor.id} dispatch={dispatch} />
        ))}
      <StyledContributor.AuthorsButton variant="text" startIcon={<StyledContributor.AddIcon />} onClick={onAddAuthor}>
        {t('contributors.add_author')}
      </StyledContributor.AuthorsButton>
    </StyledContributor.Box>
  );
};

export default Contributors;
