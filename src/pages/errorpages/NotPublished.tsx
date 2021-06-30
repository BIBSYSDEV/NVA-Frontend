import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Link as MuiLink, Typography } from '@material-ui/core';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { StyledCenteredContent } from '../../components/styled/Wrappers';

const NotPublished = () => {
  const { t } = useTranslation('authorization');

  return (
    <StyledCenteredContent data-testid="not_published">
      <Typography variant="h2" component="h1" paragraph>
        {t('registration_not_published')}
      </Typography>
      <MuiLink component={Link} to={UrlPathTemplate.Home}>
        <Typography>{t('back_to_home')}</Typography>
      </MuiLink>
    </StyledCenteredContent>
  );
};

export default NotPublished;
