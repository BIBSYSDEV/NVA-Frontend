import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Link as MuiLink, Typography } from '@material-ui/core';
import BackgroundDiv from '../../components/BackgroundDiv';
import SearchBar from '../../components/SearchBar';
import lightTheme from '../../themes/lightTheme';
import { getSearchPath, UrlPathTemplate } from '../../utils/urlPaths';
import LatestRegistrations from './LatestRegistrations';

const StyledDashboard = styled.div`
  display: grid;
  grid-template-areas: 'description' 'search-bar';
  grid-template-rows: auto auto;
  justify-items: center;
  width: 100%;
`;

const StyledSearchBarContainer = styled.div`
  grid-area: search-bar;
  width: 100%;
`;

const StyledBackgroundDiv = styled(BackgroundDiv)`
  grid-area: description;
  margin: 0;
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
      <StyledBackgroundDiv backgroundColor={lightTheme.palette.section.megaDark}>
        <Typography variant="subtitle1">{t('about:short_description')}</Typography>
        <MuiLink component={Link} to={UrlPathTemplate.About} data-testid="about_read_more_link">
          {t('common:read_more')}
        </MuiLink>
      </StyledBackgroundDiv>
      <StyledSearchBarContainer>
        <SearchBar handleSearch={handleSearch} initialSearchTerm="" />
        <LatestRegistrations />
      </StyledSearchBarContainer>
    </StyledDashboard>
  );
};

export default Dashboard;
