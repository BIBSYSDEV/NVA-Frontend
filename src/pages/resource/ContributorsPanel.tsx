import TabPanel from '../../components/TabPanel/TabPanel';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootStore } from '../../redux/reducers/rootReducer';
import Box from '../../components/Box';

interface ContributorsPanelProps {
  onClick: (event: React.MouseEvent<any>) => void;
  tabNumber: number;
}
const ContributorsPanel: React.FC<ContributorsPanelProps> = ({ onClick, tabNumber }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const errors = useSelector((store: RootStore) => store.errors);

  return (
    <TabPanel
      isHidden={tabNumber !== 3}
      ariaLabel="references"
      onClick={onClick}
      errors={errors.contributorsErrors}
      heading="Contributors">
      <div>
        <Box>
          <div>Forfattere</div>
        </Box>
        <Box>
          <div>Bidragsytere</div>
        </Box>
      </div>
    </TabPanel>
  );
};

export default ContributorsPanel;
