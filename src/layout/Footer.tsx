import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Button } from '@material-ui/core';
import { UrlPathTemplate } from '../utils/urlPaths';

const StyledFooter = styled.div`
  display: grid;
  grid-template-areas: '. privacy';
  grid-template-columns: 4fr 1fr;
  align-items: center;
  min-height: 4rem;
  background: ${({ theme }) => theme.palette.background.footer};
`;

const StyledPrivacyButton = styled(Button)`
  grid-area: privacy;
  width: min-content;
`;

const Footer = () => {
  const { t } = useTranslation('privacy');

  return (
    <StyledFooter>
      <StyledPrivacyButton data-testid="privacy_statement_link" color="primary" href={UrlPathTemplate.PrivacyPolicy}>
        {t('privacy_statement')}
      </StyledPrivacyButton>
    </StyledFooter>
  );
};

export default Footer;
