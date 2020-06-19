import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LinkIcon from '@material-ui/icons/Link';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import styled from 'styled-components';
import DoiRequests from './DoiRequests';
import PublicationsForApproval from './PublicationsForApproval';
import TabButton from '../../components/TabButton';
import { Card } from '@material-ui/core';
import { StyledCenterAlignedContentWrapper } from '../../components/styled/Wrappers';

const StyledContainer = styled.div`
  display: block;
  width: 100%;
  margin: 0 2rem 2rem 2rem;
`;

const StyledTabsContainer = styled(StyledCenterAlignedContentWrapper)`
  padding-top: 2rem;
  margin: 0 1.5rem;
`;

const StyledCard = styled(Card)`
  margin: 0 1.5rem;
  width: auto;
`;

const StyledPlaylistAddCheckIcon = styled(PlaylistAddCheckIcon)`
  width: 3rem;
  height: 3rem;
`;

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
    <StyledContainer>
      <StyledTabsContainer>
        <TabButton
          data-testid="for-approval-button"
          onClick={() => setSelectedTab(Tab.Approval)}
          isSelected={selectedTab === Tab.Approval}>
          <StyledPlaylistAddCheckIcon fontSize="large" />
          {t('for_approval')}
        </TabButton>
        <TabButton
          data-testid="doi-requests-button"
          onClick={() => setSelectedTab(Tab.Doi)}
          isSelected={selectedTab === Tab.Doi}>
          <StyledLinkIcon fontSize="large" />
          {t('doi_requests')}
        </TabButton>
      </StyledTabsContainer>

      <StyledCard>
        {selectedTab === Tab.Approval && <PublicationsForApproval />}
        {selectedTab === Tab.Doi && <DoiRequests />}
      </StyledCard>
    </StyledContainer>
  );
};

export default WorklistPage;
