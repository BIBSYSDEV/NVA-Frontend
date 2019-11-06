import '../../styles/pages/resource/resource.scss';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import TabPanel from '../../components/TabPanel/TabPanel';
import { RootStore } from '../../redux/reducers/rootReducer';
import DescriptionPanel from './DescriptionPanel';
import PublicationPanel from './PublicationPanel';
import { ResourceFormTabs } from './ResourceFormTabs';

const Resource: React.FC = () => {
  const [tabNumber, setTabNumber] = useState(0);
  const errors = useSelector((store: RootStore) => store.errors);
  const { referencesErrors, contributorsErrors, filesAndLicensesErrors } = errors;

  const handleChange = (_: React.ChangeEvent<{}>, newTabNumber: number) => {
    setTabNumber(newTabNumber);
  };

  const goToNextPage = (_: any) => {
    setTabNumber(tabNumber + 1);
  };

  return (
    <div className="resource">
      <ResourceFormTabs tabNumber={tabNumber} onChange={handleChange} />
      <PublicationPanel tabNumber={tabNumber} onClick={goToNextPage} />
      <DescriptionPanel tabNumber={tabNumber} onClick={goToNextPage} />
      <TabPanel
        value={tabNumber}
        currentTabNumber={2}
        ariaLabel="references"
        onClick={goToNextPage}
        errors={referencesErrors}>
        <div>Page Three</div>
      </TabPanel>
      <TabPanel
        value={tabNumber}
        currentTabNumber={3}
        ariaLabel="contributors"
        onClick={goToNextPage}
        errors={contributorsErrors}>
        <div>Page Four</div>
      </TabPanel>
      <TabPanel
        value={tabNumber}
        currentTabNumber={4}
        ariaLabel="files-and-licenses"
        onClick={goToNextPage}
        errors={filesAndLicensesErrors}>
        <div>Page Five</div>
      </TabPanel>
      <TabPanel value={tabNumber} currentTabNumber={5} ariaLabel="submission" onClick={goToNextPage}>
        <div>Page Six</div>
      </TabPanel>
    </div>
  );
};

export default Resource;
