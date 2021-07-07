import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Link as MuiLink, Typography } from '@material-ui/core';
import { StyledCenteredContent } from '../components/styled/Wrappers';
import { UrlPathTemplate } from '../utils/urlPaths';

const Logout = () => {
  const { t } = useTranslation('authorization');

  return (
    <StyledCenteredContent>
      <Typography variant="h2" component="h1" paragraph>
        {t('logged_out')}
      </Typography>
      <MuiLink component={Link} to={UrlPathTemplate.Home}>
        <Typography>{t('back_to_home')}</Typography>
      </MuiLink>
    </StyledCenteredContent>
  );
};

export default Logout;
