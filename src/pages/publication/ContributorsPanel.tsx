import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@material-ui/core';

import Box from '../../components/Box';
import TabPanel from '../../components/TabPanel/TabPanel';

interface ContributorsPanelProps {
  goToNextTab: (event: React.MouseEvent<any>) => void;
  savePublication: (event: React.MouseEvent<any>) => void;
}

const ContributorsPanel: React.FC<ContributorsPanelProps> = ({ goToNextTab, savePublication }) => {
  const { t } = useTranslation('publication');
  return (
    <TabPanel ariaLabel="references" goToNextTab={goToNextTab} onClickSave={savePublication}>
      <Box>
        <Button color="primary" variant="contained">
          {t('contributors.add_author')}
        </Button>
      </Box>
    </TabPanel>
  );
};

export default ContributorsPanel;
