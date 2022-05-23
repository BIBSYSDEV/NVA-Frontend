import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';

export const Footer = () => {
  const { t } = useTranslation('about');

  return (
    <Box
      sx={{
        padding: '1rem',
        bgcolor: 'background.paper',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}>
      <Typography>{t('footer_text')}</Typography>
    </Box>
  );
};
