import React from 'react';
import styled from 'styled-components';
import { Link, useHistory } from 'react-router-dom';
import { Link as MuiLink, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import LatestRegistrations from './LatestRegistrations';
import SearchBar from '../../components/SearchBar';
import { getSearchPath, UrlPathTemplate } from '../../utils/urlPaths';
import Card from '../../components/Card';

const StyledDashboard = styled.div`
  display: grid;
  grid-template-areas: 'description' 'search-bar';
  grid-template-rows: auto auto;
  row-gap: 1rem;
  justify-items: center;
  width: 100%;
`;

const StyledAbout = styled.div`
  grid-area: description;
`;

const StyledSearchBarContainer = styled.div`
  grid-area: search-bar;
  width: 100%;
`;

const Dashboard = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleSearch = async (searchTerm: string) => {
    if (searchTerm.length) {
      history.push(getSearchPath(searchTerm));
    }
  };

  return (
    <StyledDashboard>
      <StyledAbout>
        <Card>
          <Typography variant="subtitle1">{t('about:short_description')}</Typography>
          <MuiLink component={Link} to={UrlPathTemplate.About} data-testid="about_read_more_link">
            {t('common:read_more')}
          </MuiLink>
        </Card>
      </StyledAbout>
      <StyledSearchBarContainer>
        <SearchBar handleSearch={handleSearch} initialSearchTerm="" />
        <LatestRegistrations />
      </StyledSearchBarContainer>
    </StyledDashboard>
  );
};

export default Dashboard;
