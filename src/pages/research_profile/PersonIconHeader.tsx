import PersonIcon from '@mui/icons-material/Person';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const PersonIconHeader = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
      <PersonIcon sx={{ bgcolor: 'person.main', borderRadius: '0.4rem' }} />
      <Typography>{t('common.person')}</Typography>
    </Box>
  );
};
