import { Box, Link as MuiLink, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { UrlPathTemplate } from '../../utils/urlPaths';

export const Forbidden = () => {
  const { t } = useTranslation();

  return (
    <Box data-testid="forbidden" sx={{ mt: '4rem' }}>
      <Typography variant="h2" component="h1" sx={{ mb: '1rem' }}>
        {t('authorization.forbidden')}
      </Typography>
      <Typography sx={{ mb: '1rem' }}>{t('authorization.forbidden_description')}</Typography>
      <MuiLink component={Link} to={UrlPathTemplate.Root}>
        <Typography>{t('authorization.back_to_home')}</Typography>
      </MuiLink>
    </Box>
  );
};
