import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Box, Link as MuiLink, Typography } from '@mui/material';
import { UrlPathTemplate } from '../../utils/urlPaths';

export const Forbidden = () => {
  const { t } = useTranslation('authorization');

  return (
    <Box data-testid="forbidden" sx={{ mt: '4rem' }}>
      <Typography variant="h2" component="h1" paragraph>
        {t('forbidden')}
      </Typography>
      <Typography paragraph>{t('forbidden_description')}</Typography>
      <MuiLink component={Link} to={UrlPathTemplate.Home}>
        <Typography>{t('back_to_home')}</Typography>
      </MuiLink>
    </Box>
  );
};
