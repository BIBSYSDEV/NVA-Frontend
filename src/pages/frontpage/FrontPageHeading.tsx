import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import mapUrl from '../../resources/images/map.svg';
import handUrl from '../../resources/images/hand.svg';

const FrontPageHeading = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        px: { xs: 6, sm: 6 },
        py: { xs: 4, sm: 6 },
        justifyContent: 'center',
      }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          flex: 1,
          pr: { xs: 0, sm: 8, md: 12 },
          py: { xs: 1, sm: 1 },
        }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2.5rem', sm: '3rem' },
            fontWeight: 'bold',
            color: '#120732',
            lineHeight: { xs: '3rem', sm: '3.5rem' },
          }}>
          {t('common.page_title')}
        </Typography>
        <Typography
          sx={{
            fontSize: '1rem',
            fontWeight: 'normal',
          }}>
          {t('search_in_national_research_publication')}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: { xs: '100%', sm: 256 },
        }}>
        <Box
          component="img"
          src={mapUrl}
          alt={t('alt_text_illustration_of_norway')}
          sx={{
            width: 160,
            maxWidth: '100%',
            height: 'auto',
            display: 'block',
          }}
        />
        <Box
          component="img"
          src={handUrl}
          alt={t('alt_text_hand_with_magnifier')}
          sx={{
            width: 100,
            maxWidth: '100%',
            height: 'auto',
            display: 'block',
            position: 'relative',
            top: 40,
            left: -64,
          }}
        />
      </Box>
    </Box>
  );
};

export default FrontPageHeading;
