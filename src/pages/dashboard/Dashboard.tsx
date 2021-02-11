import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Link as MuiLink, Typography } from '@material-ui/core';
import PostAddIcon from '@material-ui/icons/PostAdd';
import SearchIcon from '@material-ui/icons/Search';
import BackgroundDiv from '../../components/BackgroundDiv';
import lightTheme from '../../themes/lightTheme';
import { UrlPathTemplate } from '../../utils/urlPaths';

const StyledDashboard = styled.div`
  display: grid;
  grid-template-areas: 'description' 'links';
  justify-items: center;
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
  padding: 1rem 6rem;
  text-decoration: none;
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
  gap: 1rem;
  width: 12rem;
`;

const StyledText = styled.div`
  grid-area: text;
  text-align: center;
`;

const Dashboard = () => {
  const { t } = useTranslation('common');

  return (
    <StyledDashboard>
      <StyledBackgroundDiv backgroundColor={lightTheme.palette.section.megaDark}>
        <Typography variant="subtitle1">{t('about:short_description')}</Typography>
        <MuiLink component={Link} to={UrlPathTemplate.About} data-testid="about_read_more_link">
          {t('read_more')}
        </MuiLink>
      </StyledBackgroundDiv>
      <StyledLinksContainer>
        <StyledSearchLink to={UrlPathTemplate.Search}>
          <StyledLinkContent>
            <SearchIcon fontSize="large" />
            <Typography variant="h4" variantMapping={{ h4: 'p' }}>
              {t('search_for_publication')}
            </Typography>
          </StyledLinkContent>
        </StyledSearchLink>
        <StyledNewRegistrationLink to={UrlPathTemplate.NewRegistration}>
          <StyledLinkContent>
            <PostAddIcon fontSize="large" />
            <StyledText>
              <Typography variant="h4" variantMapping={{ h4: 'p' }}>
                {t('registration:new_registration')}
              </Typography>
              <Typography>{t('requires_login')}</Typography>
            </StyledText>
          </StyledLinkContent>
        </StyledNewRegistrationLink>
      </StyledLinksContainer>
    </StyledDashboard>
  );
};

export default Dashboard;
