import React from 'react';

import TabPanel from '../../components/TabPanel/TabPanel';
import Contributors from './contributors_tab/Contributors';
import OtherContributors from './contributors_tab/OtherContributors';

interface ContributorsPanelProps {
  goToNextTab: (event: React.MouseEvent<any>) => void;
  savePublication: (event: React.MouseEvent<any>) => void;
}

const ContributorsPanel: React.FC<ContributorsPanelProps> = ({ goToNextTab, savePublication }) => (
  <TabPanel ariaLabel="references" goToNextTab={goToNextTab} onClickSave={savePublication}>
    <Contributors />
    <OtherContributors />
  </TabPanel>
);

export default ContributorsPanel;
