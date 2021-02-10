import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Link as MuiLink, Typography } from '@material-ui/core';
import PostAddIcon from '@material-ui/icons/PostAdd';
import SearchIcon from '@material-ui/icons/Search';
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

const StyledLinksContainer = styled.div`
  display: grid;
  grid-template-areas: 'search new-registration';
  gap: 2rem;
  margin-top: 2rem;
`;

const StyledLink = styled(Link)`
  border: 2px solid;
  border-radius: 4px;
  padding: 3rem 6rem;
`;

const StyledSearchLink = styled(StyledLink)`
  border-color: ${({ theme }) => theme.palette.secondary.main};
`;

const StyledNewRegistrationLink = styled(StyledLink)`
  border-color: ${({ theme }) => theme.palette.primary.main};
`;

const StyledLinkContent = styled.div`
  display: grid;
  grid-template-areas: 'icon' 'text';
  justify-items: center;
  gap: 2rem;
  width: 12rem;
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
      <StyledLinksContainer>
        <StyledSearchLink to={UrlPathTemplate.Search}>
          <StyledLinkContent>
            <SearchIcon fontSize="large" />
            <Typography variant="h4" variantMapping={{ h4: 'a' }}>
              Søk etter forskning
            </Typography>
          </StyledLinkContent>
        </StyledSearchLink>
        <StyledNewRegistrationLink to={UrlPathTemplate.NewRegistration}>
          <StyledLinkContent>
            <PostAddIcon fontSize="large" />
            <Typography variant="h4" variantMapping={{ h4: 'a' }}>
              Ny registrering
            </Typography>
          </StyledLinkContent>
        </StyledNewRegistrationLink>
      </StyledLinksContainer>
      {/* <StyledSearchBarContainer>
        <SearchBar handleSearch={handleSearch} initialSearchTerm="" />
        <LatestRegistrations />
      </StyledSearchBarContainer> */}
    </StyledDashboard>
  );
};

export default Dashboard;
