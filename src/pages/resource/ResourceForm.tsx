import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import TabPanel from '../../components/TabPanel/TabPanel';
import { RootStore } from '../../redux/reducers/rootReducer';
import ContributorsPanel from './ContributorsPanel';
import DescriptionPanel from './DescriptionPanel';
import FilesAndLicensePanel from './FilesAndLicensePanel';
import PublicationPanel from './PublicationPanel';
import { ReferencesPanel } from './ReferencesPanel';
import { ResourceFormTabs } from './ResourceFormTabs';

const StyledResource = styled.div`
  flex-grow: 1;
  width: 100%;
`;

const ResourceForm: React.FC = () => {
  const { t } = useTranslation('publication');
  const [tabNumber, setTabNumber] = useState(0);
  const formData = useSelector((store: RootStore) => store.formsData);

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
      <ReferencesPanel tabNumber={tabNumber} goToNextTab={goToNextTab} saveResource={saveResource} />
      <ContributorsPanel tabNumber={tabNumber} goToNextTab={goToNextTab} saveResource={saveResource} />
      <FilesAndLicensePanel tabNumber={tabNumber} goToNextTab={goToNextTab} />
      <TabPanel isHidden={tabNumber !== 5} ariaLabel="submission" heading={t('heading.submission')}>
        <div>Page Six</div>
      </TabPanel>
    </StyledResource>
  );
};

export default ResourceForm;
