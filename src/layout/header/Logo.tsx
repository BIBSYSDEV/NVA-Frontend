import { Button, Theme, Typography, useMediaQuery } from '@mui/material';
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
    <Button sx={{ gridArea: 'logo' }} data-testid="logo" component={RouterLink} to={UrlPathTemplate.Root}>
      <Typography variant="h5" component="span" sx={{ color: 'white', fontWeight: 900, fontSize: '3rem' }}>
        NVA
      </Typography>

      {!showShortLogo && (
        <Typography
          variant="h1"
          component="span"
          sx={{
            ml: '1.2rem',
            color: 'white',
            fontWeight: 20,
            fontSize: '1rem',
            maxWidth: '6rem',
          }}>
          {t('common.page_title')}
        </Typography>
      )}
    </Button>
  );
};
