import React, { FC } from 'react';

import Box from '../../components/Box';
import TabPanel from '../../components/TabPanel/TabPanel';
import AddContributor from './contributors_tab/AddContributor';

interface ContributorsPanelProps {
  goToNextTab: (event: React.MouseEvent<any>) => void;
  savePublication: (event: React.MouseEvent<any>) => void;
}

const ContributorsPanel: FC<ContributorsPanelProps> = ({ goToNextTab, savePublication }) => (
  <TabPanel ariaLabel="references" goToNextTab={goToNextTab} onClickSave={savePublication}>
    <Box>
      <AddContributor />
    </Box>
  </TabPanel>
);

export default ContributorsPanel;
