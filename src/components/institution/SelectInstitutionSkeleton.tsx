import { Box, Skeleton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const SelectInstitutionSkeleton = () => {
  const { t } = useTranslation();
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ width: '100%' }}>
        <Typography variant="h3" sx={{ fontWeight: 'normal' }}>
          {t('common.select_institution')}
        </Typography>
        <Skeleton height={90} />
      </Box>
      <Box sx={{ width: '100%' }}>
        <Typography variant="h3" sx={{ marginTop: '1rem', fontWeight: 'normal' }}>
          {t('common.select_unit')}
        </Typography>
        <Skeleton height={90} />
      </Box>
    </Box>
  );
};
