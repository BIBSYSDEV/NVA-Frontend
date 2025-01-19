import { Box, Link as MuiLink, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { UrlPathTemplate } from '../../utils/urlPaths';

export const NotPublished = () => {
  const { t } = useTranslation();

  return (
    <Box data-testid="not_published" sx={{ mt: '4rem' }}>
      <Typography variant="h2" component="h1" sx={{ mb: '1rem' }}>
        {t('authorization.registration_not_published')}
      </Typography>
      <MuiLink component={Link} to={UrlPathTemplate.Root}>
        <Typography>{t('authorization.back_to_home')}</Typography>
      </MuiLink>
    </Box>
  );
};
