import { useTranslation } from 'react-i18next';
import { Box, Link, Typography } from '@mui/material';
import { UrlPathTemplate } from '../utils/urlPaths';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <Box
      component="footer"
      sx={{
        padding: '1rem',
        bgcolor: 'info.light',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        gap: '1rem',
      }}>
      <Box sx={{ gridColumn: { xs: 1, md: 2 }, justifySelf: 'center' }}>
        <Typography sx={{ color: 'primary.main' }}>{t('about.footer_text')}</Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifySelf: { xs: 'center', md: 'end' },
          gap: '0.5rem',
          gridColumn: { xs: 1, md: 3 },
        }}>
        <Link
          component="a"
          target="_blank"
          rel="noopener noreferrer"
          href={'https://uustatus.no/nb/erklaringer/publisert/bffb4b1d-25eb-4fe0-bac7-2f0b4a8e0fd9'}>
          {t('about.availability_statement')}
        </Link>
        <Link href={UrlPathTemplate.PrivacyPolicy}>{t('privacy.privacy_statement')}</Link>
      </Box>
    </Box>
  );
};
