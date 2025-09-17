import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const FrontPageHeading = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', mt: '3rem' }}>
      <Typography variant="h1" sx={{ fontSize: '3rem', color: '#120732' }}>
        {t('common.page_title')}
      </Typography>
      <Typography sx={{ fontSize: '1rem' }}>{t('search_in_national_research_publication')}</Typography>
    </Box>
  );
};
