import React, { FC } from 'react';
import styled from 'styled-components';
import { Link, useHistory } from 'react-router-dom';
import { Link as MuiLink } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import LatestRegistrations from './LatestRegistrations';
import SearchBar from '../../components/SearchBar';
import { UrlPathTemplate } from '../../utils/urlPaths';

const StyledDashboard = styled.div`
  display: grid;
  grid-template-areas: 'search-bar' 'other-content';
  grid-template-rows: auto auto;
  row-gap: 1rem;
  justify-items: center;
  width: 100%;
`;

const StyledOtherContent = styled.div`
  grid-area: other-content;
  padding-bottom: 1.5rem;
`;

const StyledLinks = styled.div`
  > * {
    margin: 0.5rem;
  }
`;

const StyledSearchBarContainer = styled.div`
  grid-area: search-bar;
  width: 100%;
`;

const Dashboard: FC = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleSearch = async (searchTerm: string) => {
    if (searchTerm.length) {
      history.push(`/search?query=${searchTerm}`);
    }
  };

  return (
    <StyledDashboard>
      <StyledSearchBarContainer>
        <SearchBar handleSearch={handleSearch} initialSearchTerm="" />
        <LatestRegistrations />
      </StyledSearchBarContainer>
      <StyledOtherContent>
        <StyledLinks>
          <MuiLink
            aria-label={t('infopages:description.heading')}
            color="primary"
            component={Link}
            to={UrlPathTemplate.Description}
            data-testid="description_link">
            {t('infopages:description.heading')}
          </MuiLink>
          <MuiLink
            aria-label={t('infopages:order_information.heading')}
            color="primary"
            component={Link}
            to={UrlPathTemplate.OrderInformation}
            data-testid="order_information_link">
            {t('infopages:order_information.heading')}
          </MuiLink>
        </StyledLinks>
      </StyledOtherContent>
    </StyledDashboard>
  );
};

export default Dashboard;
