import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import logo from '../resources/images/unit_logo.png';

const StyledFooter = styled.footer`
  display: grid;
  grid-template-areas: 'about logo privacy';
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  justify-items: center;
  min-height: 4rem;
  background: ${({ theme }) => theme.palette.background.paper};
`;

const StyledLogoContainer = styled.div`
  grid-area: logo;
`;

export const Footer = () => {
  const { t } = useTranslation('privacy');

  return (
    <StyledFooter>
      <StyledLogoContainer>
        <Typography>{t('common:delivered_by')}</Typography>
        <img src={logo} alt="UNIT logo" />
      </StyledLogoContainer>
    </StyledFooter>
  );
};
