import React, { FC } from 'react';

import FormCard from '../../components/FormCard/FormCard';
import TabPanel from '../../components/TabPanel/TabPanel';
import AddContributor from './contributors_tab/AddContributor';

interface ContributorsPanelProps {
  goToNextTab: (event: React.MouseEvent<any>) => void;
  savePublication: (event: React.MouseEvent<any>) => void;
}

const ContributorsPanel: FC<ContributorsPanelProps> = ({ goToNextTab, savePublication }) => (
  <TabPanel ariaLabel="references" goToNextTab={goToNextTab} onClickSave={savePublication}>
    <FormCard>
      <AddContributor />
    </FormCard>
  </TabPanel>
);

export default ContributorsPanel;
