import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import TabPanel from '../../components/TabPanel/TabPanel';
import { RootStore } from '../../redux/reducers/rootReducer';
import ContributorsPanel from './ContributorsPanel';
import DescriptionPanel from './DescriptionPanel';
import PublicationPanel from './PublicationPanel';
import FilesAndLicensesPanel from './FilesAndLicensesPanel';
import { ResourceFormTabs } from './ResourceFormTabs';
import styled from 'styled-components';

const StyledResource = styled.div`
  align-self: flex-start;
  flex-grow: 1;
  padding: 5rem;
`;

const Resource: React.FC = () => {
  const [tabNumber, setTabNumber] = useState(4);
  const errors = useSelector((store: RootStore) => store.errors);
  const { referencesErrors } = errors;

  const handleChange = (_: React.ChangeEvent<{}>, newTabNumber: number) => {
    setTabNumber(newTabNumber);
  };

  const goToNextPage = (_: React.MouseEvent<any>) => {
    setTabNumber(tabNumber + 1);
  };

  return (
    <StyledResource>
      <ResourceFormTabs tabNumber={tabNumber} onChange={handleChange} />
      <PublicationPanel tabNumber={tabNumber} onClick={goToNextPage} />
      <DescriptionPanel tabNumber={tabNumber} onClick={goToNextPage} />
      <TabPanel
        isHidden={tabNumber !== 2}
        ariaLabel="references"
        onClick={goToNextPage}
        errors={referencesErrors}
        heading="References">
        <div>Page Three</div>
      </TabPanel>
      <ContributorsPanel tabNumber={tabNumber} onClick={goToNextPage} />
      <FilesAndLicensesPanel tabNumber={tabNumber} onClick={goToNextPage} />
      <TabPanel isHidden={tabNumber !== 5} ariaLabel="submission" onClick={goToNextPage} heading="submission">
        <div>Page Six</div>
      </TabPanel>
    </StyledResource>
  );
};

export default Resource;
