import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import ButtonModal from '../../components/ButtonModal';
import SearchBar from '../../components/SearchBar';
import { ConnectAuthority } from '../user/authority/ConnectAuthority';

const StyledDashboard = styled.div`
  width: 100%;
  height: 85%;
  display: grid;
  grid-template-areas: 'search-bar' 'other-content';
  grid-template-rows: 4rem 15rem auto;
  justify-items: center;
  align-items: center;
`;

const StyledSearchBar = styled(SearchBar)`
  grid-area: other-content;
`;

const StyledOtherContent = styled.div`
  grid-area: search-bar;
`;

const Dashboard: React.FC = () => {
  const { t } = useTranslation('profile');
  return (
    <StyledDashboard>
      <StyledSearchBar resetSearchInput />
      <ButtonModal
        buttonText={t('authority.connect_authority')}
        dataTestId="connect-author-modal"
        ariaLabelledBy="connect-author-modal">
        {() => <ConnectAuthority />}
      </ButtonModal>
      <StyledOtherContent>Annet innhold</StyledOtherContent>
    </StyledDashboard>
  );
};

export default Dashboard;
