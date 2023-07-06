import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Box, Link as MuiLink, Typography } from '@mui/material';
import { UrlPathTemplate } from '../utils/urlPaths';
import { dataTestId } from '../utils/dataTestIds';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <Box
      component="footer"
      sx={{
        padding: '1rem',
        bgcolor: 'info.light',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '1fr 2fr 1fr' },
        gap: '0.5rem 1rem',
      }}>
      <MuiLink
        data-testid={dataTestId.footer.aboutLink}
        component={Link}
        to={UrlPathTemplate.About}
        sx={{ justifySelf: { xs: 'center', lg: 'start' }, gridRow: { xs: 3, lg: 1 } }}>
        {t('about.about_nva')}
      </MuiLink>
      <Typography sx={{ color: 'primary.main', gridColumn: { xs: 1, lg: 2 }, justifySelf: 'center' }}>
        {t('about.footer_text')}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifySelf: { xs: 'center', lg: 'end' },
          gap: '0.5rem',
          gridColumn: { xs: 1, lg: 3 },
        }}>
        <MuiLink
          data-testid={dataTestId.footer.availabilityStatement}
          target="_blank"
          rel="noopener noreferrer"
          href={'https://uustatus.no/nb/erklaringer/publisert/bffb4b1d-25eb-4fe0-bac7-2f0b4a8e0fd9'}>
          {t('about.availability_statement')}
        </MuiLink>
        <MuiLink data-testid={dataTestId.footer.privacyLink} component={Link} to={UrlPathTemplate.PrivacyPolicy}>
          {t('privacy.privacy_statement')}
        </MuiLink>
      </Box>
    </Box>
  );
};
