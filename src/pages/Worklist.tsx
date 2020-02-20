import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AttachmentIcon from '@material-ui/icons/Attachment';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import styled from 'styled-components';

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
  width: 15rem;
  font-weight: bold;
  font-size: 1.2rem;

  ${({ isSelected, theme }) =>
    isSelected &&
    `
      color: ${theme.palette.primary.main};
      border-bottom: 0.3rem solid;
    `};
`;

const StyledContent = styled.div`
  margin-top: 2rem;
`;

const StyledPlaylistAddCheckIcon = styled(PlaylistAddCheckIcon)`
  width: 3rem;
  height: 3rem;
`;

const StyledAttachmentIcon = styled(AttachmentIcon)`
  width: 3rem;
  height: 3rem;
`;

enum Tab {
  Doi,
  Approval,
}

const Worklist: FC = () => {
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
          <StyledAttachmentIcon fontSize="large" />
          {t('doi_requests')}
        </StyledTabButton>
      </StyledTabsContainer>

      <StyledContent>
        {selectedTab === Tab.Approval && <div>For Approval</div>}
        {selectedTab === Tab.Doi && <div>DOI</div>}
      </StyledContent>
    </>
  );
};

export default Worklist;
