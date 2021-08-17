import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Button, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { UrlPathTemplate } from '../utils/urlPaths';
import logo from '../resources/images/unit_logo.png';

const StyledFooter = styled.footer`
  display: grid;
  grid-template-areas: 'about logo privacy';
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  min-height: 4rem;
  background: ${({ theme }) => theme.palette.background.footer};
`;

const StyledAboutButtonContainer = styled.div`
  grid-area: about;
  justify-self: center;
`;

const StyledLogoContainer = styled.div`
  grid-area: logo;
  justify-self: center;
`;

const StyledPrivacyButtonContainer = styled.div`
  grid-area: privacy;
  justify-self: center;
  word-break: break-all;
`;

export const Footer = () => {
  const { t } = useTranslation('privacy');

  return (
    <StyledFooter>
      <StyledAboutButtonContainer>
        <Button data-testid="about_link" color="primary" component={Link} to={UrlPathTemplate.About}>
          {t('common:about_nva')}
        </Button>
      </StyledAboutButtonContainer>
      <StyledLogoContainer>
        <Typography>{t('common:delivered_by')}</Typography>
        <img src={logo} alt="UNIT logo" />
      </StyledLogoContainer>
      <StyledPrivacyButtonContainer>
        <Button
          data-testid="privacy_statement_link"
          color="primary"
          component={Link}
          to={UrlPathTemplate.PrivacyPolicy}>
          {t('privacy_statement')}
        </Button>
      </StyledPrivacyButtonContainer>
    </StyledFooter>
  );
};
