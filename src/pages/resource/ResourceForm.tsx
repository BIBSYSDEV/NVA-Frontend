import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import TabPanel from '../../components/TabPanel/TabPanel';
import { RootStore } from '../../redux/reducers/rootReducer';
import ContributorsPanel from './ContributorsPanel';
import DescriptionPanel from './description/DescriptionPanel';
import PublicationPanel from './PublicationPanel';
import FilesAndLicensPanel from './FilesAndLicensePanel';
import { ResourceFormTabs } from './ResourceFormTabs';
import styled from 'styled-components';

const StyledResource = styled.div`
  align-self: flex-start;
  flex-grow: 1;
  padding: 5rem;
`;

const ResourceForm: React.FC = () => {
  const [tabNumber, setTabNumber] = useState(0);
  const errors = useSelector((store: RootStore) => store.errors);
  const formData = useSelector((store: RootStore) => store.formsData);
  const { referencesErrors } = errors;

  const handleTabChange = (_: React.ChangeEvent<{}>, newTabNumber: number) => {
    setTabNumber(newTabNumber);
  };

  const goToNextTab = () => {
    setTabNumber(tabNumber + 1);
  };

  const saveResource = async () => {
    console.log('Save resource:', formData);
  };

  return (
    <StyledResource>
      <ResourceFormTabs tabNumber={tabNumber} handleTabChange={handleTabChange} />
      <PublicationPanel tabNumber={tabNumber} goToNextTab={goToNextTab} />
      <DescriptionPanel tabNumber={tabNumber} goToNextTab={goToNextTab} saveResource={saveResource} />
      <TabPanel
        isHidden={tabNumber !== 2}
        ariaLabel="references"
        goToNextTab={goToNextTab}
        errors={referencesErrors}
        heading="References">
        <div>Page Three</div>
      </TabPanel>
      <ContributorsPanel tabNumber={tabNumber} goToNextTab={goToNextTab} saveResource={saveResource} />
      <FilesAndLicensPanel tabNumber={tabNumber} goToNextTab={goToNextTab} />
      <TabPanel isHidden={tabNumber !== 5} ariaLabel="submission" heading="submission">
        <div>Page Six</div>
      </TabPanel>
    </StyledResource>
  );
};

export default ResourceForm;
