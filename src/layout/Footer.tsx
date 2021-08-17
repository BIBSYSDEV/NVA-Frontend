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
  justify-items: center;
  min-height: 4rem;
  background: ${({ theme }) => theme.palette.background.footer};
`;

const StyledAboutButton = styled(Button).attrs({ component: Link, to: UrlPathTemplate.About })`
  grid-area: about;
`;

const StyledLogoContainer = styled.div`
  grid-area: logo;
`;

const StyledPrivacyButton = styled(Button).attrs({ component: Link, to: UrlPathTemplate.PrivacyPolicy })`
  grid-area: privacy;
  word-break: break-all;
`;

export const Footer = () => {
  const { t } = useTranslation('privacy');

  return (
    <StyledFooter>
      <StyledAboutButton data-testid="about_link" color="primary">
        {t('common:about_nva')}
      </StyledAboutButton>
      <StyledLogoContainer>
        <Typography>{t('common:delivered_by')}</Typography>
        <img src={logo} alt="UNIT logo" />
      </StyledLogoContainer>
      <StyledPrivacyButton data-testid="privacy_statement_link" color="primary">
        {t('privacy_statement')}
      </StyledPrivacyButton>
    </StyledFooter>
  );
};
