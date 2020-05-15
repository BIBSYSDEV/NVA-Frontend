import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import styled from 'styled-components';
import { RootStore } from '../../../redux/reducers/rootReducer';
import { Link as RouterLink } from 'react-router-dom';
import UnpublishedPublications from './UnpublishedPublications';
import PublishedPublications from './PublishedPublications';

const StyledContainer = styled.div`
  display: block;
  width: 100%;
`;

const StyledButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0 1rem;
`;

const StyledTabsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding-top: 2rem;
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

enum Tab {
  Published,
  Unpublished,
}

const MyPublications: FC = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootStore) => store.user);
  const [selectedTab, setSelectedTab] = useState(Tab.Unpublished);

  return (
    <StyledContainer>
      {user.authority && (
        <StyledButtonWrapper>
          <Button
            color="primary"
            component={RouterLink}
            to={`/profile/${user.authority.systemControlNumber}`}
            data-testid="public-profile-button">
            {t('workLists:go_to_public_profile')}
          </Button>
        </StyledButtonWrapper>
      )}
      <StyledTabsContainer>
        <StyledTabButton
          data-testid="unpublished-button"
          onClick={() => setSelectedTab(Tab.Unpublished)}
          isSelected={selectedTab === Tab.Unpublished}>
          {t('unpublished')}
        </StyledTabButton>
        <StyledTabButton
          data-testid="published-button"
          onClick={() => setSelectedTab(Tab.Published)}
          isSelected={selectedTab === Tab.Published}>
          {t('published')}
        </StyledTabButton>
      </StyledTabsContainer>

      {selectedTab === Tab.Unpublished && <UnpublishedPublications />}
      {selectedTab === Tab.Published && <PublishedPublications />}
    </StyledContainer>
  );
};

export default MyPublications;
