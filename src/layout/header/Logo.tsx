import { Box, Button, Theme, Typography, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { UrlPathTemplate } from '../../utils/urlPaths';

export const Logo = () => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  return (
    <Box sx={{ gridArea: 'logo' }}>
      <Button data-testid="logo" component={RouterLink} to={UrlPathTemplate.Home}>
        <Typography variant="h5" component="span" sx={{ color: 'white', fontWeight: 900, fontSize: '3rem' }}>
          NVA
        </Typography>

        {!isMobile && (
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
    </Box>
  );
};
