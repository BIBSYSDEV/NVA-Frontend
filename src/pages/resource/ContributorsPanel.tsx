import React, { useReducer } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import mockContributors from '../../utils/testfiles/contributors.json';

import TabPanel from '../../components/TabPanel/TabPanel';
import { contributorReducer } from '../../redux/reducers/contributorReducer';
import { RootStore } from '../../redux/reducers/rootReducer';
import Contributor from './contributors/Contributor';
import ContributorLabel from './contributors/ContributorLabel';
import ContributorValidator from './contributors/ContributorValidator';
import StyledContributor from './contributors/StyledContributor';

interface ContributorsPanelProps {
  onClick: (event: React.MouseEvent<any>) => void;
  tabNumber: number;
}

const ContributorsPanel: React.FC<ContributorsPanelProps> = ({ onClick, tabNumber }) => {
  const { t } = useTranslation();
  const errors = useSelector((store: RootStore) => store.errors);
  const initialState = mockContributors;
  const [contributors, dispatch] = useReducer(contributorReducer, initialState);

  return (
    <TabPanel
      isHidden={tabNumber !== 3}
      ariaLabel="references"
      onClick={onClick}
      errors={errors.contributorsErrors}
      heading="Contributors">
      <StyledContributor.Box>
        <StyledContributor.MainHeading>{t('contributors.authors')}</StyledContributor.MainHeading>
        <StyledContributor.ContributorContainer>
          <div className="contributor-icon"></div>
          <div className="contributor-name">
            <ContributorLabel>{t('contributors.name')}</ContributorLabel>
          </div>
          <div className="contributor-institution">
            <ContributorLabel>{t('contributors.institution')}</ContributorLabel>
          </div>
          <div className="contributor-switch">
            <ContributorLabel>{t('contributors.corresponding')}</ContributorLabel>
          </div>
          <div className="contributor-orcid">
            <ContributorLabel>{t('contributors.ORCID')}</ContributorLabel>
          </div>
          <div className="contributor-delete-icon"></div>
        </StyledContributor.ContributorContainer>
        {contributors.map(contributor => (
          <Contributor contributor={contributor} key={contributor.id} dispatch={dispatch} />
        ))}
        <ContributorValidator />
        <StyledContributor.AuthorsButton variant="text" startIcon={<StyledContributor.AddIcon />}>
          {t('contributors.add_author')}
        </StyledContributor.AuthorsButton>
      </StyledContributor.Box>
      <StyledContributor.Box>
        <StyledContributor.MainHeading>Bidragsytere</StyledContributor.MainHeading>
      </StyledContributor.Box>
    </TabPanel>
  );
};

export default ContributorsPanel;
