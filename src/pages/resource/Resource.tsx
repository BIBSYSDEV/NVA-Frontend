import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import TabPanel from '../../components/TabPanel/TabPanel';
import { RootStore } from '../../redux/reducers/rootReducer';
import ContributorsPanel from './ContributorsPanel';
import DescriptionPanel from './DescriptionPanel';
import PublicationPanel from './PublicationPanel';
import FilesAndLicensPanel from './FilesAndLicensePanel';
import { ResourceFormTabs } from './ResourceFormTabs';
import styled from 'styled-components';

const StyledResource = styled.div`
  align-self: flex-start;
  flex-grow: 1;
  padding: 5rem;
`;

const Resource: React.FC = () => {
  const [tabNumber, setTabNumber] = useState(0);
  const errors = useSelector((store: RootStore) => store.errors);
  const { referencesErrors } = errors;

  const handleTabChange = (_: React.ChangeEvent<{}>, newTabNumber: number) => {
    setTabNumber(newTabNumber);
  };

  const goToNextPage = () => {
    setTabNumber(tabNumber + 1);
  };

  return (
    <StyledResource>
      <ResourceFormTabs tabNumber={tabNumber} handleTabChange={handleTabChange} />
      <PublicationPanel tabNumber={tabNumber} goToNextPage={goToNextPage} />
      <DescriptionPanel tabNumber={tabNumber} goToNextPage={goToNextPage} />
      <TabPanel
        isHidden={tabNumber !== 2}
        ariaLabel="references"
        goToNextPage={goToNextPage}
        errors={referencesErrors}
        heading="References">
        <div>Page Three</div>
      </TabPanel>
      <ContributorsPanel tabNumber={tabNumber} onClick={goToNextPage} />
      <FilesAndLicensPanel tabNumber={tabNumber} onClick={goToNextPage} />
      <TabPanel isHidden={tabNumber !== 5} ariaLabel="submission" onClick={goToNextPage} heading="submission">
        <div>Page Six</div>
      </TabPanel>
    </StyledResource>
  );
};

export default Resource;
