import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import Box from '../../components/Box';
import TabPanel from '../../components/TabPanel/TabPanel';
import { RootStore } from '../../redux/reducers/rootReducer';
import { ARROW_DOWN, ARROW_UP } from '../../utils/constants';
import contributorsMock from '../../utils/testfiles/contributors.json';
import Contributor from './contributors/Contributor';
import ContributorLabel from './contributors/ContributorLabel';
import ContributorSelector from './contributors/ContributorSelector';

const StyledBox = styled.div`
  background-color: ${({ theme }) => theme.palette.box.main};
  display: grid;
  grid-template-areas: 'icon name institution switch orcid arrows delete';
  grid-template-columns: 5% 30% 20% 10% 5% 5% 5%;
`;

interface ContributorsPanelProps {
  onClick: (event: React.MouseEvent<any>) => void;
  tabNumber: number;
}

const ContributorsPanel: React.FC<ContributorsPanelProps> = ({ onClick, tabNumber }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [contributors, setContributors] = useState(contributorsMock);
  const errors = useSelector((store: RootStore) => store.errors);

  const deleteContributor = (event: React.MouseEvent<any>, id: string): void => {
    var filteredContributors = contributors.filter((contributor, index, arr) => {
      return contributor.id !== id;
    });
    setContributors(filteredContributors);
  };

  const moveContributor = (id: string, direction: number): void => {
    const position = contributors.findIndex(i => i.id === id);
    if (position < 0) {
      throw new Error('Given item not found.');
    } else if (
      (direction === ARROW_UP && position === 0) ||
      (direction === ARROW_DOWN && position === contributors.length - 1)
    ) {
      return; // canot move outside of array
    }

    const item = contributors[position]; // save item for later
    const newItems = contributors.filter(i => i.id !== id); // remove item from array
    newItems.splice(position + direction, 0, item);

    setContributors(newItems);
  };

  const addContributor = () => {};

  return (
    <TabPanel
      isHidden={tabNumber !== 3}
      ariaLabel="references"
      onClick={onClick}
      errors={errors.contributorsErrors}
      heading="Contributors">
      <div>
        <Box>
          <div>{t('Forfattere')}</div>
          <StyledBox>
            <div className="contributor-icon"></div>
            <div className="contributor-name">
              <ContributorLabel>{t('Name')}</ContributorLabel>
            </div>
            <div className="contributor-institution">
              <ContributorLabel>{t('Institution')}</ContributorLabel>
            </div>
            <div className="contributor-switch">
              <ContributorLabel>{t('Corresponding')}</ContributorLabel>
            </div>
            <div className="contributor-orcid">
              <ContributorLabel>{t('ORCID')}</ContributorLabel>
            </div>
            <div className="contributor-delete-icon"></div>
          </StyledBox>
          {contributors.map(contributor => (
            <Contributor
              id={contributor.id}
              name={contributor.name}
              institutions={contributor.institutions}
              orcid={contributor.orcid}
              deleteContributor={deleteContributor}
              moveContributor={moveContributor}
            />
          ))}

          <div>
            <ContributorSelector addContributor={addContributor} />
          </div>
        </Box>
        <Box>
          <div>Bidragsytere</div>
        </Box>
      </div>
    </TabPanel>
  );
};

export default ContributorsPanel;
