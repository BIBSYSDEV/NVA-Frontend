import React, { FC } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Heading from '../../components/Heading';
import NormalText from '../../components/NormalText';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@material-ui/core';

const StyledNotFoundWrapper = styled.div`
  width: 100%;
  text-align: center;
  padding-top: 4rem;
`;

const StyledText = styled(NormalText)`
  margin-top: 1rem;
`;

const NotPublished: FC = () => {
  const { t } = useTranslation('authorization');

  return (
    <StyledNotFoundWrapper data-testid="not_published">
      <Heading>{t('publication_not_published')}</Heading>
      <MuiLink component={Link} to={'/'}>
        <StyledText>{t('back_to_home')}</StyledText>
      </MuiLink>
    </StyledNotFoundWrapper>
  );
};

export default NotPublished;
