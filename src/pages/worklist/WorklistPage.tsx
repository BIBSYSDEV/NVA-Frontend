import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LinkIcon from '@material-ui/icons/Link';
import styled from 'styled-components';

import DoiRequests from './DoiRequests';
import TabButton from '../../components/TabButton';
import { StyledCenterAlignedContentWrapper } from '../../components/styled/Wrappers';
import { PageHeader } from '../../components/PageHeader';

const StyledContainer = styled.div`
  width: 100%;
`;

const StyledTabsContainer = styled(StyledCenterAlignedContentWrapper)`
  margin-bottom: 1rem;
`;

// const StyledPlaylistAddCheckIcon = styled(PlaylistAddCheckIcon)`
//   width: 3rem;
//   height: 3rem;
// `;

const StyledLinkIcon = styled(LinkIcon)`
  width: 3rem;
  height: 3rem;
`;

enum Tab {
  Doi,
  Approval,
}

const WorklistPage: FC = () => {
  const { t } = useTranslation('workLists');
  const [selectedTab, setSelectedTab] = useState(Tab.Doi);

  return (
    <>
      <PageHeader>{t('my_worklist')}</PageHeader>
      <StyledContainer>
        <StyledTabsContainer>
          {/* <TabButton
            data-testid="for-approval-button"
            onClick={() => setSelectedTab(Tab.Approval)}
            isSelected={selectedTab === Tab.Approval}>
            <StyledPlaylistAddCheckIcon fontSize="large" />
            {t('for_approval')}
          </TabButton> */}
          <TabButton
            data-testid="doi-requests-button"
            onClick={() => setSelectedTab(Tab.Doi)}
            isSelected={selectedTab === Tab.Doi}>
            <StyledLinkIcon fontSize="large" />
            {t('doi_requests.doi_requests')}
          </TabButton>
        </StyledTabsContainer>

        {/* {selectedTab === Tab.Approval && <PublicationsForApproval />} */}
        {selectedTab === Tab.Doi && <DoiRequests />}
      </StyledContainer>
    </>
  );
};

export default WorklistPage;
