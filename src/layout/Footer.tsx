import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <Box
      component="footer"
      sx={{
        padding: '1rem',
        bgcolor: 'primary.main',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}>
      <Typography sx={{ color: 'primary.contrastText' }}>{t('about.footer_text')}</Typography>
    </Box>
  );
};
