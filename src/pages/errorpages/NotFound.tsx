import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation('feedback');

  return (
    <Box data-testid="404" sx={{ mt: '4rem' }}>
      <Typography variant="h3" component="h1">
        {t('error.404_page')}
      </Typography>
    </Box>
  );
};

export default NotFound;
