import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button, Collapse, Typography } from '@material-ui/core';
import { BackgroundDiv } from '../../components/BackgroundDiv';
import { lightTheme } from '../../themes/lightTheme';
import { AboutContent } from '../infopages/AboutContent';
import { dataTestId } from '../../utils/dataTestIds';
import SearchPage from '../search/SearchPage';
import { useHistory } from 'react-router-dom';
import { REDIRECT_PATH_KEY } from '../../utils/constants';

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

const StyledTagline = styled(Typography)`
  font-family: 'Barlow', sans-serif;
  font-weight: bold;
  max-width: 40rem;
  grid-area: text-tagline;
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
  const [readMore, setReadMore] = useState(false);

  const toggleReadMore = () => setReadMore(!readMore);

  useEffect(() => {
    const loginPath = localStorage.getItem(REDIRECT_PATH_KEY);
    if (loginPath) {
      localStorage.removeItem(REDIRECT_PATH_KEY);
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
        <StyledCollapse in={readMore}>
          <AboutContent />
        </StyledCollapse>
        <StyledButtonWrapper>
          <Button
            color="secondary"
            variant="contained"
            data-testid={dataTestId.startPage.readMoreButton}
            onClick={toggleReadMore}>
            {t(readMore ? 'read_less_about_nva' : 'read_more_about_nva')}
          </Button>
        </StyledButtonWrapper>
      </StyledDescriptionDiv>
      <SearchPage />
    </StyledDashboard>
  );
};

export default Dashboard;
