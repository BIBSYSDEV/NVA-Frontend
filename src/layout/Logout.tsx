import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@material-ui/core';
import styled from 'styled-components';

import Heading from '../components/Heading';
import NormalText from '../components/NormalText';

const StyledLoginComponent = styled.div`
  text-align: center;
`;

const StyledText = styled(NormalText)`
  margin-top: 1rem;
`;

const Logout: FC = () => {
  const { t } = useTranslation('authorization');

  return (
    <StyledLoginComponent>
      <Heading>{t('logged_out')}</Heading>
      <MuiLink component={Link} to="/">
        <StyledText>{t('back_to_home')}</StyledText>
      </MuiLink>
    </StyledLoginComponent>
  );
};

export default Logout;
