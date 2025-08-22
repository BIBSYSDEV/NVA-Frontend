import { Link, Theme, Typography, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router';
import { RootState } from '../../redux/store';
import { UrlPathTemplate } from '../../utils/urlPaths';

export const Logo = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const showShortLogoLoggedIn = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg')) && !!user;
  const showShortLogoAnonymous = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const showShortLogo = showShortLogoAnonymous || showShortLogoLoggedIn;

  return (
    <Link
      data-testid="logo"
      component={RouterLink}
      to={UrlPathTemplate.Root}
      sx={{ display: 'flex', alignItems: 'center', gap: '1rem', my: '1rem' }}>
      <img src="logo.svg" alt={t('sikt_logo')} height="45" />

      {!showShortLogo && (
        <Typography sx={{ color: 'white', fontSize: '1.2rem', lineHeight: 1.2, maxWidth: '10rem' }}>
          {t('common.page_title')}
        </Typography>
      )}
    </Link>
  );
};
