import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Box, Button, Collapse, IconButton, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { AboutContent } from '../infopages/AboutContent';
import { dataTestId } from '../../utils/dataTestIds';
import SearchPage from '../search/SearchPage';
import { LocalStorageKey } from '../../utils/constants';

const Dashboard = () => {
  const { t } = useTranslation('common');
  const history = useHistory();
  const [showBanner, setShowBanner] = useState(localStorage.getItem(LocalStorageKey.ShowTagline) !== 'false');
  const [readMore, setReadMore] = useState(false);

  const toggleReadMore = () => setReadMore(!readMore);

  useEffect(() => {
    const loginPath = localStorage.getItem(LocalStorageKey.RedirectPath);
    if (loginPath) {
      localStorage.removeItem(LocalStorageKey.RedirectPath);
      history.push(loginPath);
    }
  }, [history]);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateAreas: "'tagline' 'description' 'links'",
        justifyItems: 'center',
        width: '100%',
      }}>
      <Helmet>
        <title>{t('start_page')}</title>
      </Helmet>
      {showBanner && (
        <Box sx={{ bgcolor: 'primary.dark', p: '1rem 0.5rem', 'h1,p,li,a,svg': { color: 'white' } }}>
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
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 'bold',
                maxWidth: '40rem',
                gridArea: 'text-tagline',
                fontSize: { xs: '2rem', sm: '3rem' },
              }}>
              {t('nva_tagline')}
            </Typography>
            <Box sx={{ gridArea: 'close-button' }}>
              <IconButton
                title={t('close_forever')}
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
              sx={{ mt: '1.5rem', maxWidth: '40rem', gridArea: 'short-description', whiteSpace: 'pre-wrap' }}>
              {t('about:short_description')}
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
              <Button
                color="secondary"
                variant="contained"
                data-testid={dataTestId.startPage.readMoreButton}
                onClick={toggleReadMore}>
                {t(readMore ? 'read_less_about_nva' : 'read_more_about_nva')}
              </Button>
            </Box>
          </Box>
        </Box>
      )}
      <SearchPage />
    </Box>
  );
};

export default Dashboard;
