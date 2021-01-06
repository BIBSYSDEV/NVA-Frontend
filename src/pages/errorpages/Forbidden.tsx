import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@material-ui/core';
import styled from 'styled-components';
import Heading from '../../components/Heading';
import NormalText from '../../components/NormalText';
import { UrlPathTemplate } from '../../utils/urlPaths';

const StyledLinkText = styled(NormalText)`
  margin-top: 1rem;
`;

const Forbidden: FC = () => {
  const { t } = useTranslation('authorization');

  return (
    <section data-testid="forbidden">
      <Heading>{t('forbidden')}</Heading>
      <NormalText>{t('forbidden_description')}</NormalText>
      <MuiLink component={Link} to={UrlPathTemplate.Home}>
        <StyledLinkText>{t('back_to_home')}</StyledLinkText>
      </MuiLink>
    </section>
  );
};

export default Forbidden;
