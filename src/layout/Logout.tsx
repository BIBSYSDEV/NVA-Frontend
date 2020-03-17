import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@material-ui/core';
import styled from 'styled-components';

const StyledLoginComponent = styled.div`
  align-items: center;
  text-align: center;
`;

const StyledText = styled.div`
  margin-top: 1rem;
  display: block;
  font-weight: bold;
`;

const Logout: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <StyledLoginComponent>
      {t('logged_out')}
      <MuiLink component={Link} to="/">
        <StyledText>{t('back_to_home')}</StyledText>
      </MuiLink>
    </StyledLoginComponent>
  );
};

export default Logout;
