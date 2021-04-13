import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Collapse, Typography } from '@material-ui/core';
import PostAddIcon from '@material-ui/icons/PostAdd';
import SearchIcon from '@material-ui/icons/Search';
import BackgroundDiv from '../../components/BackgroundDiv';
import { RootStore } from '../../redux/reducers/rootReducer';
import lightTheme from '../../themes/lightTheme';
import { LOGIN_REDIRECT_PATH_KEY } from '../../utils/constants';
import { UrlPathTemplate } from '../../utils/urlPaths';
import AboutContent from '../infopages/AboutContent';

const StyledDashboard = styled.div`
  display: grid;
  grid-template-areas: 'tagline' 'description' 'links';
  justify-items: center;
  width: 100%;
`;

const StyledTaglineDiv = styled(BackgroundDiv)`
  grid-area: tagline;
  margin: 0;
  display: grid;
  grid-template-areas: '. text-tagline text-tagline .' '. . short-description .';
  grid-template-columns: 1fr 1fr 2.5fr 1fr;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    grid-template-areas: 'text-tagline' 'short-description';
    grid-template-columns: 1fr;
  }
`;

const StyledDescriptionDiv = styled(BackgroundDiv)`
  grid-area: description;
  display: grid;
  grid-template-areas: '. . button .' '. text-description text-description .';
  grid-template-columns: 1fr 1fr 2.5fr 1fr;
  margin: 0;
  padding: 0 0 2rem 1rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    grid-template-areas: 'button' 'text-description';
    grid-template-columns: 1fr;
    padding: 0 0 1rem 2rem;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    padding: 0 0 0 0.5rem;
  }
`;

const StyledLinksContainer = styled(BackgroundDiv)`
  display: grid;
  grid-area: links;
  grid-template-areas: '. search new-registration .';
  grid-template-columns: 1fr 3fr 3fr 1fr;
  gap: 2rem;
  margin-top: 1rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    grid-template-areas: 'search new-registration';
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    padding: 0.5rem;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-areas: 'search' 'new-registration';
    grid-template-columns: 1fr;
  }
`;

const StyledLinkButton = styled(Button)`
  border: 2px solid;
  border-radius: 4px;
  padding: 1rem 6rem;
  text-decoration: none;
  text-transform: none;
  color: ${({ theme }) => theme.palette.primary.main};
`;

const StyledSearchButton = styled(StyledLinkButton)`
  grid-area: search;
  border-color: ${({ theme }) => theme.palette.secondary.main};
`;

const StyledNewRegistrationButton = styled(StyledLinkButton)`
  grid-area: new-registration;
  border-color: ${({ theme }) => theme.palette.primary.main};
`;

const StyledLinkContent = styled.div`
  display: grid;
  grid-template-areas: 'icon' 'text';
  justify-items: center;
  gap: 1rem;
`;

const StyledText = styled.div`
  grid-area: text;
  text-align: center;
`;

const StyledTagline = styled(Typography)`
  font-family: 'Barlow', sans-serif;
  font-weight: bold;
  max-width: 40rem;
  grid-area: text-tagline;
  white-space: pre-wrap;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    font-size: 2rem;
  }
`;

const StyledShortDescription = styled(Typography)`
  padding-top: 1.5rem;
  max-width: 40rem;
  grid-area: short-description;
  white-space: pre-wrap;
`;

const StyledCollapse = styled(Collapse)`
  grid-area: text-description;
  padding-top: 1rem;
`;

const StyledButtonWrapper = styled.div`
  grid-area: button;
`;

const Dashboard = () => {
  const { t } = useTranslation('common');
  const history = useHistory();
  const { user } = useSelector((store: RootStore) => store);
  const [readMore, setReadMore] = useState(false);

  const toggleReadMore = () => setReadMore(!readMore);

  useEffect(() => {
    const loginPath = localStorage.getItem(LOGIN_REDIRECT_PATH_KEY);
    if (loginPath) {
      localStorage.removeItem(LOGIN_REDIRECT_PATH_KEY);
      history.push(loginPath);
    }
  }, [history]);

  return (
    <StyledDashboard>
      <Helmet>
        <title>{t('start_page')}</title>
      </Helmet>
      <StyledTaglineDiv backgroundColor={lightTheme.palette.section.megaDark}>
        <StyledTagline variant="h1">{t('nva_tagline')}</StyledTagline>
        <StyledShortDescription variant="h3" variantMapping={{ h3: 'p' }}>
          {t('about:short_description')}
        </StyledShortDescription>
      </StyledTaglineDiv>
      <StyledDescriptionDiv backgroundColor={lightTheme.palette.section.megaDark}>
        <StyledCollapse in={readMore} collapsedHeight="0rem">
          <AboutContent />
        </StyledCollapse>
        <StyledButtonWrapper>
          <Button color="secondary" variant="contained" data-testid="button-read-more" onClick={toggleReadMore}>
            {t(readMore ? 'read_less' : 'read_more')}
          </Button>
        </StyledButtonWrapper>
      </StyledDescriptionDiv>
      <StyledLinksContainer>
        <StyledSearchButton href={UrlPathTemplate.Search}>
          <StyledLinkContent>
            <SearchIcon fontSize="large" />
            <StyledText>
              <Typography variant="h4" component="p">
                {t('search_for_publication')}
              </Typography>
            </StyledText>
          </StyledLinkContent>
        </StyledSearchButton>
        <StyledNewRegistrationButton
          href={user ? UrlPathTemplate.NewRegistration : UrlPathTemplate.Login}
          onClick={() => {
            if (!user) {
              localStorage.setItem(LOGIN_REDIRECT_PATH_KEY, UrlPathTemplate.NewRegistration);
            }
          }}>
          <StyledLinkContent>
            <PostAddIcon fontSize="large" />
            <StyledText>
              <Typography variant="h4" component="p">
                {t('registration:new_registration')}
              </Typography>
              {!user && <Typography>{t('requires_login')}</Typography>}
            </StyledText>
          </StyledLinkContent>
        </StyledNewRegistrationButton>
      </StyledLinksContainer>
    </StyledDashboard>
  );
};

export default Dashboard;
