import React from 'react';
import { useTranslation } from 'react-i18next';

import TabPanel from '../../components/TabPanel/TabPanel';
import Contributors from './contributors_tab/Contributors';
import OtherContributors from './contributors_tab/OtherContributors';

interface ContributorsPanelProps {
  goToNextTab: (event: React.MouseEvent<any>) => void;
  savePublication: (event: React.MouseEvent<any>) => void;
  tabNumber: number;
}

const ContributorsPanel: React.FC<ContributorsPanelProps> = ({ goToNextTab, tabNumber, savePublication }) => {
  const { t } = useTranslation('publication');

  return (
    <TabPanel
      isHidden={tabNumber !== 3}
      ariaLabel="references"
      goToNextTab={goToNextTab}
      onClickSave={savePublication}
      heading={t('heading.contributors')}>
      <Contributors />
      <OtherContributors />
    </TabPanel>
  );
};

export default ContributorsPanel;
