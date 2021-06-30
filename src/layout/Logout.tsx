import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Link as MuiLink } from '@material-ui/core';
import Heading from '../components/Heading';
import NormalText from '../components/NormalText';
import { StyledPageWrapperWithMaxWidth } from '../components/styled/Wrappers';
import { UrlPathTemplate } from '../utils/urlPaths';

const StyledBackgroundDiv = styled(StyledPageWrapperWithMaxWidth)`
  text-align: center;
`;

const StyledText = styled(NormalText)`
  margin-top: 1rem;
`;

const Logout = () => {
  const { t } = useTranslation('authorization');

  return (
    <StyledBackgroundDiv>
      <Heading>{t('logged_out')}</Heading>
      <MuiLink component={Link} to={UrlPathTemplate.Home}>
        <StyledText>{t('back_to_home')}</StyledText>
      </MuiLink>
    </StyledBackgroundDiv>
  );
};

export default Logout;
