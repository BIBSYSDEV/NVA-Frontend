import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@material-ui/core';
import styled from 'styled-components';

import Heading from '../components/Heading';
import NormalText from '../components/NormalText';

const StyledLinkText = styled(NormalText)`
  margin-top: 1rem;
`;

const Forbidden: React.FC = () => {
  const { t } = useTranslation('authorization');

  return (
    <section>
      <Heading>{t('forbidden')}</Heading>
      <NormalText>{t('forbidden_description')}</NormalText>
      <MuiLink component={Link} to="/">
        <StyledLinkText>{t('back_to_home')}</StyledLinkText>
      </MuiLink>
    </section>
  );
};

export default Forbidden;
