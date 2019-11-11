import TabPanel from '../../components/TabPanel/TabPanel';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootStore } from '../../redux/reducers/rootReducer';
import Box from '../../components/Box';
import Contributor from './Contributor';
import ContributorSelector from './ContributorSelector';

import contributorsMock from '../../utils/testfiles/contributors.json';
import ContributorLabel from './ContributorLabel';

import { ARROW_UP, ARROW_DOWN } from './../../utils/constants';
import { List, ListItem } from '@material-ui/core';

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
          <div className="container">
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
          </div>
          <div>
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
          </div>

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
