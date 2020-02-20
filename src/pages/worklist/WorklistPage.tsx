import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LinkIcon from '@material-ui/icons/Link';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import styled from 'styled-components';
import DoiRequests from './DoiRequests';

const StyledTabsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
`;

const StyledTabButton = styled.button<{ isSelected: boolean }>`
  all: unset;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  width: 45%;
  font-weight: bold;
  font-size: 1.2rem;

  ${({ isSelected, theme }) =>
    isSelected &&
    `
      color: ${theme.palette.primary.main};
      padding-bottom: 0.4rem;
      border-bottom: 0.2rem solid;
    `};
`;

const StyledContent = styled.div`
  margin-top: 2rem;
  width: 100%;
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
    <>
      <StyledTabsContainer>
        <StyledTabButton onClick={() => setSelectedTab(Tab.Approval)} isSelected={selectedTab === Tab.Approval}>
          <StyledPlaylistAddCheckIcon fontSize="large" />
          {t('for_approval')}
        </StyledTabButton>
        <StyledTabButton onClick={() => setSelectedTab(Tab.Doi)} isSelected={selectedTab === Tab.Doi}>
          <StyledLinkIcon fontSize="large" />
          {t('doi_requests')}
        </StyledTabButton>
      </StyledTabsContainer>

      <StyledContent>
        {selectedTab === Tab.Approval && <div>TODO: For Approval</div>}
        {selectedTab === Tab.Doi && <DoiRequests />}
      </StyledContent>
    </>
  );
};

export default WorklistPage;
