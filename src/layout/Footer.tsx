import React, { FC } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import logo from '../resources/images/unit_logo.png';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@material-ui/core';
import NormalText from '../components/NormalText';
import { UrlPathTemplate } from '../utils/urlPaths';

const StyledFooter = styled.div`
  display: grid;
  grid-template-areas: '. logo privacy';
  grid-template-columns: 1fr 1fr 1fr;
  min-height: 3rem;
  align-items: center;
  border-top: 2px solid ${({ theme }) => theme.palette.divider};
`;

const StyledLogoContainer = styled.div`
  grid-area: logo;
  justify-self: center;
`;

const StyledPrivacyPolicyContainer = styled.div`
  grid-area: privacy;
  justify-self: end;
  padding-right: 0.5rem;
`;

const Footer: FC = () => {
  const { t } = useTranslation('infopages');

  return (
    <StyledFooter>
      <StyledLogoContainer>
        <NormalText>{t('common:delivered_by')}</NormalText>
        <img src={logo} alt="UNIT logo" />
      </StyledLogoContainer>
      <StyledPrivacyPolicyContainer>
        <MuiLink
          aria-label={t('privacy:privacy_statement')}
          color="primary"
          component={Link}
          to={UrlPathTemplate.PrivacyPolicy}
          data-testid="privacy_statement_link">
          {t('privacy:privacy_statement')}
        </MuiLink>
      </StyledPrivacyPolicyContainer>
    </StyledFooter>
  );
};

export default Footer;
