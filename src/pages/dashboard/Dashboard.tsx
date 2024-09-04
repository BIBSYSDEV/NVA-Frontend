import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Collapse, IconButton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LocalStorageKey } from '../../utils/constants';
import { dataTestId } from '../../utils/dataTestIds';
import { AboutContent } from '../infopages/AboutContent';
import HomePage from './HomePage';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showBanner, setShowBanner] = useState(localStorage.getItem(LocalStorageKey.ShowTagline) !== 'false');
  const [readMore, setReadMore] = useState(false);

  const toggleReadMore = () => setReadMore(!readMore);

  useEffect(() => {
    const loginPath = localStorage.getItem(LocalStorageKey.RedirectPath);
    if (loginPath) {
      localStorage.removeItem(LocalStorageKey.RedirectPath);
      navigate(loginPath);
    }
  }, [navigate]);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateAreas: "'tagline' 'description' 'links'",
        justifyItems: 'center',
        width: '100%',
      }}>
      <Helmet>
        <title>{t('common.start_page')}</title>
      </Helmet>
      {showBanner && (
        <Box sx={{ bgcolor: 'secondary.main', p: '1rem 0.5rem', width: '100%' }}>
          <Box
            sx={{
              gridArea: 'tagline',
              display: 'grid',
              gridTemplateAreas: {
                xs: "'text-tagline close-button' 'short-description short-description'",
                md: "'. text-tagline text-tagline close-button' '. . short-description .'",
              },
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 2.5fr 1fr' },
            }}>
            <Typography
              variant="h1"
              sx={{
                gridArea: 'text-tagline',
                fontSize: { xs: '2rem', sm: '3rem' },
              }}>
              {t('common.nva_tagline')}
            </Typography>
            <Box sx={{ gridArea: 'close-button' }}>
              <IconButton
                title={t('common.close_forever')}
                onClick={() => {
                  localStorage.setItem(LocalStorageKey.ShowTagline, 'false');
                  setShowBanner(false);
                }}
                size="large">
                <CloseIcon />
              </IconButton>
            </Box>
            <Typography
              variant="h3"
              variantMapping={{ h3: 'p' }}
              sx={{
                mt: '1.5rem',
                maxWidth: '40rem',
                gridArea: 'short-description',
                whiteSpace: 'pre-wrap',
              }}>
              {t('about.short_description')}
            </Typography>
          </Box>
          <Box
            sx={{
              gridArea: 'description',
              display: 'grid',
              gridTemplateAreas: {
                xs: "'button' 'text-description'",
                md: "'. . button .' '. text-description text-description .'",
              },
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 2.5fr 1fr' },
            }}>
            <Collapse in={readMore} sx={{ gridArea: 'text-description', mt: '1rem' }}>
              <AboutContent />
            </Collapse>
            <Box sx={{ mt: '1rem', gridArea: 'button' }}>
              <Button variant="contained" data-testid={dataTestId.startPage.readMoreButton} onClick={toggleReadMore}>
                {readMore ? t('common.read_less_about_nva') : t('common.read_more_about_nva')}
              </Button>
            </Box>
          </Box>
        </Box>
      )}
      <HomePage />
    </Box>
  );
};

export default Dashboard;
