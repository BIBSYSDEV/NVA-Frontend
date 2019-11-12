import React, { useReducer } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import mockContributors from '../../utils/testfiles/contributors.json';

import Box from '../../components/Box';
import TabPanel from '../../components/TabPanel/TabPanel';
import { contributorReducer } from '../../redux/reducers/contributorReducer';
import { RootStore } from '../../redux/reducers/rootReducer';
import Contributor from './contributors/Contributor';
import ContributorLabel from './contributors/ContributorLabel';
import ContributorSelector from './contributors/ContributorSelector';

const StyledBox = styled.div`
  background-color: ${({ theme }) => theme.palette.box.main};
  display: grid;
  grid-template-areas: 'icon name institution switch orcid arrows delete';
  grid-template-columns: 5% 30% 18% 10% 5% 5% 5%;
`;

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
      <Box>
        <div>{t('contributors.authors')}</div>
        <StyledBox>
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
        </StyledBox>
        {contributors.map(contributor => (
          <Contributor contributor={contributor} key={contributor.id} dispatch={dispatch} />
        ))}
        <div>
          <ContributorSelector />
        </div>
      </Box>
      <Box>
        <div>Bidragsytere</div>
      </Box>
    </TabPanel>
  );
};

export default ContributorsPanel;
