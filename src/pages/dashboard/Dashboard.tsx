import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Collapse, Typography } from '@material-ui/core';
import PostAddIcon from '@material-ui/icons/PostAdd';
import SearchIcon from '@material-ui/icons/Search';
import BackgroundDiv from '../../components/BackgroundDiv';
import { StyledRightAlignedWrapper } from '../../components/styled/Wrappers';
import lightTheme from '../../themes/lightTheme';
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
  grid-template-areas: '. text-tagline .';
  grid-template-columns: 1fr 2fr 1fr;
`;

const StyledDescriptionDiv = styled(BackgroundDiv)`
  grid-area: description;
  margin: 0;
  padding-top: 0;
`;

const StyledLinksContainer = styled(BackgroundDiv)`
  display: grid;
  grid-area: links;
  grid-template-areas: '. search new-registration .';
  grid-template-columns: 1fr 3fr 3fr 1fr;
  gap: 2rem;
`;

const StyledLink = styled(Link)`
  border: 2px solid;
  border-radius: 4px;
  padding: 1rem 6rem;
  text-decoration: none;
`;

const StyledSearchLink = styled(StyledLink)`
  grid-area: search;
  border-color: ${({ theme }) => theme.palette.secondary.main};
`;

const StyledNewRegistrationLink = styled(StyledLink)`
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

const StyledTypography = styled(Typography)`
  max-width: 40rem;
  grid-area: text-tagline;
`;

const Dashboard = () => {
  const { t } = useTranslation('common');
  const [readMore, setReadMore] = useState(false);

  const toggleReadMore = () => setReadMore(!readMore);

  return (
    <StyledDashboard>
      <StyledTaglineDiv backgroundColor={lightTheme.palette.section.megaDark}>
        <StyledTypography variant="h3" variantMapping={{ h3: 'p' }}>
          {t('about:short_description')}
        </StyledTypography>
      </StyledTaglineDiv>
      <StyledDescriptionDiv backgroundColor={lightTheme.palette.section.megaDark}>
        <Collapse in={readMore} collapsedHeight="0rem">
          <AboutContent />
        </Collapse>
        <StyledRightAlignedWrapper>
          <Button color="secondary" variant="contained" data-testid="button-read-more" onClick={toggleReadMore}>
            {t(readMore ? 'read_less' : 'read_more')}
          </Button>
        </StyledRightAlignedWrapper>
      </StyledDescriptionDiv>
      <StyledLinksContainer>
        <StyledSearchLink to={UrlPathTemplate.Search}>
          <StyledLinkContent>
            <SearchIcon fontSize="large" />
            <StyledText>
              <Typography variant="h4" variantMapping={{ h4: 'p' }}>
                {t('search_for_publication')}
              </Typography>
            </StyledText>
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
