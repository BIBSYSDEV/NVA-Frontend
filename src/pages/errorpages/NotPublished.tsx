import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Link as MuiLink, Typography } from '@material-ui/core';
import Heading from '../../components/Heading';
import { UrlPathTemplate } from '../../utils/urlPaths';

const StyledNotFoundWrapper = styled.div`
  width: 100%;
  text-align: center;
  padding-top: 4rem;
`;

const StyledText = styled(Typography)`
  margin-top: 1rem;
`;

const NotPublished = () => {
  const { t } = useTranslation('authorization');

  return (
    <StyledNotFoundWrapper data-testid="not_published">
      <Heading>{t('registration_not_published')}</Heading>
      <MuiLink component={Link} to={UrlPathTemplate.Home}>
        <StyledText>{t('back_to_home')}</StyledText>
      </MuiLink>
    </StyledNotFoundWrapper>
  );
};

export default NotPublished;
