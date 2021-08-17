import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Button, Typography } from '@material-ui/core';
import { UrlPathTemplate } from '../utils/urlPaths';
import logo from '../resources/images/unit_logo.png';

const StyledFooter = styled.footer`
  display: grid;
  grid-template-areas: 'about  logo  privacy';
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  min-height: 4rem;
  background: ${({ theme }) => theme.palette.background.footer};
`;

const StyledAboutButton = styled(Button)`
  grid-area: about;
  justify-self: center;
`;

const StyledLogoContainer = styled.div`
  grid-area: logo;
  justify-self: center;
`;

const StyledPrivacyButton = styled(Button)`
  grid-area: privacy;
  justify-self: center;
  word-break: break-all;
`;

export const Footer = () => {
  const { t } = useTranslation('privacy');

  return (
    <StyledFooter>
      <StyledLogoContainer>
        <Typography>{t('common:delivered_by')}</Typography>
        <img src={logo} alt="UNIT logo" />
      </StyledLogoContainer>
      <StyledAboutButton data-testid="about_link" color="primary" href={UrlPathTemplate.About}>
        {t('common:about_nva')}
      </StyledAboutButton>
      <StyledPrivacyButton data-testid="privacy_statement_link" color="primary" href={UrlPathTemplate.PrivacyPolicy}>
        {t('privacy_statement')}
      </StyledPrivacyButton>
    </StyledFooter>
  );
};
