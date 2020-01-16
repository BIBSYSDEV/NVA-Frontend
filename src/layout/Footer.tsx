import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const StyledFooter = styled.div`
  display: flex;
  min-height: 3rem;
  font-size: 1rem;
  font-weight: bold;
  justify-content: center;
  align-items: center;
  border-top: 2px solid ${({ theme }) => theme.palette.separator.main};
`;

const StyledLogo = styled.img`
  margin-left: 0.3rem;
`;

const Footer: React.FC = () => {
  const { t } = useTranslation('');
  return (
    <StyledFooter>
      {t('delivered_by')}
      <StyledLogo src="unit_logo.png" alt="UNIT logo" />
    </StyledFooter>
  );
};

export default Footer;
