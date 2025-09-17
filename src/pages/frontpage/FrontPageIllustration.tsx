import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import mapUrl from '../../resources/images/map.svg';
import handUrl from '../../resources/images/hand.svg';

export const FrontPageIllustration = () => {
  const { t } = useTranslation();

  return (
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
          width: 180,
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
          height: 'auto',
          display: 'block',
          position: 'relative',
          top: 40,
          left: -64,
        }}
      />
    </Box>
  );
};
