import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Link as MuiLink, Typography } from '@material-ui/core';
import styled from 'styled-components';
import Heading from '../../components/Heading';
import { UrlPathTemplate } from '../../utils/urlPaths';

const StyledLinkText = styled(Typography)`
  margin-top: 1rem;
`;

const Forbidden = () => {
  const { t } = useTranslation('authorization');

  return (
    <section data-testid="forbidden">
      <Heading>{t('forbidden')}</Heading>
      <Typography>{t('forbidden_description')}</Typography>
      <MuiLink component={Link} to={UrlPathTemplate.Home}>
        <StyledLinkText>{t('back_to_home')}</StyledLinkText>
      </MuiLink>
    </section>
  );
};

export default Forbidden;
