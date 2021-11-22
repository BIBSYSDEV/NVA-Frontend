import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Link as MuiLink, Typography } from '@mui/material';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { StyledCenteredContent } from '../../components/styled/Wrappers';

export const Forbidden = () => {
  const { t } = useTranslation('authorization');

  return (
    <StyledCenteredContent data-testid="forbidden">
      <Typography variant="h2" component="h1" paragraph>
        {t('forbidden')}
      </Typography>
      <Typography paragraph>{t('forbidden_description')}</Typography>
      <MuiLink component={Link} to={UrlPathTemplate.Home}>
        <Typography>{t('back_to_home')}</Typography>
      </MuiLink>
    </StyledCenteredContent>
  );
};
